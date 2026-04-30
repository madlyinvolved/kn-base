'use client'

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { useState, useCallback } from 'react'

const CARD_COLORS = {
  gray: { bg: '#f3f4f6', text: '#374151' },
  orange: { bg: '#fff7ed', text: '#9a3412' },
  green: { bg: '#ecfdf5', text: '#065f46' },
  purple: { bg: '#f5f3ff', text: '#5b21b6' },
  pink: { bg: '#fdf2f8', text: '#9d174d' },
  teal: { bg: '#f0fdfa', text: '#115e59' },
}

const COLOR_NAMES = Object.keys(CARD_COLORS)

const ARROWS = ['↓', '↑', '→', '←', '↔', '↕']

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

function emptyCard() {
  return { id: uid(), type: 'card', text: '', subtext: '', color: 'gray', icon: '' }
}

function emptySection() {
  return { id: uid(), type: 'section', title: '', layout: 'vertical', children: [emptyCard()] }
}

function emptyArrow() {
  return { id: uid(), type: 'arrow', direction: '↓' }
}

const inputStyle = {
  width: '100%',
  padding: '5px 8px',
  fontSize: '0.8125rem',
  fontFamily: 'var(--font-body)',
  border: '1px solid var(--color-border)',
  borderRadius: '6px',
  outline: 'none',
  boxSizing: 'border-box',
}

const smallBtn = {
  padding: '4px 10px',
  fontSize: '0.75rem',
  fontFamily: 'var(--font-body)',
  border: '1px solid var(--color-border)',
  borderRadius: '6px',
  background: 'var(--color-surface)',
  cursor: 'pointer',
  color: 'var(--color-text-secondary)',
  whiteSpace: 'nowrap',
}

const accentBtn = {
  ...smallBtn,
  background: 'var(--color-accent)',
  color: 'white',
  borderColor: 'var(--color-accent)',
}

const deleteBtn = {
  ...smallBtn,
  color: '#dc2626',
  borderColor: '#fca5a5',
  padding: '2px 7px',
  fontSize: '0.6875rem',
}

function CardEditor({ card, onChange, onRemove }) {
  function set(field, value) {
    onChange({ ...card, [field]: value })
  }

  return (
    <div
      style={{
        padding: '8px 12px',
        borderRadius: '8px',
        background: CARD_COLORS[card.color]?.bg || CARD_COLORS.gray.bg,
        border: '1px solid var(--color-border)',
        position: 'relative',
      }}
    >
      <button type="button" style={{ ...deleteBtn, position: 'absolute', top: 4, right: 4 }} onClick={onRemove}>
        ✕
      </button>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '4px', alignItems: 'center' }}>
        <input
          style={{ ...inputStyle, width: '36px', textAlign: 'center', padding: '4px', fontSize: '1rem' }}
          value={card.icon || ''}
          onChange={(e) => set('icon', e.target.value)}
          placeholder="😀"
          title="Иконка"
        />
        <input
          style={{ ...inputStyle, flex: 1, fontWeight: 600 }}
          value={card.text}
          onChange={(e) => set('text', e.target.value)}
          placeholder="Текст карточки"
        />
      </div>
      <input
        style={{ ...inputStyle, fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}
        value={card.subtext}
        onChange={(e) => set('subtext', e.target.value)}
        placeholder="Подтекст (описание)"
      />
      <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
        {COLOR_NAMES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => set('color', c)}
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              border: card.color === c ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
              background: CARD_COLORS[c].bg,
              cursor: 'pointer',
              padding: 0,
            }}
            title={c}
          />
        ))}
      </div>
    </div>
  )
}

function SectionEditor({ section, onChange, onRemove, depth = 0 }) {
  function setField(field, value) {
    onChange({ ...section, [field]: value })
  }

  function updateChild(idx, child) {
    const next = section.children.map((c, i) => (i === idx ? child : c))
    setField('children', next)
  }

  function removeChild(idx) {
    const next = section.children.filter((_, i) => i !== idx)
    setField('children', next.length ? next : [emptyCard()])
  }

  function addCard() {
    setField('children', [...section.children, emptyCard()])
  }

  function addSubSection() {
    if (depth >= 2) return
    setField('children', [...section.children, emptySection()])
  }

  function moveChild(idx, dir) {
    const next = [...section.children]
    const target = idx + dir
    if (target < 0 || target >= next.length) return
    ;[next[idx], next[target]] = [next[target], next[idx]]
    setField('children', next)
  }

  const isHorizontal = section.layout === 'horizontal'

  return (
    <div
      style={{
        border: '1.5px dashed var(--color-border)',
        borderRadius: '12px',
        padding: '12px',
        position: 'relative',
        background: depth === 0 ? 'var(--color-bg)' : 'transparent',
      }}
    >
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '10px' }}>
        <input
          style={{ ...inputStyle, fontWeight: 600, flex: 1, fontSize: '0.875rem' }}
          value={section.title}
          onChange={(e) => setField('title', e.target.value)}
          placeholder="Заголовок секции"
        />
        <button
          type="button"
          style={isHorizontal ? { ...smallBtn, background: '#e0e7ff', borderColor: '#818cf8' } : smallBtn}
          onClick={() => setField('layout', isHorizontal ? 'vertical' : 'horizontal')}
          title={isHorizontal ? 'Переключить на вертикальный' : 'Переключить на горизонтальный'}
        >
          {isHorizontal ? '⇔' : '⇕'}
        </button>
        <button type="button" style={deleteBtn} onClick={onRemove} title="Удалить секцию">
          ✕
        </button>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        gap: '8px',
        flexWrap: isHorizontal ? 'wrap' : 'nowrap',
      }}>
        {section.children.map((child, idx) => (
          <div key={child.id || idx} style={{ flex: isHorizontal ? '1 1 0' : undefined, minWidth: isHorizontal ? '140px' : undefined, position: 'relative' }}>
            {section.children.length > 1 && (
              <div style={{ display: 'flex', gap: '2px', marginBottom: '4px', justifyContent: 'center' }}>
                <button type="button" style={{ ...smallBtn, padding: '1px 6px', fontSize: '0.625rem' }} onClick={() => moveChild(idx, -1)} title="Переместить">
                  {isHorizontal ? '←' : '↑'}
                </button>
                <button type="button" style={{ ...smallBtn, padding: '1px 6px', fontSize: '0.625rem' }} onClick={() => moveChild(idx, 1)} title="Переместить">
                  {isHorizontal ? '→' : '↓'}
                </button>
              </div>
            )}
            {child.type === 'card' ? (
              <CardEditor card={child} onChange={(c) => updateChild(idx, c)} onRemove={() => removeChild(idx)} />
            ) : child.type === 'section' ? (
              <SectionEditor section={child} onChange={(s) => updateChild(idx, s)} onRemove={() => removeChild(idx)} depth={depth + 1} />
            ) : null}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
        <button type="button" style={smallBtn} onClick={addCard}>+ Карточка</button>
        {depth < 2 && <button type="button" style={smallBtn} onClick={addSubSection}>+ Секция</button>}
      </div>
    </div>
  )
}

function ArrowEditor({ arrow, onChange, onRemove }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '4px 0' }}>
      {ARROWS.map((a) => (
        <button
          key={a}
          type="button"
          onClick={() => onChange({ ...arrow, direction: a })}
          style={{
            ...smallBtn,
            fontSize: '1rem',
            padding: '2px 8px',
            background: arrow.direction === a ? 'var(--color-accent)' : 'var(--color-surface)',
            color: arrow.direction === a ? 'white' : 'var(--color-text)',
            borderColor: arrow.direction === a ? 'var(--color-accent)' : 'var(--color-border)',
          }}
        >
          {a}
        </button>
      ))}
      <button type="button" style={deleteBtn} onClick={onRemove}>✕</button>
    </div>
  )
}

function BlockSchemaView({ node, updateAttributes, deleteNode, selected }) {
  const data = node.attrs.data || { elements: [] }
  const [editing, setEditing] = useState(!data.elements.length)

  function setElements(elements) {
    updateAttributes({ data: { elements } })
  }

  function updateEl(idx, el) {
    setElements(data.elements.map((e, i) => (i === idx ? el : e)))
  }

  function removeEl(idx) {
    setElements(data.elements.filter((_, i) => i !== idx))
  }

  function addSection() {
    setElements([...data.elements, emptySection()])
  }

  function addArrow() {
    setElements([...data.elements, emptyArrow()])
  }

  if (editing) {
    return (
      <NodeViewWrapper data-block-schema>
        <div
          contentEditable={false}
          style={{
            border: '2px solid var(--color-accent)',
            borderRadius: '12px',
            padding: '16px',
            margin: '16px 0',
            background: 'var(--color-surface)',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '12px', fontSize: '0.875rem' }}>
            Конструктор блок-схемы
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.elements.map((el, idx) => {
              if (el.type === 'section') {
                return <SectionEditor key={el.id || idx} section={el} onChange={(s) => updateEl(idx, s)} onRemove={() => removeEl(idx)} />
              }
              if (el.type === 'arrow') {
                return <ArrowEditor key={el.id || idx} arrow={el} onChange={(a) => updateEl(idx, a)} onRemove={() => removeEl(idx)} />
              }
              return null
            })}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
            <button type="button" style={smallBtn} onClick={addSection}>+ Секция</button>
            <button type="button" style={smallBtn} onClick={addArrow}>+ Стрелка</button>
            <div style={{ flex: 1 }} />
            <button type="button" style={accentBtn} onClick={() => setEditing(false)}>Готово</button>
          </div>
        </div>
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper data-block-schema>
      <div
        contentEditable={false}
        style={{
          position: 'relative',
          outline: selected ? '2px solid var(--color-accent)' : 'none',
          outlineOffset: '4px',
          borderRadius: '12px',
          margin: '16px 0',
        }}
      >
        <SchemaPreview elements={data.elements} />

        {selected && (
          <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
            <button type="button" style={smallBtn} onClick={() => setEditing(true)}>Редактировать</button>
            <button type="button" style={{ ...smallBtn, color: '#dc2626' }} onClick={() => deleteNode()}>Удалить блок</button>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  )
}

export function SchemaPreview({ elements }) {
  if (!elements?.length) return null

  return (
    <div className="block-schema">
      {elements.map((el, idx) => {
        if (el.type === 'section') return <SectionPreview key={el.id || idx} section={el} />
        if (el.type === 'arrow') return <ArrowPreview key={el.id || idx} arrow={el} />
        return null
      })}
    </div>
  )
}

function SectionPreview({ section }) {
  const isHorizontal = section.layout === 'horizontal'

  return (
    <div className="block-schema__section">
      {section.title && <div className="block-schema__section-title">{section.title}</div>}
      <div className={isHorizontal ? 'block-schema__children block-schema__children--horizontal' : 'block-schema__children'}>
        {(section.children || []).map((child, idx) => {
          if (child.type === 'card') return <CardPreview key={child.id || idx} card={child} />
          if (child.type === 'section') return <SectionPreview key={child.id || idx} section={child} />
          return null
        })}
      </div>
    </div>
  )
}

function CardPreview({ card }) {
  const colors = CARD_COLORS[card.color] || CARD_COLORS.gray

  return (
    <div className="block-schema__card" style={{ background: colors.bg, color: colors.text }}>
      {card.icon && <span className="block-schema__card-icon">{card.icon}</span>}
      <div>
        {card.text && <div className="block-schema__card-text">{card.text}</div>}
        {card.subtext && <div className="block-schema__card-subtext">{card.subtext}</div>}
      </div>
    </div>
  )
}

function ArrowPreview({ arrow }) {
  return <div className="block-schema__arrow">{arrow.direction || '↓'}</div>
}

export const BlockSchema = Node.create({
  name: 'blockSchema',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      data: {
        default: { elements: [] },
        parseHTML: (el) => {
          try {
            return JSON.parse(el.getAttribute('data-schema') || '{"elements":[]}')
          } catch {
            return { elements: [] }
          }
        },
        renderHTML: (attrs) => ({
          'data-schema': JSON.stringify(attrs.data),
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-block-schema]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ 'data-block-schema': '' }, HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(BlockSchemaView)
  },
})
