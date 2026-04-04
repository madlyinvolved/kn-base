import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ArticleView from '../../components/ArticleView.jsx'
import { getArticleById } from '../../data/knowledge-base.js'

describe('ArticleView', () => {
  it('renders article title', () => {
    const article = getArticleById(1)
    render(<ArticleView article={article} onArticleClick={vi.fn()} />)
    expect(screen.getByText('Добро пожаловать!')).toBeInTheDocument()
  })

  it('shows category badge', () => {
    const article = getArticleById(1)
    render(<ArticleView article={article} onArticleClick={vi.fn()} />)
    expect(screen.getByText(/Новому сотруднику/)).toBeInTheDocument()
  })

  it('shows "More in this section" for categories with multiple articles', () => {
    const article = getArticleById(6) // work category, 6 articles
    render(<ArticleView article={article} onArticleClick={vi.fn()} />)
    expect(screen.getByText('Ещё в этом разделе')).toBeInTheDocument()
  })

  it('does not show "More in this section" for single-article category', () => {
    const article = getArticleById(14) // feedback category, 1 article
    render(<ArticleView article={article} onArticleClick={vi.fn()} />)
    expect(screen.queryByText('Ещё в этом разделе')).not.toBeInTheDocument()
  })

  it('renders article content', () => {
    const article = getArticleById(1)
    render(<ArticleView article={article} onArticleClick={vi.fn()} />)
    expect(screen.getByText(/Добро пожаловать в AdCorp/)).toBeInTheDocument()
  })
})
