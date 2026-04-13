'use client'

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { useState } from 'react'

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '12px',
  margin: '16px 0',
}

const cardBase = {
  padding: '16px',
  borderRadius: '12px',
  border: '1px solid var(--color-border)',
  background: 'var(--color-surface)',
  fontSize: '0.875rem',
  lineHeight: 1.5,
}

const cardHighlight = {
  ...cardBase,
  borderColor: 'var(--color-accent)',
  background: '#fef6f3',
  boxShadow: '0 0 0 1px var(--color-accent)',
}

const nameStyle = {
  fontWeight: 700,
  fontSize: '0.9375rem',
  marginBottom: '4px',
}

const roleStyle = {
  fontSize: '0.8125rem',
  color: 'var(--color-text-secondary)',
  marginBottom: '8px',
}

const fieldRow = {
  fontSize: '0.8125rem',
  color: 'var(--color-text)',
  marginBottom: '2px',
  wordBreak: 'break-all',
}

const inputStyle = {
  width: '100%',
  padding: '6px 8px',
  fontSize: '0.8125rem',
  fontFamily: 'var(--font-body)',
  border: '1px solid var(--color-border)',
  borderRadius: '6px',
  outline: 'none',
  marginBottom: '6px',
  boxSizing: 'border-box',
}

const smallBtnStyle = {
  padding: '4px 10px',
  fontSize: '0.75rem',
  fontFamily: 'var(--font-body)',
  border: '1px solid var(--color-border)',
  borderRadius: '6px',
  background: 'var(--color-surface)',
  cursor: 'pointer',
  color: 'var(--color-text-secondary)',
}

function emptyCard() {
  return { name: '', role: '', phone: '', email: '' }
}

function ContactCardsView({ node, updateAttributes, deleteNode, selected }) {
  const cards = node.attrs.cards || [emptyCard(), emptyCard(), emptyCard()]
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(cards)

  function updateCard(idx, field, value) {
    const next = draft.map((c, i) => (i === idx ? { ...c, [field]: value } : c))
    setDraft(next)
  }

  function addCard() {
    setDraft([...draft, emptyCard()])
  }

  function removeCard(idx) {
    if (draft.length <= 1) return
    setDraft(draft.filter((_, i) => i !== idx))
  }

  function save() {
    updateAttributes({ cards: draft })
    setEditing(false)
  }

  function cancel() {
    setDraft(cards)
    setEditing(false)
  }

  if (editing) {
    return (
      <NodeViewWrapper data-contact-cards>
        <div
          style={{
            border: '2px solid var(--color-accent)',
            borderRadius: '12px',
            padding: '16px',
            margin: '16px 0',
            background: 'var(--color-surface)',
          }}
          contentEditable={false}
        >
          <div style={{ fontWeight: 600, marginBottom: '12px', fontSize: '0.875rem' }}>
            Редактирование контактов
          </div>

          {draft.map((card, idx) => (
            <div
              key={idx}
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '8px',
                background: idx === 0 ? '#fef6f3' : 'var(--color-bg)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  {idx === 0 ? '★ Основной контакт' : `Контакт ${idx + 1}`}
                </span>
                {draft.length > 1 && (
                  <button
                    type="button"
                    style={{ ...smallBtnStyle, color: '#dc2626', borderColor: '#fca5a5' }}
                    onClick={() => removeCard(idx)}
                  >
                    ✕
                  </button>
                )}
              </div>
              <input
                style={inputStyle}
                placeholder="Имя"
                value={card.name}
                onChange={(e) => updateCard(idx, 'name', e.target.value)}
              />
              <input
                style={inputStyle}
                placeholder="Должность"
                value={card.role}
                onChange={(e) => updateCard(idx, 'role', e.target.value)}
              />
              <input
                style={inputStyle}
                placeholder="Телефон"
                value={card.phone}
                onChange={(e) => updateCard(idx, 'phone', e.target.value)}
              />
              <input
                style={inputStyle}
                placeholder="Email"
                value={card.email}
                onChange={(e) => updateCard(idx, 'email', e.target.value)}
              />
            </div>
          ))}

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button type="button" style={smallBtnStyle} onClick={addCard}>
              + Добавить
            </button>
            <div style={{ flex: 1 }} />
            <button type="button" style={smallBtnStyle} onClick={cancel}>
              Отмена
            </button>
            <button
              type="button"
              style={{
                ...smallBtnStyle,
                background: 'var(--color-accent)',
                color: 'white',
                borderColor: 'var(--color-accent)',
              }}
              onClick={save}
            >
              Сохранить
            </button>
          </div>
        </div>
      </NodeViewWrapper>
    )
  }

  const hasContent = cards.some((c) => c.name || c.role || c.phone || c.email)

  return (
    <NodeViewWrapper data-contact-cards>
      <div
        contentEditable={false}
        style={{
          position: 'relative',
          outline: selected ? '2px solid var(--color-accent)' : 'none',
          outlineOffset: '4px',
          borderRadius: '12px',
        }}
      >
        {!hasContent ? (
          <div
            onClick={() => setEditing(true)}
            style={{
              padding: '24px',
              textAlign: 'center',
              border: '2px dashed var(--color-border)',
              borderRadius: '12px',
              margin: '16px 0',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              fontSize: '0.875rem',
            }}
          >
            👥 Нажмите чтобы добавить контакты
          </div>
        ) : (
          <div style={gridStyle}>
            {cards.map((card, idx) => (
              <div key={idx} style={idx === 0 ? cardHighlight : cardBase}>
                {card.name && <div style={nameStyle}>{card.name}</div>}
                {card.role && <div style={roleStyle}>{card.role}</div>}
                {card.phone && <div style={fieldRow}>📞 {card.phone}</div>}
                {card.email && <div style={fieldRow}>✉️ {card.email}</div>}
              </div>
            ))}
          </div>
        )}

        {selected && (
          <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
            <button type="button" style={smallBtnStyle} onClick={() => setEditing(true)}>
              ✏️ Редактировать
            </button>
            <button
              type="button"
              style={{ ...smallBtnStyle, color: '#dc2626' }}
              onClick={() => deleteNode()}
            >
              Удалить
            </button>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  )
}

export const ContactCards = Node.create({
  name: 'contactCards',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      cards: {
        default: [emptyCard(), emptyCard(), emptyCard()],
        parseHTML: (el) => {
          try {
            return JSON.parse(el.getAttribute('data-cards') || '[]')
          } catch {
            return [emptyCard(), emptyCard(), emptyCard()]
          }
        },
        renderHTML: (attrs) => ({
          'data-cards': JSON.stringify(attrs.cards),
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-contact-cards]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-contact-cards': '' }, HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ContactCardsView)
  },
})
