import { useState, useCallback } from 'react'
import Layout from './components/Layout.jsx'
import Breadcrumb from './components/Breadcrumb.jsx'
import CategoryGrid from './components/CategoryGrid.jsx'
import SearchBar from './components/SearchBar.jsx'
import SearchResults from './components/SearchResults.jsx'
import ArticleList from './components/ArticleList.jsx'
import ArticleView from './components/ArticleView.jsx'
import ChatWidget from './components/ChatWidget/ChatWidget.jsx'
import {
  CATEGORIES,
  ARTICLES,
  getCategoryById,
  getArticleById,
  getArticlesByCategory,
} from './data/knowledge-base.js'
import { useSearch } from './hooks/useSearch.js'

function App() {
  const [view, setView] = useState('home')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const searchResults = useSearch(searchQuery, ARTICLES)

  const goHome = useCallback(() => {
    setView('home')
    setSelectedCategory(null)
    setSelectedArticle(null)
    setSearchQuery('')
    window.scrollTo(0, 0)
  }, [])

  const goToCategory = useCallback((categoryId) => {
    setView('category')
    setSelectedCategory(categoryId)
    setSelectedArticle(null)
    setSearchQuery('')
    window.scrollTo(0, 0)
  }, [])

  const goToArticle = useCallback((articleId) => {
    const article = getArticleById(articleId)
    if (article) {
      setView('article')
      setSelectedArticle(articleId)
      setSelectedCategory(article.category)
      setSearchQuery('')
      window.scrollTo(0, 0)
    }
  }, [])

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
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          {searchQuery.trim() ? (
            <SearchResults
              results={searchResults}
              query={searchQuery}
              onArticleClick={goToArticle}
            />
          ) : (
            <CategoryGrid categories={CATEGORIES} onSelect={goToCategory} />
          )}
        </div>
      )}

      {view === 'category' &&
        selectedCategory &&
        (() => {
          const cat = getCategoryById(selectedCategory)
          const articles = getArticlesByCategory(selectedCategory)
          if (!cat) return null
          return <ArticleList category={cat} articles={articles} onArticleClick={goToArticle} />
        })()}

      {view === 'article' &&
        selectedArticle &&
        (() => {
          const article = getArticleById(selectedArticle)
          if (!article) return null
          return <ArticleView article={article} onArticleClick={goToArticle} />
        })()}

      <ChatWidget />
    </Layout>
  )
}

export default App
