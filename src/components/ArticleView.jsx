import { ARTICLES, getCategoryById } from '../data/knowledge-base.js'
import { renderContent } from '../utils/renderContent.jsx'

const relatedSectionStyle = {
  marginTop: '48px',
  padding: '24px',
  background: 'var(--color-surface)',
  borderRadius: '12px',
  border: '1px solid var(--color-border)',
}

const relatedLinkStyle = {
  background: 'none',
  border: 'none',
  padding: '8px 0',
  color: 'var(--color-accent)',
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: 'var(--font-body)',
  fontSize: '0.9375rem',
  transition: 'opacity var(--transition-fast)',
  width: '100%',
}

export default function ArticleView({ article, onArticleClick }) {
  const cat = getCategoryById(article.category)
  if (!cat) return null

  const relatedArticles = ARTICLES.filter(
    (a) => a.category === article.category && a.id !== article.id,
  )

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <span
        style={{
          display: 'inline-block',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'white',
          background: cat.color,
          marginBottom: '12px',
        }}
      >
        {cat.icon} {cat.name}
      </span>

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          marginBottom: '20px',
        }}
      >
        {article.title}
      </h1>

      <div
        style={{
          whiteSpace: 'pre-wrap',
          lineHeight: 1.8,
          fontSize: '1rem',
          color: article.content ? 'var(--color-text)' : 'var(--color-text-secondary)',
        }}
      >
        {article.content
          ? renderContent(article.content, onArticleClick)
          : 'Контент будет добавлен в Milestone 5 (T-016).'}
      </div>

      {relatedArticles.length > 0 && (
        <div style={relatedSectionStyle}>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.125rem',
              marginBottom: '12px',
            }}
          >
            Ещё в этом разделе
          </h3>
          <div style={{ display: 'grid', gap: '4px' }}>
            {relatedArticles.map((a) => (
              <button
                key={a.id}
                onClick={() => onArticleClick(a.id)}
                style={relatedLinkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                → {a.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
