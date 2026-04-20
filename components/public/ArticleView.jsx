'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { renderContent, renderTipTapContent } from '../../lib/utils/renderContent.jsx'

export default function ArticleView({
  article,
  category,
  nextArticle,
  nextCategory,
}) {
  const router = useRouter()

  const handleArticleClick = (id) => {
    router.push(`/article/${id}`)
  }

  let navHref, navTitle, navIsHome
  if (nextArticle) {
    navHref = `/article/${nextArticle.id}`
    navTitle = nextArticle.title
    navIsHome = false
  } else if (nextCategory) {
    navHref = `/category/${nextCategory.id}`
    navTitle = (
      <>
        Раздел «{nextCategory.name}» <span>{nextCategory.icon}</span>
      </>
    )
    navIsHome = false
  } else {
    navHref = '/'
    navTitle = null
    navIsHome = true
  }

  const wordCount = (article.content || '').trim().split(/\s+/).filter(Boolean).length
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 200))

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

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'first baseline',
          gap: '12px',
          paddingBottom: '0.8em',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <h1
          style={{
            flex: 1,
            fontFamily: 'var(--font-display)',
            fontSize: '1.75rem',
            fontWeight: 700,
            margin: 0,
          }}
        >
          {article.title}
        </h1>
        <span
          style={{
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            whiteSpace: 'nowrap',
          }}
        >
          ~{readingMinutes} мин
        </span>
      </div>

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

      <Link href={navHref} className="article-next-link">
        {navIsHome ? (
          <>
            <span className="article-next-link__arrow">←</span> На главную
          </>
        ) : (
          <>
            Далее: <span className="article-next-link__title">{navTitle}</span>{' '}
            <span className="article-next-link__arrow">→</span>
          </>
        )}
      </Link>
    </div>
  )
}
