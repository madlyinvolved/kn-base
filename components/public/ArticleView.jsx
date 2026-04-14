'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { renderContent, renderTipTapContent } from '../../lib/utils/renderContent.jsx'

const relatedSectionStyle = {
  marginTop: '48px',
  padding: '24px',
  background: 'var(--color-surface)',
  borderRadius: '12px',
  border: '1px solid var(--color-border)',
}

const relatedLinkStyle = {
  display: 'block',
  padding: '8px 0',
  color: 'var(--color-accent)',
  textDecoration: 'none',
  fontSize: '0.9375rem',
  transition: 'opacity var(--transition-fast)',
}

export default function ArticleView({ article, category, relatedArticles }) {
  const router = useRouter()

  const handleArticleClick = (id) => {
    router.push(`/article/${id}`)
  }

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
          background: category.color,
          marginBottom: '12px',
        }}
      >
        {category.icon} {category.name}
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

      {article.contentJson ? (
        <div
          className="tiptap-editor"
          style={{
            lineHeight: 1.35,
            fontSize: '1rem',
            color: 'var(--color-text)',
          }}
        >
          <div className="tiptap">{renderTipTapContent(article.contentJson)}</div>
        </div>
      ) : (
        <div
          style={{
            whiteSpace: 'pre-wrap',
            lineHeight: 1.35,
            fontSize: '1rem',
            color: 'var(--color-text)',
          }}
        >
          {renderContent(article.content, handleArticleClick)}
        </div>
      )}

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
              <Link key={a.id} href={`/article/${a.id}`} style={relatedLinkStyle}>
                → {a.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
