'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '../../lib/supabase/client.js'

const titleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: '32px',
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '16px',
  marginBottom: '32px',
}

const cardStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: '12px',
  padding: '20px',
}

const statNumberStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '2rem',
  fontWeight: 700,
  color: 'var(--color-accent)',
}

const statLabelStyle = {
  fontSize: '0.875rem',
  color: 'var(--color-text-secondary)',
  marginTop: '4px',
}

const quickLinksStyle = {
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap',
}

const quickLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 20px',
  fontSize: '0.875rem',
  fontFamily: 'var(--font-body)',
  fontWeight: 600,
  background: 'var(--color-accent)',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  textDecoration: 'none',
  transition: 'opacity var(--transition-fast)',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    async function loadStats() {
      const supabase = createClient()

      const [categoriesRes, totalRes, publishedRes, draftsRes] = await Promise.all([
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('articles').select('*', { count: 'exact', head: true }),
        supabase.from('articles').select('*', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('articles').select('*', { count: 'exact', head: true }).eq('is_published', false),
      ])

      setStats({
        categories: categoriesRes.count ?? 0,
        total: totalRes.count ?? 0,
        published: publishedRes.count ?? 0,
        drafts: draftsRes.count ?? 0,
      })
    }

    loadStats()
  }, [])

  return (
    <div>
      <h1 style={titleStyle}>Дашборд</h1>

      <div style={gridStyle}>
        <div style={cardStyle}>
          <div style={statNumberStyle}>{stats?.categories ?? '—'}</div>
          <div style={statLabelStyle}>Категорий</div>
        </div>
        <div style={cardStyle}>
          <div style={statNumberStyle}>{stats?.total ?? '—'}</div>
          <div style={statLabelStyle}>Всего статей</div>
        </div>
        <div style={cardStyle}>
          <div style={{ ...statNumberStyle, color: '#059669' }}>{stats?.published ?? '—'}</div>
          <div style={statLabelStyle}>Опубликовано</div>
        </div>
        <div style={cardStyle}>
          <div style={{ ...statNumberStyle, color: '#d97706' }}>{stats?.drafts ?? '—'}</div>
          <div style={statLabelStyle}>Черновиков</div>
        </div>
      </div>

      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.25rem',
          marginBottom: '16px',
        }}
      >
        Быстрые действия
      </h2>
      <div style={quickLinksStyle}>
        <Link href="/admin/articles/new" style={quickLinkStyle}>
          + Новая статья
        </Link>
        <Link href="/admin/categories" style={{ ...quickLinkStyle, background: '#7c3aed' }}>
          📁 Категории
        </Link>
        <Link href="/admin/articles" style={{ ...quickLinkStyle, background: '#2a7de8' }}>
          📝 Все статьи
        </Link>
      </div>
    </div>
  )
}
