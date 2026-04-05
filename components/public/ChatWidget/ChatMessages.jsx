'use client'

import { useEffect, useRef } from 'react'

const containerStyle = {
  flex: 1,
  overflowY: 'auto',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
}

const messageBubbleBase = {
  maxWidth: '85%',
  padding: '10px 14px',
  borderRadius: '14px',
  fontSize: '0.875rem',
  lineHeight: 1.5,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  animation: 'fadeUp 0.2s ease',
}

const userBubble = {
  ...messageBubbleBase,
  alignSelf: 'flex-end',
  background: 'var(--color-accent)',
  color: 'white',
  borderBottomRightRadius: '4px',
}

const assistantBubble = {
  ...messageBubbleBase,
  alignSelf: 'flex-start',
  background: 'var(--color-surface)',
  color: 'var(--color-text)',
  border: '1px solid var(--color-border)',
  borderBottomLeftRadius: '4px',
}

const loadingStyle = {
  ...messageBubbleBase,
  alignSelf: 'flex-start',
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderBottomLeftRadius: '4px',
  display: 'flex',
  gap: '4px',
  padding: '14px 18px',
}

const dotStyle = {
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  background: 'var(--color-text-secondary)',
  animation: 'pulse 1s ease-in-out infinite',
}

export default function ChatMessages({ messages, isLoading }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div style={containerStyle}>
      {messages.map((msg, index) => (
        <div key={index} style={msg.role === 'user' ? userBubble : assistantBubble}>
          {msg.content}
        </div>
      ))}
      {isLoading && (
        <div style={loadingStyle}>
          <span style={{ ...dotStyle, animationDelay: '0ms' }} />
          <span style={{ ...dotStyle, animationDelay: '200ms' }} />
          <span style={{ ...dotStyle, animationDelay: '400ms' }} />
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
