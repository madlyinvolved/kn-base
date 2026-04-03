import { useState } from 'react'

const formStyle = {
  display: 'flex',
  gap: '8px',
  padding: '12px 16px',
  borderTop: '1px solid var(--color-border-light)',
  background: 'var(--color-surface)',
}

const inputStyle = {
  flex: 1,
  padding: '10px 14px',
  fontSize: '0.875rem',
  fontFamily: 'var(--font-body)',
  border: '1px solid var(--color-border)',
  borderRadius: '10px',
  outline: 'none',
  background: 'var(--color-bg)',
  color: 'var(--color-text)',
  transition: 'border-color var(--transition-fast)',
}

const sendButtonStyle = {
  padding: '10px 16px',
  fontSize: '0.875rem',
  fontFamily: 'var(--font-body)',
  fontWeight: 600,
  background: 'var(--color-accent)',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'background var(--transition-fast)',
  whiteSpace: 'nowrap',
}

export default function ChatInput({ onSend, isLoading, value, onChange }) {
  const [localValue, setLocalValue] = useState('')
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : localValue

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = currentValue.trim()
    if (!text || isLoading) return
    onSend(text)
    if (isControlled) {
      onChange('')
    } else {
      setLocalValue('')
    }
  }

  const handleChange = (e) => {
    if (isControlled) {
      onChange(e.target.value)
    } else {
      setLocalValue(e.target.value)
    }
  }

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <input
        style={inputStyle}
        type="text"
        placeholder="Задайте вопрос..."
        value={currentValue}
        onChange={handleChange}
        disabled={isLoading}
        onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent)')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
        aria-label="Сообщение для AI-ассистента"
      />
      <button
        type="submit"
        style={{
          ...sendButtonStyle,
          opacity: isLoading || !currentValue.trim() ? 0.5 : 1,
          cursor: isLoading || !currentValue.trim() ? 'not-allowed' : 'pointer',
        }}
        disabled={isLoading || !currentValue.trim()}
      >
        →
      </button>
    </form>
  )
}
