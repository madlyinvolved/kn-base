'use client'

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { useState, useRef, useEffect, useCallback } from 'react'
import { uploadImageToStorage } from '../../lib/utils/uploadImage.js'

const PALETTE = {
  coral:  { bg: '#fff1ee', solid: '#e85d2a', text: '#9a3412' },
  teal:   { bg: '#f0fdfa', solid: '#0d9488', text: '#115e59' },
  purple: { bg: '#f5f3ff', solid: '#7c3aed', text: '#5b21b6' },
  pink:   { bg: '#fdf2f8', solid: '#db2777', text: '#9d174d' },
  blue:   { bg: '#eff6ff', solid: '#2563eb', text: '#1e40af' },
  amber:  { bg: '#fffbeb', solid: '#d97706', text: '#92400e' },
  'pastel-coral':  { bg: '#FAECE7', solid: '#FAECE7', text: '#9a3412', pastel: true },
  'pastel-teal':   { bg: '#E1F5EE', solid: '#E1F5EE', text: '#115e59', pastel: true },
  'pastel-purple': { bg: '#EEEDFE', solid: '#EEEDFE', text: '#5b21b6', pastel: true },
  'pastel-pink':   { bg: '#FBEAF0', solid: '#FBEAF0', text: '#9d174d', pastel: true },
  'pastel-blue':   { bg: '#E6F1FB', solid: '#E6F1FB', text: '#1e40af', pastel: true },
  'pastel-amber':  { bg: '#FAEEDA', solid: '#FAEEDA', text: '#92400e', pastel: true },
  'pastel-gray':   { bg: '#F1EFE8', solid: '#F1EFE8', text: '#44403c', pastel: true },
}
const PALETTE_NAMES = Object.keys(PALETTE)
const BRIGHT_COLORS = PALETTE_NAMES.filter((c) => !PALETTE[c].pastel)
const PASTEL_COLORS = PALETTE_NAMES.filter((c) => PALETTE[c].pastel)

const ICONS = {
  server:   '<rect x="4" y="2" width="16" height="8" rx="2"/><rect x="4" y="14" width="16" height="8" rx="2"/><circle cx="8" cy="6" r="1"/><circle cx="8" cy="18" r="1"/>',
  monitor:  '<rect x="3" y="3" width="18" height="13" rx="2"/><path d="M8 21h8m-4-5v5"/>',
  user:     '<circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/>',
  target:   '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  chart:    '<path d="M3 3v18h18"/><path d="M7 16l4-4 4 4 5-5"/>',
  gear:     '<circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>',
  bolt:     '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  shield:   '<path d="M12 2l7 4v5c0 5-3.5 9.74-7 11-3.5-1.26-7-6-7-11V6l7-4z"/>',
  code:     '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  cloud:    '<path d="M18 10a5 5 0 0 0-9.58-1.5A4 4 0 1 0 5 16h13a3 3 0 0 0 0-6z"/>',
  lock:     '<rect x="5" y="11" width="14" height="11" rx="2"/><path d="M12 3a4 4 0 0 0-4 4v4h8V7a4 4 0 0 0-4-4z"/>',
  globe:    '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 5v6c0 1.66-4.03 3-9 3S3 12.66 3 11V5"/><path d="M21 11v6c0 1.66-4.03 3-9 3s-9-1.34-9-3v-6"/>',
  star:     '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
}
const ICON_NAMES = Object.keys(ICONS)

function SvgIcon({ name, size = 24, color = 'currentColor' }) {
  const d = ICONS[name]
  if (!d) return null
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />
  )
}

export function SvgIconPreview({ name, size = 16, color = 'currentColor' }) {
  return <SvgIcon name={name} size={size} color={color} />
}

const CARD_STYLES = [
  { value: 'icon', label: 'Иконка' },
  { value: 'pill', label: 'Пилл' },
  { value: 'stripe', label: 'Полоска' },
  { value: 'image', label: 'С картинкой' },
]

const SECTION_WIDTHS = [
  { value: '100', label: '100%' },
  { value: '75', label: '75%' },
  { value: '50', label: '50%' },
  { value: '25', label: '25%' },
]

const CARD_WIDTHS = [
  { value: 'auto', label: 'Авто' },
  { value: '50', label: '50%' },
  { value: '100', label: '100%' },
]

const ARROWS = ['↓', '↑', '→', '←', '↔', '↕']

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

function emptyCard() {
  return { id: uid(), type: 'card', style: 'icon', text: '', subtext: '', tooltip: '', color: 'coral', svgIcon: 'server', imageUrl: '', width: 'auto', filled: false }
}

function emptySection() {
  return { id: uid(), type: 'section', title: '', layout: 'vertical', width: '100', stretch: true, children: [emptyCard()] }
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

const selectStyle = {
  ...inputStyle,
  width: 'auto',
  padding: '3px 6px',
  fontSize: '0.75rem',
  cursor: 'pointer',
  background: 'var(--color-surface)',
}

function ColorPicker({ value, onChange }) {
  function renderRow(colors) {
    return (
      <div style={{ display: 'flex', gap: '4px' }}>
        {colors.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              border: value === c ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
              background: PALETTE[c].solid,
              cursor: 'pointer',
              padding: 0,
            }}
            title={c}
          />
        ))}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
      {renderRow(BRIGHT_COLORS)}
      {renderRow(PASTEL_COLORS)}
    </div>
  )
}

function IconPicker({ value, onChange, color }) {
  const pal = PALETTE[color] || PALETTE.coral
  const iconColor = pal.pastel ? pal.text : pal.solid
  return (
    <div style={{ display: 'flex', gap: '3px', marginTop: '4px', flexWrap: 'wrap' }}>
      {ICON_NAMES.map((name) => (
        <button
          key={name}
          type="button"
          onClick={() => onChange(name)}
          style={{
            width: 28,
            height: 28,
            borderRadius: '6px',
            border: value === name ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
            background: value === name ? pal.bg : 'var(--color-surface)',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title={name}
        >
          <SvgIcon name={name} size={14} color={value === name ? iconColor : 'var(--color-text-secondary)'} />
        </button>
      ))}
    </div>
  )
}

function ImageUploader({ imageUrl, onChange }) {
  const ref = useRef(null)
  const [uploading, setUploading] = useState(false)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const url = await uploadImageToStorage(file)
    setUploading(false)
    if (url) onChange(url)
  }

  return (
    <div
      onClick={() => ref.current?.click()}
      style={{
        width: 32,
        height: 32,
        borderRadius: '6px',
        border: '1px dashed var(--color-border)',
        background: imageUrl ? 'transparent' : 'var(--color-bg)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {uploading ? (
        <span style={{ fontSize: '0.625rem', color: 'var(--color-text-secondary)' }}>...</span>
      ) : imageUrl ? (
        <img src={imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1 }}>+</span>
      )}
      <input ref={ref} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
    </div>
  )
}

function InlineArrowEditor({ arrow, onChange, onRemove }) {
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '2px 0' }}>
        <button type="button" style={{ ...smallBtn, fontSize: '1rem', padding: '0 6px', lineHeight: 1 }} onClick={() => setOpen(true)}>
          {arrow.direction || '↓'}
        </button>
        <button type="button" style={{ ...deleteBtn, padding: '1px 5px' }} onClick={onRemove}>✕</button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '2px 0' }}>
      {ARROWS.map((a) => (
        <button
          key={a}
          type="button"
          onClick={() => { onChange({ ...arrow, direction: a }); setOpen(false) }}
          style={{
            ...smallBtn,
            fontSize: '0.875rem',
            padding: '1px 6px',
            background: arrow.direction === a ? 'var(--color-accent)' : 'var(--color-surface)',
            color: arrow.direction === a ? 'white' : 'var(--color-text)',
            borderColor: arrow.direction === a ? 'var(--color-accent)' : 'var(--color-border)',
          }}
        >
          {a}
        </button>
      ))}
      <button type="button" style={{ ...deleteBtn, padding: '1px 5px' }} onClick={onRemove}>✕</button>
    </div>
  )
}

function CardEditor({ card, onChange, onRemove }) {
  function set(field, value) {
    onChange({ ...card, [field]: value })
  }

  const pal = PALETTE[card.color] || PALETTE.coral
  const st = card.style || 'icon'

  return (
    <div
      style={{
        padding: '8px 12px',
        borderRadius: '8px',
        background: pal.bg,
        border: '1px solid var(--color-border)',
        position: 'relative',
      }}
    >
      <button type="button" style={{ ...deleteBtn, position: 'absolute', top: 4, right: 4 }} onClick={onRemove}>
        ✕
      </button>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', alignItems: 'center' }}>
        <select style={selectStyle} value={st} onChange={(e) => set('style', e.target.value)}>
          {CARD_STYLES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select style={selectStyle} value={card.width || 'auto'} onChange={(e) => set('width', e.target.value)} title="Ширина карточки">
          {CARD_WIDTHS.map((w) => <option key={w.value} value={w.value}>{w.label}</option>)}
        </select>
      </div>

      {st === 'image' && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
          <ImageUploader imageUrl={card.imageUrl} onChange={(url) => set('imageUrl', url)} />
          <input
            style={{ ...inputStyle, flex: 1, fontWeight: 600 }}
            value={card.text}
            onChange={(e) => set('text', e.target.value)}
            placeholder="Текст"
          />
        </div>
      )}

      {st !== 'image' && (
        <input
          style={{ ...inputStyle, fontWeight: 600, marginBottom: '4px' }}
          value={card.text}
          onChange={(e) => set('text', e.target.value)}
          placeholder="Текст"
        />
      )}

      <input
        style={{ ...inputStyle, fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}
        value={card.subtext}
        onChange={(e) => set('subtext', e.target.value)}
        placeholder="Подтекст"
      />

      <textarea
        style={{ ...inputStyle, fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px', resize: 'vertical', minHeight: '32px' }}
        value={card.tooltip || ''}
        onChange={(e) => set('tooltip', e.target.value)}
        placeholder="Текст подсказки при наведении (необязательно)"
        rows={1}
      />

      {st === 'icon' && (
        <IconPicker value={card.svgIcon || 'server'} onChange={(v) => set('svgIcon', v)} color={card.color} />
      )}

      <ColorPicker value={card.color} onChange={(v) => set('color', v)} />

      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.75rem', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
        <input type="checkbox" checked={!!card.filled} onChange={(e) => set('filled', e.target.checked)} />
        Залить цветом
      </label>
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
    const hasCards = next.some((c) => c.type === 'card' || c.type === 'section')
    setField('children', hasCards ? next : [emptyCard()])
  }

  function addCard() {
    setField('children', [...section.children, emptyCard()])
  }

  function addSubSection() {
    if (depth >= 2) return
    setField('children', [...section.children, emptySection()])
  }

  function insertChildAt(idx, type) {
    const creators = { arrow: emptyArrow, card: emptyCard, section: emptySection }
    const next = [...section.children]
    next.splice(idx, 0, (creators[type] || emptyCard)())
    setField('children', next)
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
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
        <input
          style={{ ...inputStyle, fontWeight: 600, flex: 1, fontSize: '0.875rem', minWidth: '100px' }}
          value={section.title}
          onChange={(e) => setField('title', e.target.value)}
          placeholder="Заголовок секции"
        />
        <select style={selectStyle} value={section.width || '100'} onChange={(e) => setField('width', e.target.value)} title="Ширина секции">
          {SECTION_WIDTHS.map((w) => <option key={w.value} value={w.value}>{w.label}</option>)}
        </select>
        <button
          type="button"
          style={isHorizontal ? { ...smallBtn, background: '#e0e7ff', borderColor: '#818cf8' } : smallBtn}
          onClick={() => setField('layout', isHorizontal ? 'vertical' : 'horizontal')}
          title={isHorizontal ? 'Вертикальный' : 'Горизонтальный'}
        >
          {isHorizontal ? '⇔' : '⇕'}
        </button>
        {isHorizontal && (
          <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.6875rem', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
            <input type="checkbox" checked={section.stretch !== false} onChange={(e) => setField('stretch', e.target.checked)} />
            Растянуть
          </label>
        )}
        <button type="button" style={deleteBtn} onClick={onRemove} title="Удалить секцию">
          ✕
        </button>
      </div>

      {isHorizontal ? (
        <div style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: '1fr', gap: '8px' }}>
          {section.children.map((child, idx) => (
            <div key={child.id || idx} style={{ minWidth: 0, position: 'relative' }}>
              {section.children.length > 1 && child.type !== 'arrow' && (
                <div style={{ display: 'flex', gap: '2px', marginBottom: '4px', justifyContent: 'center' }}>
                  <button type="button" style={{ ...smallBtn, padding: '1px 6px', fontSize: '0.625rem' }} onClick={() => moveChild(idx, -1)}>←</button>
                  <button type="button" style={{ ...smallBtn, padding: '1px 6px', fontSize: '0.625rem' }} onClick={() => moveChild(idx, 1)}>→</button>
                </div>
              )}
              {child.type === 'card' ? (
                <CardEditor card={child} onChange={(c) => updateChild(idx, c)} onRemove={() => removeChild(idx)} />
              ) : child.type === 'arrow' ? (
                <InlineArrowEditor arrow={child} onChange={(a) => updateChild(idx, a)} onRemove={() => removeChild(idx)} />
              ) : child.type === 'section' ? (
                <SectionEditor section={child} onChange={(s) => updateChild(idx, s)} onRemove={() => removeChild(idx)} depth={depth + 1} />
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {section.children.map((child, idx) => (
            <div key={child.id || idx}>
              {idx > 0 && <InsertBetweenButton onInsert={(type) => insertChildAt(idx, type)} />}
              <div style={{ position: 'relative' }}>
                {section.children.length > 1 && child.type !== 'arrow' && (
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '4px', justifyContent: 'center' }}>
                    <button type="button" style={{ ...smallBtn, padding: '1px 6px', fontSize: '0.625rem' }} onClick={() => moveChild(idx, -1)}>↑</button>
                    <button type="button" style={{ ...smallBtn, padding: '1px 6px', fontSize: '0.625rem' }} onClick={() => moveChild(idx, 1)}>↓</button>
                  </div>
                )}
                {child.type === 'card' ? (
                  <CardEditor card={child} onChange={(c) => updateChild(idx, c)} onRemove={() => removeChild(idx)} />
                ) : child.type === 'arrow' ? (
                  <InlineArrowEditor arrow={child} onChange={(a) => updateChild(idx, a)} onRemove={() => removeChild(idx)} />
                ) : child.type === 'section' ? (
                  <SectionEditor section={child} onChange={(s) => updateChild(idx, s)} onRemove={() => removeChild(idx)} depth={depth + 1} />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

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

function InsertBetweenButton({ onInsert }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4px 0',
      position: 'relative',
    }}>
      <div style={{ flex: 1, height: '1px', background: 'var(--color-border)', opacity: 0.5 }} />
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          cursor: 'pointer',
          fontSize: '16px',
          lineHeight: 1,
          color: 'var(--color-text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          padding: 0,
          opacity: open ? 1 : 0.5,
          transition: 'opacity 150ms ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
        onMouseLeave={(e) => { if (!open) e.currentTarget.style.opacity = '0.5' }}
      >
        +
      </button>
      <div style={{ flex: 1, height: '1px', background: 'var(--color-border)', opacity: 0.5 }} />
      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          zIndex: 10,
          display: 'flex',
          gap: '4px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          padding: '4px 6px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        }}>
          <button type="button" style={smallBtn} onClick={() => { onInsert('arrow'); setOpen(false) }}>↓ Стрелка</button>
          <button type="button" style={smallBtn} onClick={() => { onInsert('card'); setOpen(false) }}>Карточка</button>
          <button type="button" style={smallBtn} onClick={() => { onInsert('section'); setOpen(false) }}>Секция</button>
        </div>
      )}
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

  function insertAt(idx, type) {
    const creators = { arrow: emptyArrow, card: emptyCard, section: emptySection }
    const next = [...data.elements]
    next.splice(idx, 0, (creators[type] || emptyCard)())
    setElements(next)
  }

  function addSection() {
    setElements([...data.elements, emptySection()])
  }

  function addCard() {
    setElements([...data.elements, emptyCard()])
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {data.elements.map((el, idx) => {
              const item = el.type === 'section' ? (
                <SectionEditor key={el.id || idx} section={el} onChange={(s) => updateEl(idx, s)} onRemove={() => removeEl(idx)} />
              ) : el.type === 'arrow' ? (
                <ArrowEditor key={el.id || idx} arrow={el} onChange={(a) => updateEl(idx, a)} onRemove={() => removeEl(idx)} />
              ) : el.type === 'card' ? (
                <CardEditor key={el.id || idx} card={el} onChange={(c) => updateEl(idx, c)} onRemove={() => removeEl(idx)} />
              ) : null

              return (
                <div key={el.id || idx}>
                  {idx > 0 && <InsertBetweenButton onInsert={(type) => insertAt(idx, type)} />}
                  {item}
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
            <button type="button" style={smallBtn} onClick={addSection}>+ Секция</button>
            <button type="button" style={smallBtn} onClick={addCard}>+ Карточка</button>
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

/* ===== Preview (portal + editor preview mode) ===== */

export function SchemaPreview({ elements }) {
  if (!elements?.length) return null

  return (
    <div className="block-schema">
      {elements.map((el, idx) => {
        if (el.type === 'section') return <SectionPreview key={el.id || idx} section={el} />
        if (el.type === 'arrow') return <ArrowPreview key={el.id || idx} arrow={el} />
        if (el.type === 'card') return <CardPreview key={el.id || idx} card={el} />
        return null
      })}
    </div>
  )
}

function SectionPreview({ section }) {
  const isHorizontal = section.layout === 'horizontal'
  const isCompact = isHorizontal && section.stretch === false
  const width = section.width || '100'

  const sectionStyle = { width: `${width}%` }

  const children = section.children || []
  const childCount = children.length
  const gap = 12
  const equalWidth = childCount > 1
    ? `calc(${100 / childCount}% - ${(childCount - 1) * gap / childCount}px)`
    : '100%'

  return (
    <div className="block-schema__section" style={sectionStyle}>
      {section.title && <div className="block-schema__section-title">{section.title}</div>}
      {isHorizontal ? (
        <div style={{ display: 'flex', flexDirection: 'row', gap: `${gap}px`, alignItems: 'flex-start' }}>
          {children.map((child, idx) => {
            const item = child.type === 'card' ? <CardPreview key={child.id || idx} card={child} stretch />
              : child.type === 'arrow' ? <ArrowPreview key={child.id || idx} arrow={child} />
              : child.type === 'section' ? <SectionPreview key={child.id || idx} section={child} />
              : null
            return (
              <div key={child.id || idx} style={{ width: equalWidth, flexShrink: 0, minWidth: 0 }}>
                {item}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="block-schema__children">
          {children.map((child, idx) => {
            if (child.type === 'card') return <CardPreview key={child.id || idx} card={child} />
            if (child.type === 'arrow') return <ArrowPreview key={child.id || idx} arrow={child} />
            if (child.type === 'section') return <SectionPreview key={child.id || idx} section={child} />
            return null
          })}
        </div>
      )}
    </div>
  )
}

function useTooltipSide(cardRef) {
  const [side, setSide] = useState('right')

  const update = useCallback(() => {
    const el = cardRef.current
    if (!el) return
    const schema = el.closest('.block-schema')
    if (!schema) return
    const schemaRect = schema.getBoundingClientRect()
    const cardRect = el.getBoundingClientRect()
    const cardCenter = cardRect.left + cardRect.width / 2
    const third = schemaRect.width / 3
    const rel = cardCenter - schemaRect.left
    setSide(rel < schemaRect.width / 2 ? 'left' : 'right')
  }, [cardRef])

  return { side, update }
}

function CardTooltip({ card, side }) {
  if (!card.tooltip) return null
  const isLeft = side === 'left'

  const pos = isLeft
    ? { right: 'calc(100% + 12px)', top: '50%', transform: 'translateY(-50%)' }
    : { left: 'calc(100% + 12px)', top: '50%', transform: 'translateY(-50%)' }

  return (
    <div className="block-schema__tooltip" style={pos}>
      {card.text && <div className="block-schema__tooltip-title">{card.text}</div>}
      <div className="block-schema__tooltip-desc">{card.tooltip}</div>
    </div>
  )
}

function CardPreview({ card, stretch }) {
  const st = card.style || 'icon'
  const pal = PALETTE[card.color] || PALETTE.coral
  const cardWidth = card.width || 'auto'
  const isFilled = !!card.filled
  const hasTooltip = !!card.tooltip

  const cardRef = useRef(null)
  const { side, update } = useTooltipSide(cardRef)

  const wrapStyle = {}
  if (cardWidth !== 'auto') {
    wrapStyle.width = `${cardWidth}%`
    wrapStyle.flexBasis = `${cardWidth}%`
    wrapStyle.flexGrow = 0
    wrapStyle.flexShrink = 0
  }

  const isPastel = !!pal.pastel
  const filledBg = isFilled ? pal.solid : undefined
  const filledText = isFilled ? (isPastel ? pal.text : 'white') : undefined
  const filledStyle = isFilled ? { background: filledBg, color: filledText } : {}
  const subtextStyle = isFilled
    ? (isPastel ? { color: pal.text, opacity: 0.7 } : { color: 'white', opacity: 0.8 })
    : {}

  const wrapperClass = hasTooltip ? 'block-schema__card-wrap block-schema__card-wrap--has-tooltip' : 'block-schema__card-wrap'

  let inner
  if (st === 'pill') {
    inner = (
      <div className="block-schema__card block-schema__card--pill" style={filledStyle}>
        {!isFilled && <span className="block-schema__pill-dot" style={{ background: pal.solid }} />}
        <div>
          {card.text && <span className="block-schema__card-text">{card.text}</span>}
          {card.subtext && <div className="block-schema__card-subtext" style={subtextStyle}>{card.subtext}</div>}
        </div>
      </div>
    )
  } else if (st === 'stripe') {
    inner = (
      <div className="block-schema__card block-schema__card--stripe" style={isFilled ? { borderLeftColor: filledBg, ...filledStyle } : { borderLeftColor: pal.solid }}>
        <div>
          {card.text && <div className="block-schema__card-text">{card.text}</div>}
          {card.subtext && <div className="block-schema__card-subtext" style={subtextStyle}>{card.subtext}</div>}
        </div>
      </div>
    )
  } else if (st === 'image') {
    inner = (
      <div className="block-schema__card block-schema__card--image" style={filledStyle}>
        <div className="block-schema__card-img">
          {card.imageUrl ? (
            <img src={card.imageUrl} alt="" />
          ) : (
            <span className="block-schema__card-img-empty">+</span>
          )}
        </div>
        <div>
          {card.text && <div className="block-schema__card-text">{card.text}</div>}
          {card.subtext && <div className="block-schema__card-subtext" style={subtextStyle}>{card.subtext}</div>}
        </div>
      </div>
    )
  } else {
    const iconBg = isFilled ? (isPastel ? pal.text : 'rgba(255,255,255,0.2)') : pal.solid
    inner = (
      <div className="block-schema__card block-schema__card--icon" style={isFilled ? { background: filledBg, color: filledText } : { background: 'var(--color-surface)', color: pal.text }}>
        <div className="block-schema__icon-box" style={{ background: iconBg }}>
          <SvgIcon name={card.svgIcon || 'server'} size={16} color="white" />
        </div>
        <div>
          {card.text && <div className="block-schema__card-text">{card.text}</div>}
          {card.subtext && <div className="block-schema__card-subtext" style={subtextStyle}>{card.subtext}</div>}
        </div>
      </div>
    )
  }

  const wrapperStyle = stretch ? { width: '100%' } : undefined

  const result = (
    <div className={wrapperClass} ref={cardRef} onMouseEnter={hasTooltip ? update : undefined} style={wrapperStyle}>
      {inner}
      {hasTooltip && <CardTooltip card={card} side={side} />}
    </div>
  )

  if (cardWidth !== 'auto') {
    return <div className="block-schema__card-sized" style={wrapStyle}>{result}</div>
  }
  return result
}

function ArrowPreview({ arrow }) {
  return <div className="block-schema__arrow">{arrow.direction || '↓'}</div>
}

/* ===== TipTap Extension ===== */

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
