import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CategoryGrid from '../../components/CategoryGrid.jsx'
import { CATEGORIES } from '../../data/knowledge-base.js'

describe('CategoryGrid', () => {
  it('renders all 5 categories', () => {
    render(<CategoryGrid categories={CATEGORIES} onSelect={vi.fn()} />)
    CATEGORIES.forEach((cat) => {
      expect(screen.getByText(cat.name)).toBeInTheDocument()
    })
  })

  it('shows description for each category', () => {
    render(<CategoryGrid categories={CATEGORIES} onSelect={vi.fn()} />)
    CATEGORIES.forEach((cat) => {
      expect(screen.getByText(cat.desc, { exact: false })).toBeInTheDocument()
    })
  })

  it('shows article count badge', () => {
    render(<CategoryGrid categories={CATEGORIES} onSelect={vi.fn()} />)
    expect(screen.getByText('6 статей')).toBeInTheDocument()
    expect(screen.getByText('1 статья')).toBeInTheDocument()
  })

  it('calls onSelect with category id on click', () => {
    const onSelect = vi.fn()
    render(<CategoryGrid categories={CATEGORIES} onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Организация работы'))
    expect(onSelect).toHaveBeenCalledWith('work')
  })
})
