import { getCategoryById } from '../data/knowledge-base.js'

const containerStyle = {
  marginTop: '24px',
  display: 'grid',
  gap: '12px',
  textAlign: 'left',
}

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  padding: '16px 20px',
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: '12px',
  cursor: 'pointer',
  fontFamily: 'var(--font-body)',
  textAlign: 'left',
  transition: 'all var(--transition-normal)',
  animation: 'fadeUp 0.3s ease forwards',
  width: '100%',
}

const badgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '3px 10px',
  borderRadius: '20px',
  fontSize: '0.6875rem',
  fontWeight: 600,
  color: 'white',
  width: 'fit-content',
}

const emptyStyle = {
  textAlign: 'center',
  padding: '40px 20px',
  color: 'var(--color-text-secondary)',
}

export default function SearchResults({ results, query, onArticleClick }) {
  if (!query || !query.trim()) return null

  if (results.length === 0) {
    return (
      <div style={emptyStyle}>
        <p style={{ fontSize: '1.125rem', marginBottom: '8px' }}>
          Ничего не найдено по запросу «{query}»
        </p>
        <p style={{ fontSize: '0.875rem' }}>
          Попробуйте другой запрос или задайте вопрос AI-ассистенту
        </p>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary)',
          marginBottom: '4px',
        }}
      >
        Найдено: {results.length}
      </p>
      {results.map((article, index) => {
        const cat = getCategoryById(article.category)
        return (
          <button
            key={article.id}
            onClick={() => onArticleClick(article.id)}
            style={{
              ...cardStyle,
              animationDelay: `${index * 50}ms`,
              opacity: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {cat && (
              <span style={{ ...badgeStyle, background: cat.color }}>
                {cat.icon} {cat.name}
              </span>
            )}
            <div style={{ fontWeight: 600, fontSize: '1rem' }}>{article.title}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              {article.summary}
            </div>
          </button>
        )
      })}
    </div>
  )
}
