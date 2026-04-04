import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Breadcrumb from '../../components/Breadcrumb.jsx'

describe('Breadcrumb', () => {
  it('renders nothing for empty items', () => {
    const { container } = render(<Breadcrumb items={[]} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders nothing for null items', () => {
    const { container } = render(<Breadcrumb items={null} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders single item as current page', () => {
    render(<Breadcrumb items={[{ label: 'Главная' }]} />)
    expect(screen.getByText('Главная')).toBeInTheDocument()
    expect(screen.getByText('Главная')).toHaveAttribute('aria-current', 'page')
  })

  it('renders category breadcrumb: Главная → Категория', () => {
    const goHome = vi.fn()
    render(<Breadcrumb items={[{ label: 'Главная', onClick: goHome }, { label: 'О компании' }]} />)
    expect(screen.getByText('Главная')).toBeInTheDocument()
    expect(screen.getByText('О компании')).toBeInTheDocument()
    expect(screen.getByText('О компании')).toHaveAttribute('aria-current', 'page')
  })

  it('renders article breadcrumb: Главная → Категория → Статья', () => {
    const goHome = vi.fn()
    const goCategory = vi.fn()
    render(
      <Breadcrumb
        items={[
          { label: 'Главная', onClick: goHome },
          { label: 'О компании', onClick: goCategory },
          { label: 'Структура компании' },
        ]}
      />,
    )
    expect(screen.getByText('Главная')).toBeInTheDocument()
    expect(screen.getByText('О компании')).toBeInTheDocument()
    expect(screen.getByText('Структура компании')).toHaveAttribute('aria-current', 'page')
  })

  it('clicking Главная calls goHome', () => {
    const goHome = vi.fn()
    render(<Breadcrumb items={[{ label: 'Главная', onClick: goHome }, { label: 'О компании' }]} />)
    fireEvent.click(screen.getByText('Главная'))
    expect(goHome).toHaveBeenCalledOnce()
  })
})
