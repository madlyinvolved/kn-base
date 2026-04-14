'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/client.js'
import ArticleEditor from '../../../../components/admin/ArticleEditor.jsx'

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

function computeSnapshot(title, summary, categoryId, editorData) {
  return JSON.stringify({
    title: title.trim(),
    summary: summary.trim(),
    categoryId,
    json: editorData.json,
  })
}

export default function NewArticlePage() {
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [editorData, setEditorData] = useState({ json: {}, text: '', html: '' })
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [articleId, setArticleId] = useState(null)
  const [canEdit, setCanEdit] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const lastSaved = useRef('')
  const loadedRef = useRef(false)

  const supabase = createClient()

  useEffect(() => {
    async function init() {
      const [{ data: cats }, { data: userRes }] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.auth.getUser(),
      ])

      setCategories(cats || [])
      if (cats?.length) setCategoryId(cats[0].id)

      if (userRes?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userRes.user.id)
          .single()
        setCanEdit(profile?.role === 'admin')
      }

      loadedRef.current = true
    }

    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!loadedRef.current) return
    const current = computeSnapshot(title, summary, categoryId, editorData)
    setIsDirty(current !== lastSaved.current)
  }, [title, summary, categoryId, editorData])

  const doSave = useCallback(
    async (publish = false) => {
      if (!canEdit) return false
      if (!title.trim() || !categoryId) return false

      setSaving(true)
      setSaveStatus('Сохранение...')

      const payload = {
        title: title.trim(),
        summary: summary.trim() || null,
        category_id: categoryId,
        content: editorData.json,
        content_text: editorData.text,
        is_published: publish,
      }

      let result
      if (articleId) {
        result = await supabase
          .from('articles')
          .update(payload)
          .eq('id', articleId)
          .select()
          .single()
      } else {
        result = await supabase.from('articles').insert(payload).select().single()
      }

      setSaving(false)

      if (result.error) {
        setSaveStatus(`Ошибка: ${result.error.message}`)
        return false
      }

      if (!articleId && result.data) {
        setArticleId(result.data.id)
      }

      lastSaved.current = computeSnapshot(title, summary, categoryId, editorData)
      setIsDirty(false)
      setSaveStatus(publish ? 'Опубликовано' : 'Черновик сохранён')
      return true
    },
    [title, summary, categoryId, editorData, articleId, canEdit, supabase],
  )

  async function handlePublish() {
    const ok = await doSave(true)
    if (ok) {
      router.push('/admin/articles')
    }
  }

  async function handleSaveDraft() {
    await doSave(false)
  }

  const hasTitle = title.trim().length > 0
  const canPublish = canEdit && hasTitle && !saving
  const canSaveDraft = canEdit && hasTitle && !saving && isDirty

  return (
    <div>
      <div className="editor-sticky-actions">
        <button className="editor-btn-ghost" onClick={() => router.push('/admin/articles')}>
          ← Назад
        </button>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
          Новая статья
        </h1>

        <div style={{ flex: 1 }} />

        {isDirty && <span className="editor-unsaved-banner">Несохранённые изменения</span>}
        {!isDirty && saveStatus && <span className="editor-save-status">{saveStatus}</span>}

        <button
          className="editor-btn-primary"
          onClick={handlePublish}
          disabled={!canPublish}
          title={!canEdit ? 'У вас нет прав на создание' : undefined}
        >
          Опубликовать
        </button>
        <button
          className="editor-btn-outline"
          onClick={handleSaveDraft}
          disabled={!canSaveDraft}
        >
          Сохранить черновик
        </button>
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
            required
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
        <ArticleEditor content={null} onUpdate={setEditorData} saveStatus={!isDirty ? saveStatus : undefined} />
      </div>

      {showPreview && (
        <div style={previewOverlayStyle} onClick={() => setShowPreview(false)}>
          <div style={previewCardStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>
                Предпросмотр
              </h2>
              <button className="editor-btn-outline" style={{ padding: '6px 12px', fontSize: '0.8125rem' }} onClick={() => setShowPreview(false)}>
                Закрыть
              </button>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '16px' }}>
              {title || 'Без заголовка'}
            </h1>
            <div style={{ lineHeight: 1.35, fontSize: '1rem' }} className="tiptap-editor">
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
