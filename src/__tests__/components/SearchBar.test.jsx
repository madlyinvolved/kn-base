import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SearchBar from '../../components/SearchBar.jsx'
import SearchResults from '../../components/SearchResults.jsx'
import { ARTICLES } from '../../data/knowledge-base.js'

describe('SearchBar', () => {
  it('renders input with placeholder', () => {
    render(<SearchBar value="" onChange={vi.fn()} />)
    expect(screen.getByPlaceholderText('Поиск по базе знаний...')).toBeInTheDocument()
  })

  it('calls onChange when typing', () => {
    const onChange = vi.fn()
    render(<SearchBar value="" onChange={onChange} />)
    fireEvent.change(screen.getByPlaceholderText('Поиск по базе знаний...'), {
      target: { value: 'отпуск' },
    })
    expect(onChange).toHaveBeenCalledWith('отпуск')
  })
})

describe('SearchResults', () => {
  it('renders nothing when query is empty', () => {
    const { container } = render(<SearchResults results={[]} query="" onArticleClick={vi.fn()} />)
    expect(container.innerHTML).toBe('')
  })

  it('shows "nothing found" message', () => {
    render(<SearchResults results={[]} query="xyznonexistent" onArticleClick={vi.fn()} />)
    expect(screen.getByText(/Ничего не найдено/)).toBeInTheDocument()
  })

  it('renders results with category badges', () => {
    const results = ARTICLES.filter((a) => a.title.includes('Зарплата'))
    render(<SearchResults results={results} query="зарплата" onArticleClick={vi.fn()} />)
    expect(screen.getByText('Зарплата и выплаты')).toBeInTheDocument()
    expect(screen.getByText(/Организация работы/)).toBeInTheDocument()
  })

  it('calls onArticleClick on result click', () => {
    const onClick = vi.fn()
    const results = [ARTICLES[0]]
    render(<SearchResults results={results} query="добро" onArticleClick={onClick} />)
    fireEvent.click(screen.getByText('Добро пожаловать!'))
    expect(onClick).toHaveBeenCalledWith(1)
  })
})
