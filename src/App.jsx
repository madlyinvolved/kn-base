import { useState, useCallback } from 'react'
import Layout from './components/Layout.jsx'
import Breadcrumb from './components/Breadcrumb.jsx'
import { CATEGORIES, ARTICLES, getCategoryById, getArticleById } from './data/knowledge-base.js'

function App() {
  const [view, setView] = useState('home')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedArticle, setSelectedArticle] = useState(null)

  const goHome = useCallback(() => {
    setView('home')
    setSelectedCategory(null)
    setSelectedArticle(null)
    window.scrollTo(0, 0)
  }, [])

  const goToCategory = useCallback((categoryId) => {
    setView('category')
    setSelectedCategory(categoryId)
    setSelectedArticle(null)
    window.scrollTo(0, 0)
  }, [])

  const goToArticle = useCallback((articleId) => {
    const article = getArticleById(articleId)
    if (article) {
      setView('article')
      setSelectedArticle(articleId)
      setSelectedCategory(article.category)
      window.scrollTo(0, 0)
    }
  }, [])

  // Build breadcrumb items based on current view
  const breadcrumbItems = (() => {
    if (view === 'home') return []

    const items = [{ label: 'Главная', onClick: goHome }]

    if (view === 'category' && selectedCategory) {
      const cat = getCategoryById(selectedCategory)
      if (cat) items.push({ label: cat.name })
    }

    if (view === 'article' && selectedArticle) {
      const cat = getCategoryById(selectedCategory)
      const art = getArticleById(selectedArticle)
      if (cat) items.push({ label: cat.name, onClick: () => goToCategory(cat.id) })
      if (art) items.push({ label: art.title })
    }

    return items
  })()

  return (
    <Layout showBack={view !== 'home'} onGoHome={goHome}>
      {view !== 'home' && <Breadcrumb items={breadcrumbItems} />}

      {view === 'home' && (
        <div className="hero">
          <h1>База знаний AdCorp</h1>
          <p>Всё, что нужно знать о работе в компании — в одном месте</p>
          {/* SearchBar will go here (T-009) */}
          {/* CategoryGrid will go here (T-008) */}
          <div style={{ marginTop: '40px', display: 'grid', gap: '16px' }}>
            {CATEGORIES.map((cat) => {
              const count = ARTICLES.filter((a) => a.category === cat.id).length
              return (
                <button
                  key={cat.id}
                  onClick={() => goToCategory(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 20px',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'var(--font-body)',
                    transition: 'all var(--transition-normal)',
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1rem' }}>{cat.name}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      {cat.desc} · {count} {count === 1 ? 'статья' : 'статей'}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {view === 'category' &&
        selectedCategory &&
        (() => {
          const cat = getCategoryById(selectedCategory)
          const articles = ARTICLES.filter((a) => a.category === selectedCategory)
          if (!cat) return null
          return (
            <div>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  marginBottom: '8px',
                }}
              >
                {cat.icon} {cat.name}
              </h1>
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  marginBottom: '24px',
                }}
              >
                {cat.desc}
              </p>
              <div style={{ display: 'grid', gap: '12px' }}>
                {articles.map((article, index) => (
                  <button
                    key={article.id}
                    onClick={() => goToArticle(article.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      padding: '16px 20px',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'var(--font-body)',
                      transition: 'all var(--transition-normal)',
                      width: '100%',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: cat.color,
                        minWidth: '28px',
                      }}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1rem' }}>{article.title}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                        {article.summary}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        })()}

      {view === 'article' &&
        selectedArticle &&
        (() => {
          const article = getArticleById(selectedArticle)
          const cat = getCategoryById(selectedCategory)
          if (!article || !cat) return null
          const relatedArticles = ARTICLES.filter(
            (a) => a.category === article.category && a.id !== article.id,
          )
          return (
            <div>
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
                {article.content || 'Контент будет добавлен в Milestone 5 (T-016).'}
              </div>

              {relatedArticles.length > 0 && (
                <div
                  style={{
                    marginTop: '48px',
                    padding: '24px',
                    background: 'var(--color-surface)',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.125rem',
                      marginBottom: '12px',
                    }}
                  >
                    Ещё в этом разделе
                  </h3>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {relatedArticles.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => goToArticle(a.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '8px 0',
                          color: 'var(--color-accent)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.9375rem',
                          transition: 'opacity var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                      >
                        {a.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })()}
    </Layout>
  )
}

export default App
