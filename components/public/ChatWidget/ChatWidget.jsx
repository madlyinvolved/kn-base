'use client'

import { useState, useEffect } from 'react'
import ChatFab from './ChatFab.jsx'
import ChatMessages from './ChatMessages.jsx'
import ChatInput from './ChatInput.jsx'
import { useChat } from '../../../lib/hooks/useChat.js'

const QUICK_QUESTIONS = [
  'Какой график работы?',
  'Как оформить отпуск?',
  'Какие сервисы используются?',
  'Как забронировать переговорку?',
]

const windowStyle = {
  position: 'fixed',
  bottom: '92px',
  right: '24px',
  width: '370px',
  height: '500px',
  borderRadius: '16px',
  background: 'var(--color-bg)',
  border: '1px solid var(--color-border)',
  boxShadow: 'var(--shadow-lg)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  zIndex: 1000,
  animation: 'slideUp 0.25s ease',
}

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 16px',
  background: 'var(--color-accent)',
  color: 'white',
}

const headerTitleStyle = {
  fontFamily: 'var(--font-display)',
  fontWeight: 600,
  fontSize: '1rem',
}

const minimizeButtonStyle = {
  background: 'none',
  border: 'none',
  color: 'white',
  fontSize: '1.25rem',
  cursor: 'pointer',
  padding: '0 4px',
  lineHeight: 1,
}

const emptyStateStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  gap: '16px',
  textAlign: 'center',
}

const quickButtonStyle = {
  padding: '8px 14px',
  fontSize: '0.8125rem',
  fontFamily: 'var(--font-body)',
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: '20px',
  cursor: 'pointer',
  color: 'var(--color-text)',
  transition: 'all var(--transition-fast)',
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [available, setAvailable] = useState('detecting')

  const { messages, isLoading, sendMessage, error } = useChat()

  useEffect(() => {
    let cancelled = false
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    })
      .then((res) => {
        if (cancelled) return
        if (res.status === 500) {
          setAvailable('unavailable')
        } else {
          setAvailable('ready')
        }
      })
      .catch(() => {
        if (!cancelled) setAvailable('unavailable')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleQuickQuestion = (question) => {
    if (available === 'ready') {
      sendMessage(question)
    } else {
      setInputValue(question)
    }
  }

  const handleSend = (text) => {
    sendMessage(text)
  }

  const hasMessages = messages.length > 0

  function renderQuickQuestions() {
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'center',
        }}
      >
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            style={quickButtonStyle}
            onClick={() => handleQuickQuestion(q)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-accent)'
              e.currentTarget.style.color = 'var(--color-accent)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)'
              e.currentTarget.style.color = 'var(--color-text)'
            }}
          >
            {q}
          </button>
        ))}
      </div>
    )
  }

  return (
    <>
      <ChatFab isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />

      {isOpen && (
        <div className="chat-window" style={windowStyle} role="dialog" aria-label="AI-ассистент">
          <div style={headerStyle}>
            <span style={headerTitleStyle}>AI-ассистент</span>
            <button
              style={minimizeButtonStyle}
              onClick={() => setIsOpen(false)}
              aria-label="Свернуть чат"
            >
              ‒
            </button>
          </div>

          {available === 'detecting' && (
            <div style={emptyStateStyle}>
              <div style={{ fontSize: '2rem' }}>&#x1f916;</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Подключение...
              </p>
            </div>
          )}

          {available === 'unavailable' && (
            <div style={emptyStateStyle}>
              <div style={{ fontSize: '2rem' }}>&#x1f6a7;</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Чат-бот временно недоступен
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', opacity: 0.7 }}>
                Обратитесь к администратору для настройки сервиса
              </p>
            </div>
          )}

          {available === 'ready' && (
            <>
              {!hasMessages && !isLoading ? (
                <div style={emptyStateStyle}>
                  <div style={{ fontSize: '2rem' }}>&#x1f916;</div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    Задайте вопрос по базе знаний AdCorp
                  </p>
                  {renderQuickQuestions()}
                </div>
              ) : (
                <ChatMessages messages={messages} isLoading={isLoading} />
              )}

              {error && (
                <div
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.75rem',
                    color: '#dc2626',
                    background: '#fef2f2',
                    borderTop: '1px solid #fecaca',
                  }}
                >
                  {error}
                </div>
              )}

              <ChatInput
                onSend={handleSend}
                isLoading={isLoading}
                value={inputValue}
                onChange={setInputValue}
              />
            </>
          )}
        </div>
      )}
    </>
  )
}
