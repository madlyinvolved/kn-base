'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../../lib/supabase/client.js'

const titleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: '24px',
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  background: 'var(--color-surface)',
  borderRadius: '12px',
  overflow: 'hidden',
  border: '1px solid var(--color-border)',
}

const thStyle = {
  textAlign: 'left',
  padding: '12px 16px',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--color-text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  borderBottom: '1px solid var(--color-border)',
  background: 'var(--color-bg)',
}

const tdStyle = {
  padding: '12px 16px',
  fontSize: '0.875rem',
  borderBottom: '1px solid var(--color-border-light)',
}

const btnStyle = {
  padding: '6px 12px',
  fontSize: '0.8125rem',
  fontFamily: 'var(--font-body)',
  border: '1px solid var(--color-border)',
  borderRadius: '6px',
  cursor: 'pointer',
  background: 'var(--color-surface)',
  color: 'var(--color-text)',
  transition: 'all var(--transition-fast)',
}

const primaryBtnStyle = {
  ...btnStyle,
  background: 'var(--color-accent)',
  color: 'white',
  border: '1px solid var(--color-accent)',
}

const dangerBtnStyle = {
  ...btnStyle,
  color: '#dc2626',
  borderColor: '#fecaca',
}

const formOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 200,
}

const formCardStyle = {
  background: 'var(--color-surface)',
  borderRadius: '16px',
  padding: '32px',
  width: '100%',
  maxWidth: '480px',
  boxShadow: 'var(--shadow-lg)',
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  fontSize: '0.875rem',
  fontFamily: 'var(--font-body)',
  border: '1px solid var(--color-border)',
  borderRadius: '8px',
  outline: 'none',
  boxSizing: 'border-box',
  marginTop: '4px',
}

const labelStyle = {
  display: 'block',
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: 'var(--color-text)',
  marginBottom: '12px',
}

const EMPTY_FORM = { id: '', name: '', description: '', icon: '📄', color: '#666666' }

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [articleCounts, setArticleCounts] = useState({})
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState(null)

  const supabase = createClient()

  async function loadCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order')
    setCategories(data || [])

    // Count articles per category
    const { data: articles } = await supabase
      .from('articles')
      .select('category_id')
    const counts = {}
    ;(articles || []).forEach((a) => {
      counts[a.category_id] = (counts[a.category_id] || 0) + 1
    })
    setArticleCounts(counts)
  }

  useEffect(() => {
    loadCategories()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function openCreate() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setError(null)
    setShowForm(true)
  }

  function openEdit(cat) {
    setForm({
      id: cat.id,
      name: cat.name,
      description: cat.description || '',
      icon: cat.icon,
      color: cat.color,
    })
    setEditingId(cat.id)
    setError(null)
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!form.name.trim()) {
      setError('Название обязательно')
      return
    }

    if (editingId) {
      const { error: updateError } = await supabase
        .from('categories')
        .update({
          name: form.name.trim(),
          description: form.description.trim() || null,
          icon: form.icon,
          color: form.color,
        })
        .eq('id', editingId)

      if (updateError) {
        setError(updateError.message)
        return
      }
    } else {
      const slug = form.id.trim() || form.name.trim().toLowerCase().replace(/\s+/g, '-')
      const { error: insertError } = await supabase.from('categories').insert({
        id: slug,
        name: form.name.trim(),
        description: form.description.trim() || null,
        icon: form.icon,
        color: form.color,
        sort_order: categories.length,
      })

      if (insertError) {
        setError(insertError.message)
        return
      }
    }

    setShowForm(false)
    loadCategories()
  }

  async function handleDelete(cat) {
    const count = articleCounts[cat.id] || 0
    if (count > 0) {
      alert(`Нельзя удалить категорию «${cat.name}» — в ней ${count} статей.`)
      return
    }

    if (!confirm(`Удалить категорию «${cat.name}»?`)) return

    await supabase.from('categories').delete().eq('id', cat.id)
    loadCategories()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={titleStyle}>Категории</h1>
        <button style={primaryBtnStyle} onClick={openCreate}>
          + Добавить
        </button>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Иконка</th>
            <th style={thStyle}>Название</th>
            <th style={thStyle}>Slug</th>
            <th style={thStyle}>Статей</th>
            <th style={thStyle}>Цвет</th>
            <th style={thStyle}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td style={tdStyle}>{cat.icon}</td>
              <td style={{ ...tdStyle, fontWeight: 500 }}>{cat.name}</td>
              <td style={{ ...tdStyle, color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}>
                {cat.id}
              </td>
              <td style={tdStyle}>{articleCounts[cat.id] || 0}</td>
              <td style={tdStyle}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    background: cat.color,
                  }}
                />
              </td>
              <td style={tdStyle}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={btnStyle} onClick={() => openEdit(cat)}>
                    Изменить
                  </button>
                  <button style={dangerBtnStyle} onClick={() => handleDelete(cat)}>
                    Удалить
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div style={formOverlayStyle} onClick={() => setShowForm(false)}>
          <div style={formCardStyle} onClick={(e) => e.stopPropagation()}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                marginBottom: '20px',
              }}
            >
              {editingId ? 'Редактировать категорию' : 'Новая категория'}
            </h2>

            <form onSubmit={handleSubmit}>
              <label style={labelStyle}>
                Название
                <input
                  style={inputStyle}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </label>

              {!editingId && (
                <label style={labelStyle}>
                  Slug (ID)
                  <input
                    style={inputStyle}
                    value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    placeholder="auto-generated from name"
                  />
                </label>
              )}

              <label style={labelStyle}>
                Описание
                <input
                  style={inputStyle}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </label>

              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={labelStyle}>
                  Иконка (emoji)
                  <input
                    style={{ ...inputStyle, width: '80px' }}
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  />
                </label>

                <label style={labelStyle}>
                  Цвет
                  <input
                    type="color"
                    style={{ ...inputStyle, width: '60px', padding: '4px', height: '40px' }}
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                  />
                </label>
              </div>

              {error && (
                <div
                  style={{
                    padding: '8px 12px',
                    fontSize: '0.8125rem',
                    color: '#dc2626',
                    background: '#fef2f2',
                    borderRadius: '6px',
                    marginBottom: '12px',
                  }}
                >
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" style={btnStyle} onClick={() => setShowForm(false)}>
                  Отмена
                </button>
                <button type="submit" style={primaryBtnStyle}>
                  {editingId ? 'Сохранить' : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
