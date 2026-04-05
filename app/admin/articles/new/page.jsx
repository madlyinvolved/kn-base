'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/client.js'
import ArticleEditor from '../../../../components/admin/ArticleEditor.jsx'

const titleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: '24px',
}

const fieldStyle = {
  marginBottom: '16px',
}

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

const selectStyle = {
  ...inputStyle,
  fontSize: '0.875rem',
}

const btnBase = {
  padding: '10px 20px',
  fontSize: '0.875rem',
  fontFamily: 'var(--font-body)',
  fontWeight: 600,
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
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

const statusStyle = {
  fontSize: '0.75rem',
  color: 'var(--color-text-secondary)',
  marginLeft: '12px',
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
  const autosaveTimer = useRef(null)
  const lastSaved = useRef('')

  const supabase = createClient()

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => {
      setCategories(data || [])
      if (data?.length && !categoryId) setCategoryId(data[0].id)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const doSave = useCallback(
    async (publish = false) => {
      if (!title.trim() || !categoryId) return

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
        result = await supabase
          .from('articles')
          .insert(payload)
          .select()
          .single()
      }

      setSaving(false)

      if (result.error) {
        setSaveStatus(`Ошибка: ${result.error.message}`)
        return false
      }

      if (!articleId && result.data) {
        setArticleId(result.data.id)
      }

      lastSaved.current = JSON.stringify(payload)
      setSaveStatus(publish ? 'Опубликовано' : 'Черновик сохранён')
      return true
    },
    [title, summary, categoryId, editorData, articleId, supabase],
  )

  // Autosave every 30 seconds
  useEffect(() => {
    autosaveTimer.current = setInterval(() => {
      const current = JSON.stringify({ title, summary, categoryId, text: editorData.text })
      if (current !== lastSaved.current && title.trim() && categoryId) {
        doSave(false)
      }
    }, 30000)

    return () => clearInterval(autosaveTimer.current)
  }, [title, summary, categoryId, editorData, doSave])

  async function handlePublish() {
    const ok = await doSave(true)
    if (ok) {
      router.push('/admin/articles')
    }
  }

  async function handleSaveDraft() {
    await doSave(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ ...titleStyle, marginBottom: 0 }}>Новая статья</h1>
        <span style={statusStyle}>{saveStatus}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '16px', marginBottom: '20px' }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Заголовок</label>
          <input
            style={inputStyle}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название статьи"
            required
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
          placeholder="Для поиска и превью"
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Содержание</label>
        <ArticleEditor content={null} onUpdate={setEditorData} />
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          style={{ ...btnBase, background: 'var(--color-accent)', color: 'white' }}
          onClick={handlePublish}
          disabled={saving || !title.trim()}
        >
          Опубликовать
        </button>
        <button
          style={{ ...btnBase, background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
          onClick={handleSaveDraft}
          disabled={saving || !title.trim()}
        >
          Сохранить черновик
        </button>
        <button
          style={{ ...btnBase, background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
          onClick={() => setShowPreview(true)}
        >
          Предпросмотр
        </button>
      </div>

      {showPreview && (
        <div style={previewOverlayStyle} onClick={() => setShowPreview(false)}>
          <div style={previewCardStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>
                Предпросмотр
              </h2>
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
