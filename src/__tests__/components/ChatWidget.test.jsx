import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ChatWidget from '../../components/ChatWidget/ChatWidget.jsx'

describe('ChatWidget', () => {
  it('renders FAB button', () => {
    render(<ChatWidget />)
    expect(screen.getByLabelText('Открыть AI-ассистент')).toBeInTheDocument()
  })

  it('opens chat window on FAB click', () => {
    render(<ChatWidget />)
    fireEvent.click(screen.getByLabelText('Открыть AI-ассистент'))
    expect(screen.getByText('AI-ассистент')).toBeInTheDocument()
  })

  it('closes chat window on minimize click', () => {
    render(<ChatWidget />)
    fireEvent.click(screen.getByLabelText('Открыть AI-ассистент'))
    expect(screen.getByText('AI-ассистент')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Свернуть чат'))
    expect(screen.queryByText('AI-ассистент')).not.toBeInTheDocument()
  })

  it('shows quick questions after mode detection', async () => {
    render(<ChatWidget />)
    fireEvent.click(screen.getByLabelText('Открыть AI-ассистент'))
    // Wait for proxy detection to fail (falls back to direct mode)
    await waitFor(() => {
      expect(screen.getByText('Какой график работы?')).toBeInTheDocument()
    })
    expect(screen.getByText('Как оформить отпуск?')).toBeInTheDocument()
  })

  it('shows API key input in direct mode', async () => {
    render(<ChatWidget />)
    fireEvent.click(screen.getByLabelText('Открыть AI-ассистент'))
    await waitFor(() => {
      expect(screen.getByLabelText('Anthropic API ключ')).toBeInTheDocument()
    })
    expect(screen.getByText('Начать чат')).toBeInTheDocument()
  })

  it('quick question fills input when no API key', async () => {
    render(<ChatWidget />)
    fireEvent.click(screen.getByLabelText('Открыть AI-ассистент'))
    await waitFor(() => {
      expect(screen.getByText('Какой график работы?')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Какой график работы?'))
    expect(screen.getByLabelText('Anthropic API ключ')).toBeInTheDocument()
  })
})
