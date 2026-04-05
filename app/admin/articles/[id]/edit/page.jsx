'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '../../../../../lib/supabase/client.js'
import ArticleEditor from '../../../../../components/admin/ArticleEditor.jsx'

const titleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '2rem',
  fontWeight: 700,
}

const fieldStyle = { marginBottom: '16px' }

const labelStyle = {
  display: 'block',
  fontSize: '0.8125rem',
  fontWeight: 500,
  marginBottom: '6px',
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  fontSize: '0.9375rem',
  fontFamily: 'var(--font-body)',
  border: '1px solid var(--color-border)',
  borderRadius: '8px',
  outline: 'none',
  boxSizing: 'border-box',
}

const selectStyle = { ...inputStyle, fontSize: '0.875rem' }

const btnBase = {
  padding: '10px 20px',
  fontSize: '0.875rem',
  fontFamily: 'var(--font-body)',
  fontWeight: 600,
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
}

const statusStyle = {
  fontSize: '0.75rem',
  color: 'var(--color-text-secondary)',
  marginLeft: '12px',
}

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
  const autosaveTimer = useRef(null)
  const lastSaved = useRef('')

  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const [{ data: cats }, { data: article }] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('articles').select('*').eq('id', articleId).single(),
      ])

      setCategories(cats || [])

      if (article) {
        setTitle(article.title)
        setSummary(article.summary || '')
        setCategoryId(article.category_id)
        setIsPublished(article.is_published)

        // If content is TipTap JSON, use it; otherwise create paragraph from text
        const hasJsonContent =
          article.content && typeof article.content === 'object' && article.content.type === 'doc'
        if (hasJsonContent) {
          setInitialContent(article.content)
        } else if (article.content_text) {
          setInitialContent({
            type: 'doc',
            content: article.content_text
              .split('\n\n')
              .map((p) => ({
                type: 'paragraph',
                content: p ? [{ type: 'text', text: p }] : [],
              })),
          })
        }
      }

      setLoaded(true)
    }

    load()
  }, [articleId]) // eslint-disable-line react-hooks/exhaustive-deps

  const doSave = useCallback(
    async (publish) => {
      setSaving(true)
      setSaveStatus('Сохранение...')

      const payload = {
        title: title.trim(),
        summary: summary.trim() || null,
        category_id: categoryId,
        content: editorData.json,
        content_text: editorData.text,
        is_published: publish != null ? publish : isPublished,
      }

      const { error } = await supabase
        .from('articles')
        .update(payload)
        .eq('id', articleId)

      setSaving(false)

      if (error) {
        setSaveStatus(`Ошибка: ${error.message}`)
        return false
      }

      if (publish != null) setIsPublished(publish)
      lastSaved.current = JSON.stringify(payload)
      setSaveStatus('Сохранено')
      return true
    },
    [title, summary, categoryId, editorData, articleId, isPublished, supabase],
  )

  // Autosave every 30 seconds
  useEffect(() => {
    if (!loaded) return
    autosaveTimer.current = setInterval(() => {
      const current = JSON.stringify({ title, summary, categoryId, text: editorData.text })
      if (current !== lastSaved.current && title.trim()) {
        doSave(null)
      }
    }, 30000)

    return () => clearInterval(autosaveTimer.current)
  }, [title, summary, categoryId, editorData, doSave, loaded])

  if (!loaded) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        Загрузка...
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={titleStyle}>Редактирование статьи</h1>
        <span style={statusStyle}>{saveStatus}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '16px', marginBottom: '20px' }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Заголовок</label>
          <input
            style={inputStyle}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Категория</label>
          <select
            style={selectStyle}
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

      <div style={fieldStyle}>
        <label style={labelStyle}>Краткое описание</label>
        <input
          style={inputStyle}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Содержание</label>
        {initialContent !== null ? (
          <ArticleEditor content={initialContent} onUpdate={setEditorData} />
        ) : (
          <ArticleEditor content={null} onUpdate={setEditorData} />
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          style={{ ...btnBase, background: 'var(--color-accent)', color: 'white' }}
          onClick={() => doSave(true)}
          disabled={saving}
        >
          {isPublished ? 'Сохранить' : 'Опубликовать'}
        </button>
        {isPublished && (
          <button
            style={{ ...btnBase, background: '#fef3c7', color: '#92400e' }}
            onClick={() => doSave(false)}
            disabled={saving}
          >
            Снять с публикации
          </button>
        )}
        <button
          style={{ ...btnBase, background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
          onClick={() => doSave(null)}
          disabled={saving}
        >
          Сохранить черновик
        </button>
        <button
          style={{ ...btnBase, background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
          onClick={() => setShowPreview(true)}
        >
          Предпросмотр
        </button>
        <button
          style={{ ...btnBase, background: 'transparent', color: 'var(--color-text-secondary)' }}
          onClick={() => router.push('/admin/articles')}
        >
          ← Назад
        </button>
      </div>

      {showPreview && (
        <div style={previewOverlayStyle} onClick={() => setShowPreview(false)}>
          <div style={previewCardStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>Предпросмотр</h2>
              <button
                style={{ ...btnBase, padding: '6px 12px', fontSize: '0.8125rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                onClick={() => setShowPreview(false)}
              >
                Закрыть
              </button>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '16px' }}>
              {title || 'Без заголовка'}
            </h1>
            <div
              style={{ lineHeight: 1.8, fontSize: '1rem' }}
              className="tiptap-editor"
              dangerouslySetInnerHTML={{ __html: editorData.html || '<p>Пустая статья</p>' }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
