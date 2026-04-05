'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client.js'

const titleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '2rem',
  fontWeight: 700,
}

const filtersStyle = {
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  flexWrap: 'wrap',
  marginBottom: '20px',
}

const selectStyle = {
  padding: '8px 12px',
  fontSize: '0.875rem',
  fontFamily: 'var(--font-body)',
  border: '1px solid var(--color-border)',
  borderRadius: '8px',
  background: 'var(--color-surface)',
  color: 'var(--color-text)',
  outline: 'none',
}

const searchInputStyle = {
  padding: '8px 14px',
  fontSize: '0.875rem',
  fontFamily: 'var(--font-body)',
  border: '1px solid var(--color-border)',
  borderRadius: '8px',
  outline: 'none',
  minWidth: '200px',
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
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
}

const primaryBtnStyle = {
  ...btnStyle,
  background: 'var(--color-accent)',
  color: 'white',
  border: '1px solid var(--color-accent)',
}

const badgePublished = {
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: 600,
  background: '#dcfce7',
  color: '#15803d',
}

const badgeDraft = {
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: 600,
  background: '#fef3c7',
  color: '#92400e',
}

export default function ArticlesListPage() {
  const router = useRouter()
  const [articles, setArticles] = useState([])
  const [categories, setCategories] = useState([])
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [search, setSearch] = useState('')

  const supabase = createClient()

  async function loadData() {
    const { data: cats } = await supabase.from('categories').select('*').order('sort_order')
    setCategories(cats || [])

    let query = supabase
      .from('articles')
      .select('*')
      .order('updated_at', { ascending: false })

    if (filterCategory) query = query.eq('category_id', filterCategory)
    if (filterStatus === 'published') query = query.eq('is_published', true)
    if (filterStatus === 'draft') query = query.eq('is_published', false)

    const { data: arts } = await query
    setArticles(arts || [])
  }

  useEffect(() => {
    loadData()
  }, [filterCategory, filterStatus]) // eslint-disable-line react-hooks/exhaustive-deps

  const catMap = {}
  categories.forEach((c) => { catMap[c.id] = c })

  const filtered = search
    ? articles.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()))
    : articles

  async function handleTogglePublish(article) {
    await supabase
      .from('articles')
      .update({ is_published: !article.is_published })
      .eq('id', article.id)
    loadData()
  }

  async function handleDelete(article) {
    if (!confirm(`Удалить статью «${article.title}»?`)) return
    await supabase.from('articles').delete().eq('id', article.id)
    loadData()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={titleStyle}>Статьи</h1>
        <Link href="/admin/articles/new" style={primaryBtnStyle}>
          + Новая статья
        </Link>
      </div>

      <div style={filtersStyle}>
        <select style={selectStyle} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">Все категории</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>

        <select style={selectStyle} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">Все статусы</option>
          <option value="published">Опубликовано</option>
          <option value="draft">Черновик</option>
        </select>

        <input
          style={searchInputStyle}
          placeholder="Поиск по заголовку..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Заголовок</th>
            <th style={thStyle}>Категория</th>
            <th style={thStyle}>Статус</th>
            <th style={thStyle}>Обновлено</th>
            <th style={thStyle}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((article) => {
            const cat = catMap[article.category_id]
            return (
              <tr key={article.id}>
                <td style={{ ...tdStyle, fontWeight: 500 }}>{article.title}</td>
                <td style={tdStyle}>
                  {cat ? (
                    <span style={{ color: cat.color }}>
                      {cat.icon} {cat.name}
                    </span>
                  ) : (
                    article.category_id
                  )}
                </td>
                <td style={tdStyle}>
                  <span style={article.is_published ? badgePublished : badgeDraft}>
                    {article.is_published ? 'Опубликовано' : 'Черновик'}
                  </span>
                </td>
                <td style={{ ...tdStyle, fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                  {new Date(article.updated_at).toLocaleDateString('ru-RU')}
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      style={btnStyle}
                      onClick={() => router.push(`/admin/articles/${article.id}/edit`)}
                    >
                      Изменить
                    </button>
                    <button style={btnStyle} onClick={() => handleTogglePublish(article)}>
                      {article.is_published ? 'Снять' : 'Опубл.'}
                    </button>
                    <button
                      style={{ ...btnStyle, color: '#dc2626', borderColor: '#fecaca' }}
                      onClick={() => handleDelete(article)}
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={5} style={{ ...tdStyle, textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                Статей не найдено
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
