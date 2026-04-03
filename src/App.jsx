import { useState, useCallback } from 'react'

function App() {
  const [view, setView] = useState('home')
  const [, setSelectedCategory] = useState(null)
  const [, setSelectedArticle] = useState(null)

  const goHome = useCallback(() => {
    setView('home')
    setSelectedCategory(null)
    setSelectedArticle(null)
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <span className="logo" onClick={goHome} role="button" tabIndex={0}>
            AdCorp Knowledge Base
          </span>
          {view !== 'home' && (
            <button className="back-button" onClick={goHome}>
              Главная
            </button>
          )}
        </div>
      </header>

      <main className="main-content">
        {view === 'home' && (
          <div className="hero">
            <h1>База знаний AdCorp</h1>
            <p>Всё, что нужно знать о работе в компании — в одном месте</p>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>AdCorp Knowledge Base &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
