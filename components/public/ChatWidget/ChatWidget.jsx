'use client'

import { useState, useEffect } from 'react'
import ChatFab from './ChatFab.jsx'
import ChatMessages from './ChatMessages.jsx'
import ChatInput from './ChatInput.jsx'
import { useChat } from '../../../lib/hooks/useChat.js'
import { ARTICLES } from '../../../lib/data/knowledge-base.js'

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

const apiKeyFormStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '20px 16px',
  borderTop: '1px solid var(--color-border-light)',
  background: 'var(--color-surface)',
}

const apiKeyInputStyle = {
  padding: '10px 14px',
  fontSize: '0.8125rem',
  fontFamily: 'var(--font-body)',
  border: '1px solid var(--color-border)',
  borderRadius: '10px',
  outline: 'none',
  background: 'var(--color-bg)',
  color: 'var(--color-text)',
}

const apiKeyButtonStyle = {
  padding: '10px',
  fontSize: '0.8125rem',
  fontFamily: 'var(--font-body)',
  fontWeight: 600,
  background: 'var(--color-accent)',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
}

const linkButtonStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--color-accent)',
  fontSize: '0.75rem',
  cursor: 'pointer',
  fontFamily: 'var(--font-body)',
  padding: '4px 0',
  textDecoration: 'underline',
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [mode, setMode] = useState('detecting')

  const { messages, isLoading, sendMessage, error } = useChat(
    mode === 'direct' ? apiKey : '',
    ARTICLES,
  )

  useEffect(() => {
    let cancelled = false
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    })
      .then((res) => {
        if (cancelled) return
        if (res.status === 404) {
          setMode('direct')
        } else {
          setMode('proxy')
        }
      })
      .catch(() => {
        if (!cancelled) setMode('direct')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const isReady = mode === 'proxy' || (mode === 'direct' && apiKey)

  const handleApiKeySubmit = (e) => {
    e.preventDefault()
    const key = apiKeyInput.trim()
    if (key) {
      setApiKey(key)
    }
  }

  const handleQuickQuestion = (question) => {
    if (isReady) {
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
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {mode === 'direct' && apiKey && (
                <button
                  style={{ ...minimizeButtonStyle, fontSize: '0.75rem', opacity: 0.8 }}
                  onClick={() => {
                    setApiKey('')
                    setApiKeyInput('')
                  }}
                  title="Сменить API-ключ"
                >
                  🔑
                </button>
              )}
              <button
                style={minimizeButtonStyle}
                onClick={() => setIsOpen(false)}
                aria-label="Свернуть чат"
              >
                ‒
              </button>
            </div>
          </div>

          {mode === 'detecting' && (
            <div style={emptyStateStyle}>
              <div style={{ fontSize: '2rem' }}>🤖</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Подключение...
              </p>
            </div>
          )}

          {mode === 'direct' && !apiKey && (
            <>
              <div style={emptyStateStyle}>
                <div style={{ fontSize: '2rem' }}>🤖</div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  Я помогу найти ответ в базе знаний. Для начала введите API-ключ Anthropic.
                </p>
                {renderQuickQuestions()}
              </div>
              <form style={apiKeyFormStyle} onSubmit={handleApiKeySubmit}>
                <input
                  style={apiKeyInputStyle}
                  type="password"
                  placeholder="sk-ant-api03-..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  aria-label="Anthropic API ключ"
                />
                <button
                  type="submit"
                  style={{
                    ...apiKeyButtonStyle,
                    opacity: apiKeyInput.trim() ? 1 : 0.5,
                  }}
                  disabled={!apiKeyInput.trim()}
                >
                  Начать чат
                </button>
              </form>
            </>
          )}

          {isReady && (
            <>
              {!hasMessages && !isLoading ? (
                <div style={emptyStateStyle}>
                  <div style={{ fontSize: '2rem' }}>🤖</div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    Задайте вопрос по базе знаний AdCorp
                  </p>
                  {renderQuickQuestions()}
                  {mode === 'proxy' && (
                    <button style={linkButtonStyle} onClick={() => setMode('direct')}>
                      Использовать свой API-ключ
                    </button>
                  )}
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
