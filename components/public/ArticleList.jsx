'use client'

import Link from 'next/link'

const cardStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',
  padding: '16px 20px',
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: '12px',
  textDecoration: 'none',
  color: 'inherit',
  transition: 'all var(--transition-normal)',
  width: '100%',
  opacity: 0,
  animation: 'fadeUp 0.3s ease forwards',
}

export default function ArticleList({ category, articles }) {
  return (
    <div>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          marginBottom: '8px',
        }}
      >
        {category.icon} {category.name}
      </h1>
      <p
        style={{
          color: 'var(--color-text-secondary)',
          marginBottom: '24px',
        }}
      >
        {category.desc}
      </p>
      <div style={{ display: 'grid', gap: '12px' }}>
        {articles.map((article, index) => (
          <Link
            key={article.id}
            href={`/article/${article.id}`}
            style={{
              ...cardStyle,
              animationDelay: `${index * 60}ms`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
              e.currentTarget.style.borderColor = category.color
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.borderColor = 'var(--color-border)'
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: category.color,
                minWidth: '28px',
              }}
            >
              {index + 1}
            </span>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text)' }}>
                {article.title}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                {article.summary}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
