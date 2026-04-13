'use client'

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { useState, useRef } from 'react'
import { uploadImageToStorage } from '../../lib/utils/uploadImage.js'

const AVATAR_SIZE = 80
const AVATAR_COLORS = ['#e85d2a', '#3b82f6', '#8b5cf6', '#059669', '#d946ef', '#f59e0b', '#6366f1', '#ec4899']

/* Grid uses CSS class .contact-cards-grid for responsive columns */

const cardStyle = {
  padding: '16px',
  borderRadius: '12px',
  border: '1px solid var(--color-border)',
  background: 'var(--color-surface)',
  fontSize: '0.875rem',
  lineHeight: 1.5,
  display: 'flex',
  gap: '14px',
  alignItems: 'flex-start',
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
  return { name: '', slack: '', topics: '', photo: null }
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.trim().slice(0, 2).toUpperCase()
}

function getAvatarColor(name) {
  let hash = 0
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function Avatar({ name, photo, size, onClick, uploading }) {
  const avatarBase = {
    width: size,
    height: size,
    minWidth: size,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative',
    userSelect: 'none',
  }

  if (photo) {
    return (
      <div style={avatarBase} onClick={onClick} title={onClick ? 'Заменить фото' : undefined}>
        <img src={photo} alt={name || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {uploading && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '0.75rem',
          }}>
            ...
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      style={{
        ...avatarBase,
        background: getAvatarColor(name),
        color: 'white',
        fontWeight: 700,
        fontSize: size * 0.35,
        letterSpacing: '0.5px',
      }}
      onClick={onClick}
      title={onClick ? 'Загрузить фото' : undefined}
    >
      {uploading ? '...' : getInitials(name)}
    </div>
  )
}

function ContactCardsView({ node, updateAttributes, deleteNode, selected }) {
  const cards = node.attrs.cards || [emptyCard()]
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(cards)
  const [uploadingIdx, setUploadingIdx] = useState(-1)
  const fileRefs = useRef({})

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

  async function handleAvatarUpload(idx, e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingIdx(idx)
    const url = await uploadImageToStorage(file)
    setUploadingIdx(-1)
    if (url) {
      updateCard(idx, 'photo', url)
    }
  }

  function triggerFileInput(idx) {
    if (!fileRefs.current[idx]) {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      fileRefs.current[idx] = input
    }
    fileRefs.current[idx].onchange = (e) => handleAvatarUpload(idx, e)
    fileRefs.current[idx].click()
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

          <div className="contact-cards-grid">
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

                <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                  <Avatar
                    name={card.name}
                    photo={card.photo}
                    size={AVATAR_SIZE}
                    onClick={() => triggerFileInput(idx)}
                    uploading={uploadingIdx === idx}
                  />
                  <div style={{ flex: 1, paddingTop: '2px' }}>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
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
                  </div>
                </div>

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
          <div className="contact-cards-grid">
            {cards.map((card, idx) => (
              <div key={idx} style={cardStyle}>
                <Avatar name={card.name} photo={card.photo} size={AVATAR_SIZE} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  {card.name && <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '2px' }}>{card.name}</div>}
                  {card.slack && <div style={{ fontSize: '0.8125rem', color: 'var(--color-accent)', marginBottom: '6px' }}>{card.slack}</div>}
                  {card.topics && <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap' }}>{card.topics}</div>}
                </div>
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
