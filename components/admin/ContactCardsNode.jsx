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

const cardStyle = {
  padding: '16px',
  borderRadius: '12px',
  border: '1px solid var(--color-border)',
  background: 'var(--color-surface)',
  fontSize: '0.875rem',
  lineHeight: 1.5,
}

const nameStyle = {
  fontWeight: 700,
  fontSize: '0.9375rem',
  marginBottom: '4px',
}

const slackStyle = {
  fontSize: '0.8125rem',
  color: 'var(--color-accent)',
  marginBottom: '8px',
}

const topicsStyle = {
  fontSize: '0.8125rem',
  color: 'var(--color-text-secondary)',
  whiteSpace: 'pre-wrap',
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

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: '48px',
  lineHeight: 1.4,
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
  return { name: '', slack: '', topics: '' }
}

function ContactCardsView({ node, updateAttributes, deleteNode, selected }) {
  const cards = node.attrs.cards || [emptyCard()]
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

          <div style={gridStyle}>
            {draft.map((card, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  padding: '12px',
                  background: 'var(--color-bg)',
                  position: 'relative',
                }}
              >
                {draft.length > 1 && (
                  <button
                    type="button"
                    style={{
                      ...smallBtnStyle,
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      color: '#dc2626',
                      borderColor: '#fca5a5',
                      padding: '2px 7px',
                      fontSize: '0.6875rem',
                    }}
                    onClick={() => removeCard(idx)}
                    title="Удалить контакт"
                  >
                    ✕
                  </button>
                )}
                <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                  Контакт {idx + 1}
                </div>
                <input
                  style={inputStyle}
                  placeholder="Имя"
                  value={card.name}
                  onChange={(e) => updateCard(idx, 'name', e.target.value)}
                />
                <input
                  style={inputStyle}
                  placeholder="Slack (@anna.leonova)"
                  value={card.slack}
                  onChange={(e) => updateCard(idx, 'slack', e.target.value)}
                />
                <textarea
                  style={textareaStyle}
                  placeholder="По каким вопросам обращаться"
                  value={card.topics}
                  onChange={(e) => updateCard(idx, 'topics', e.target.value)}
                  rows={2}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button type="button" style={smallBtnStyle} onClick={addCard}>
              + Добавить контакт
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

  const hasContent = cards.some((c) => c.name || c.slack || c.topics)

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
            Нажмите чтобы добавить контакты
          </div>
        ) : (
          <div style={gridStyle}>
            {cards.map((card, idx) => (
              <div key={idx} style={cardStyle}>
                {card.name && <div style={nameStyle}>{card.name}</div>}
                {card.slack && <div style={slackStyle}>{card.slack}</div>}
                {card.topics && <div style={topicsStyle}>{card.topics}</div>}
              </div>
            ))}
          </div>
        )}

        {selected && (
          <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
            <button type="button" style={smallBtnStyle} onClick={() => setEditing(true)}>
              Редактировать
            </button>
            <button
              type="button"
              style={{ ...smallBtnStyle, color: '#dc2626' }}
              onClick={() => deleteNode()}
            >
              Удалить блок
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
