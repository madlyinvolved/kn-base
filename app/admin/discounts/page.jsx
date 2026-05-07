'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client.js'

const CATEGORIES = {
  sport: { label: 'Спорт', color: '#0F6E56', bg: '#E1F5EE' },
  english: { label: 'Английский', color: '#534AB7', bg: '#EEEDFE' },
  courses: { label: 'Курсы', color: '#993C1D', bg: '#FAECE7' },
  food: { label: 'Еда', color: '#854F0B', bg: '#FAEEDA' },
  health: { label: 'Здоровье', color: '#2E6FAC', bg: '#E6F1FB' },
  other: { label: 'Другое', color: '#666', bg: '#F1EFE8' },
}

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

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState([])
  const [filter, setFilter] = useState('all')
  const router = useRouter()
  const supabase = createClient()

  async function load() {
    const { data } = await supabase
      .from('discounts')
      .select('*')
      .order('sort_order')
      .order('created_at', { ascending: false })
    setDiscounts(data || [])
  }

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function toggleActive(d) {
    await supabase.from('discounts').update({ is_active: !d.is_active }).eq('id', d.id)
    load()
  }

  async function handleDelete(d) {
    if (!confirm(`Удалить скидку «${d.partner_name}»?`)) return
    await supabase.from('discounts').delete().eq('id', d.id)
    load()
  }

  const filtered = filter === 'all' ? discounts : discounts.filter((d) => d.category === filter)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={titleStyle}>Скидки</h1>
        <button style={primaryBtnStyle} onClick={() => router.push('/admin/discounts/new')}>
          + Добавить скидку
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <button
          style={{ ...btnStyle, ...(filter === 'all' ? { background: 'var(--color-accent)', color: 'white', borderColor: 'var(--color-accent)' } : {}) }}
          onClick={() => setFilter('all')}
        >
          Все
        </button>
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            style={{ ...btnStyle, ...(filter === key ? { background: cat.bg, color: cat.color, borderColor: cat.color } : {}) }}
            onClick={() => setFilter(key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Партнёр</th>
            <th style={thStyle}>Категория</th>
            <th style={thStyle}>Скидка</th>
            <th style={thStyle}>Статус</th>
            <th style={thStyle}>Срок</th>
            <th style={thStyle}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((d) => {
            const cat = CATEGORIES[d.category] || CATEGORIES.other
            return (
              <tr key={d.id}>
                <td style={{ ...tdStyle, fontWeight: 500 }}>{d.partner_name}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '2px 10px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    background: cat.bg,
                    color: cat.color,
                  }}>
                    {cat.label}
                  </span>
                </td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{d.discount_value}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: '2px 10px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    background: d.is_active ? '#dcfce7' : '#fee2e2',
                    color: d.is_active ? '#166534' : '#991b1b',
                  }}>
                    {d.is_active ? 'Активна' : 'Неактивна'}
                  </span>
                </td>
                <td style={{ ...tdStyle, fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                  {d.valid_until ? new Date(d.valid_until).toLocaleDateString('ru-RU') : 'Бессрочно'}
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button style={btnStyle} onClick={() => router.push(`/admin/discounts/${d.id}/edit`)}>
                      Изменить
                    </button>
                    <button style={btnStyle} onClick={() => toggleActive(d)}>
                      {d.is_active ? 'Выкл' : 'Вкл'}
                    </button>
                    <button style={dangerBtnStyle} onClick={() => handleDelete(d)}>
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={6} style={{ ...tdStyle, textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                Нет скидок
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
