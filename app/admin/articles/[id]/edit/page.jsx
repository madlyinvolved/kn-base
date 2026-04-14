'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '../../../../../lib/supabase/client.js'
import ArticleEditor from '../../../../../components/admin/ArticleEditor.jsx'
import { textToTipTapJSON, isValidTipTapDoc } from '../../../../../lib/utils/tiptap.js'

const previewOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.5)',
  zIndex: 300,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const previewCardStyle = {
  background: 'var(--color-bg)',
  borderRadius: '16px',
  width: '100%',
  maxWidth: '700px',
  maxHeight: '80vh',
  overflow: 'auto',
  padding: '32px',
  boxShadow: 'var(--shadow-lg)',
}

function computeSnapshot(title, summary, categoryId, editorData, isPublished) {
  return JSON.stringify({
    title: title.trim(),
    summary: summary.trim(),
    categoryId,
    json: editorData.json,
    isPublished,
  })
}

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const articleId = Number(params.id)

  const [categories, setCategories] = useState([])
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [initialContent, setInitialContent] = useState(null)
  const [editorData, setEditorData] = useState({ json: {}, text: '', html: '' })
  const [isPublished, setIsPublished] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [canEdit, setCanEdit] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const lastSaved = useRef('')

  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const [{ data: cats }, { data: article }, { data: userRes }] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('articles').select('*').eq('id', articleId).single(),
        supabase.auth.getUser(),
      ])

      setCategories(cats || [])

      if (userRes?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userRes.user.id)
          .single()
        setCanEdit(profile?.role === 'admin')
      }

      if (article) {
        setTitle(article.title)
        setSummary(article.summary || '')
        setCategoryId(article.category_id)
        setIsPublished(article.is_published)

        if (isValidTipTapDoc(article.content)) {
          setInitialContent(article.content)
        } else if (article.content_text) {
          setInitialContent(textToTipTapJSON(article.content_text))
        }

        lastSaved.current = computeSnapshot(
          article.title,
          article.summary || '',
          article.category_id,
          { json: article.content || {}, text: article.content_text || '', html: '' },
          article.is_published,
        )
      }

      setLoaded(true)
    }

    load()
  }, [articleId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!loaded) return
    const current = computeSnapshot(title, summary, categoryId, editorData, isPublished)
    setIsDirty(current !== lastSaved.current)
  }, [title, summary, categoryId, editorData, isPublished, loaded])

  const doSave = useCallback(
    async (publish) => {
      if (!canEdit) return false
      setSaving(true)
      setSaveStatus('Сохранение...')

      const nextPublished = publish != null ? publish : isPublished
      const payload = {
        title: title.trim(),
        summary: summary.trim() || null,
        category_id: categoryId,
        content: editorData.json,
        content_text: editorData.text,
        is_published: nextPublished,
      }

      const { error } = await supabase.from('articles').update(payload).eq('id', articleId)

      setSaving(false)

      if (error) {
        setSaveStatus(`Ошибка: ${error.message}`)
        return false
      }

      if (publish != null) setIsPublished(publish)
      lastSaved.current = computeSnapshot(title, summary, categoryId, editorData, nextPublished)
      setIsDirty(false)
      setSaveStatus('Сохранено')
      return true
    },
    [title, summary, categoryId, editorData, articleId, isPublished, canEdit, supabase],
  )

  if (!loaded) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        Загрузка...
      </div>
    )
  }

  const canSave = canEdit && isDirty && title.trim().length > 0 && !saving

  return (
    <div>
      <div className="editor-sticky-actions">
        <button className="editor-btn-ghost" onClick={() => router.push('/admin/articles')}>
          ← Назад
        </button>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
          Редактирование
        </h1>

        <div style={{ flex: 1 }} />

        {isDirty && <span className="editor-unsaved-banner">Несохранённые изменения</span>}
        {!isDirty && saveStatus && <span className="editor-save-status">{saveStatus}</span>}

        <button
          className="editor-btn-primary"
          onClick={() => doSave(isPublished)}
          disabled={!canSave}
          title={!canEdit ? 'У вас нет прав на редактирование' : undefined}
        >
          Сохранить
        </button>
        {!isPublished && (
          <button
            className="editor-btn-outline"
            onClick={() => doSave(true)}
            disabled={!canEdit || !title.trim() || saving}
          >
            Опубликовать
          </button>
        )}
        {isPublished && (
          <button
            className="editor-btn-outline"
            onClick={() => doSave(false)}
            disabled={!canEdit || saving}
          >
            Снять с публикации
          </button>
        )}
        <button className="editor-btn-outline" onClick={() => setShowPreview(true)}>
          Предпросмотр
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '4px', color: 'var(--color-text-secondary)' }}>
            Заголовок
          </label>
          <input
            className="editor-field-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите заголовок статьи"
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '4px', color: 'var(--color-text-secondary)' }}>
            Категория
          </label>
          <select
            className="editor-field-select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '4px', color: 'var(--color-text-secondary)' }}>
          Краткое описание
        </label>
        <input
          className="editor-field-summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Краткое описание для поиска и превью"
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        {initialContent !== null ? (
          <ArticleEditor content={initialContent} onUpdate={setEditorData} saveStatus={!isDirty ? saveStatus : undefined} />
        ) : (
          <ArticleEditor content={null} onUpdate={setEditorData} saveStatus={!isDirty ? saveStatus : undefined} />
        )}
      </div>

      {showPreview && (
        <div style={previewOverlayStyle} onClick={() => setShowPreview(false)}>
          <div style={previewCardStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Предпросмотр</h2>
              <button className="editor-btn-outline" style={{ padding: '6px 12px', fontSize: '0.8125rem' }} onClick={() => setShowPreview(false)}>
                Закрыть
              </button>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '16px' }}>
              {title || 'Без заголовка'}
            </h1>
            <div style={{ lineHeight: 1.45, fontSize: '1rem' }} className="tiptap-editor">
              <div
                className="tiptap"
                dangerouslySetInnerHTML={{ __html: editorData.html || '<p>Пустая статья</p>' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
