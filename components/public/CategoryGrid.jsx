'use client'

import Link from 'next/link'

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '16px',
  marginTop: '40px',
}

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '24px',
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: '16px',
  textAlign: 'left',
  textDecoration: 'none',
  color: 'inherit',
  transition: 'all var(--transition-normal)',
  opacity: 0,
  animation: 'fadeUp 0.4s ease forwards',
}

function pluralArticles(count) {
  if (count === 1) return 'статья'
  if (count >= 2 && count <= 4) return 'статьи'
  return 'статей'
}

export default function CategoryGrid({ categories, articleCounts }) {
  return (
    <div style={gridStyle} className="category-grid">
      {categories.map((cat, index) => {
        const count = articleCounts?.[cat.id] ?? 0
        return (
          <Link
            key={cat.id}
            href={`/category/${cat.id}`}
            style={{
              ...cardStyle,
              animationDelay: `${index * 80}ms`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = 'var(--shadow-md)'
              e.currentTarget.style.borderColor = cat.color
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.borderColor = 'var(--color-border)'
            }}
          >
            <span style={{ fontSize: '2rem', marginBottom: '12px' }}>{cat.icon}</span>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '1.125rem',
                marginBottom: '6px',
                color: 'var(--color-text)',
              }}
            >
              {cat.name}
            </div>
            <div
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.4,
                marginBottom: '12px',
              }}
            >
              {cat.desc}
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: cat.color,
                background: `${cat.color}14`,
                padding: '4px 10px',
                borderRadius: '20px',
                marginTop: 'auto',
              }}
            >
              {count} {pluralArticles(count)}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
