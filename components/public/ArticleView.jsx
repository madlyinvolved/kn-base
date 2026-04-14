'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { renderContent, renderTipTapContent } from '../../lib/utils/renderContent.jsx'

export default function ArticleView({
  article,
  category,
  nextArticle,
  nextCategory,
  isLastInCategory,
  categoryArticleCount,
}) {
  const router = useRouter()

  const handleArticleClick = (id) => {
    router.push(`/article/${id}`)
  }

  const navHref = nextArticle
    ? `/article/${nextArticle.id}`
    : `/category/${category.id}`
  const navLeftLabel = nextArticle ? 'Следующая статья →' : '← Вернуться к разделу'
  const navRightLabel = nextArticle ? nextArticle.title : category.name
  const showAllLink = categoryArticleCount > 2
  const showSectionNav = isLastInCategory

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <span
        style={{
          display: 'inline-block',
          padding: '3px 10px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'white',
          background: category.color,
          marginBottom: '8px',
        }}
      >
        {category.icon} {category.name}
      </span>

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.75rem',
          fontWeight: 700,
          marginBottom: '0',
          paddingBottom: '0.8em',
          borderBottom: '1px solid var(--color-border)',
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
            marginTop: '1.2em',
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
            marginTop: '1.2em',
          }}
        >
          {renderContent(article.content, handleArticleClick)}
        </div>
      )}

      <div style={{ marginTop: '48px' }}>
        <Link href={navHref} className="article-nav-card">
          <span className="article-nav-card__label">{navLeftLabel}</span>
          <span className="article-nav-card__title">{navRightLabel}</span>
        </Link>

        {showSectionNav && (
          <Link
            href={nextCategory ? `/category/${nextCategory.id}` : '/'}
            className="article-section-nav"
            style={{ marginTop: '12px' }}
          >
            {nextCategory ? (
              <>
                <span>Перейти к разделу «{nextCategory.name}»</span>
                <span className="article-section-nav__icon">{nextCategory.icon}</span>
              </>
            ) : (
              <span>← На главную</span>
            )}
          </Link>
        )}

        {showAllLink && (
          <Link
            href={`/category/${category.id}`}
            style={{
              display: 'inline-block',
              marginTop: '12px',
              fontSize: '0.8125rem',
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              borderBottom: '1px dotted var(--color-text-secondary)',
            }}
          >
            Все статьи раздела «{category.name}»
          </Link>
        )}
      </div>
    </div>
  )
}
