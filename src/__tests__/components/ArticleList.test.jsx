import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ArticleList from '../../components/ArticleList.jsx'
import { getCategoryById, getArticlesByCategory } from '../../data/knowledge-base.js'

describe('ArticleList', () => {
  const category = getCategoryById('work')
  const articles = getArticlesByCategory('work')

  it('renders category title', () => {
    render(<ArticleList category={category} articles={articles} onArticleClick={vi.fn()} />)
    expect(screen.getByText(/Организация работы/)).toBeInTheDocument()
  })

  it('renders all articles in the category', () => {
    render(<ArticleList category={category} articles={articles} onArticleClick={vi.fn()} />)
    articles.forEach((a) => {
      expect(screen.getByText(a.title)).toBeInTheDocument()
    })
  })

  it('shows numbering', () => {
    render(<ArticleList category={category} articles={articles} onArticleClick={vi.fn()} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
  })

  it('calls onArticleClick with article id', () => {
    const onClick = vi.fn()
    render(<ArticleList category={category} articles={articles} onArticleClick={onClick} />)
    fireEvent.click(screen.getByText('Зарплата и выплаты'))
    expect(onClick).toHaveBeenCalledWith(7)
  })
})
