'use client'

import { Image as TiptapImage } from '@tiptap/extension-image'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { useRef, useState, useCallback, useEffect } from 'react'
import { uploadImageToStorage } from '../../lib/utils/uploadImage.js'

const SIZE_PRESETS = [25, 50, 75, 100]

const hsInputStyle = {
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

function ImageNodeView({ node, updateAttributes, deleteNode, selected, editor }) {
  const { src, alt, width, align, caption, wrap, hotspots: savedHotspots } = node.attrs
  const hotspots = savedHotspots || []
  const [replacing, setReplacing] = useState(false)
  const [customWidth, setCustomWidth] = useState(String(width || 100))
  const replaceRef = useRef(null)
  const [hsMode, setHsMode] = useState(false)
  const [editIdx, setEditIdx] = useState(null)
  const [dragIdx, setDragIdx] = useState(null)
  const imgContainerRef = useRef(null)

  const figureAlign = {
    margin: '1em 0',
    display: 'block',
    textAlign: align === 'center' ? 'center' : align === 'right' ? 'right' : 'left',
    float: wrap ? (align === 'right' ? 'right' : 'left') : 'none',
    maxWidth: wrap ? '50%' : '100%',
    marginLeft: wrap && align === 'right' ? '16px' : wrap ? 0 : undefined,
    marginRight: wrap && align === 'left' ? '16px' : wrap ? 0 : undefined,
    position: 'relative',
  }

  const imgStyle = {
    width: '100%',
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '8px',
    display: 'block',
    outline: selected ? '2px solid var(--color-accent)' : 'none',
    outlineOffset: '2px',
    cursor: 'default',
    background: 'transparent',
  }

  async function handleReplace(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setReplacing(true)
    const url = await uploadImageToStorage(file)
    setReplacing(false)
    if (url) {
      updateAttributes({ src: url })
    }
  }

  function setWidth(w) {
    const clamped = Math.max(10, Math.min(100, Number(w) || 100))
    updateAttributes({ width: clamped })
    setCustomWidth(String(clamped))
  }

  function handleCustomWidthChange(e) {
    setCustomWidth(e.target.value)
  }

  function handleCustomWidthCommit() {
    setWidth(customWidth)
  }

  const toolbarStyle = {
    position: 'absolute',
    top: '-44px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: selected ? 'inline-flex' : 'none',
    alignItems: 'center',
    gap: '3px',
    padding: '5px 8px',
    background: '#1a1a1a',
    color: 'white',
    borderRadius: '8px',
    boxShadow: 'var(--shadow-md)',
    whiteSpace: 'nowrap',
    zIndex: 30,
    fontSize: '0.6875rem',
  }

  const btn = {
    background: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '3px 7px',
    borderRadius: '4px',
    fontSize: '0.6875rem',
    lineHeight: 1,
  }

  const btnActive = {
    ...btn,
    background: 'var(--color-accent)',
  }

  const sep = {
    width: '1px',
    height: '16px',
    background: '#444',
    margin: '0 2px',
    flexShrink: 0,
  }

  function updateCaption(e) {
    const text = e.target.innerText.trim()
    updateAttributes({ caption: text || null })
  }

  function hsUpdate(next) {
    updateAttributes({ hotspots: next })
  }

  function hsAdd(e) {
    if (!hsMode) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1000) / 10
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 1000) / 10
    const next = [...hotspots, { x, y, title: '', description: '' }]
    hsUpdate(next)
    setEditIdx(next.length - 1)
  }

  function hsRemove(idx) {
    hsUpdate(hotspots.filter((_, i) => i !== idx))
    if (editIdx === idx) setEditIdx(null)
    else if (editIdx > idx) setEditIdx(editIdx - 1)
  }

  function hsEditField(idx, field, value) {
    const next = hotspots.map((h, i) => (i === idx ? { ...h, [field]: value } : h))
    hsUpdate(next)
  }

  const handleDragStart = useCallback((idx, e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragIdx(idx)
  }, [])

  useEffect(() => {
    if (dragIdx === null) return
    function onMove(e) {
      const container = imgContainerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const x = Math.min(100, Math.max(0, Math.round(((e.clientX - rect.left) / rect.width) * 1000) / 10))
      const y = Math.min(100, Math.max(0, Math.round(((e.clientY - rect.top) / rect.height) * 1000) / 10))
      const next = hotspots.map((h, i) => (i === dragIdx ? { ...h, x, y } : h))
      hsUpdate(next)
    }
    function onUp() {
      setDragIdx(null)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [dragIdx, hotspots]) // eslint-disable-line react-hooks/exhaustive-deps

  const cursorStyle = hsMode ? { ...imgStyle, cursor: 'crosshair' } : imgStyle

  return (
    <NodeViewWrapper as="figure" style={figureAlign} data-image-node draggable={false}>
      <div
        ref={imgContainerRef}
        style={{ position: 'relative', display: 'inline-block', width: `${width || 100}%`, maxWidth: '100%' }}
        contentEditable={false}
      >
        <img
          src={src}
          alt={alt || caption || ''}
          style={cursorStyle}
          draggable={false}
          onClick={hsMode ? hsAdd : undefined}
        />

        {/* Hotspot dots (always visible when they exist) */}
        {hotspots.map((h, idx) => (
          <div
            key={idx}
            className="hotspot-dot"
            style={{ left: `${h.x}%`, top: `${h.y}%`, cursor: hsMode ? 'grab' : 'default', animation: hsMode ? 'none' : undefined }}
            onMouseDown={hsMode ? (e) => handleDragStart(idx, e) : undefined}
            onClick={(e) => { e.stopPropagation(); if (hsMode) setEditIdx(idx) }}
          >
            {idx + 1}
            {hsMode && (
              <button
                type="button"
                className="hotspot-dot__delete"
                onClick={(e) => { e.stopPropagation(); hsRemove(idx) }}
              >
                ✕
              </button>
            )}
          </div>
        ))}

        {/* Hotspot mode hint */}
        {hsMode && (
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '8px',
              padding: '4px 10px',
              background: 'rgba(0,0,0,0.7)',
              borderRadius: '6px',
              zIndex: 20,
              fontSize: '11px',
              color: 'white',
            }}
          >
            Кликните на фото чтобы добавить точку
          </div>
        )}

        <div style={toolbarStyle} contentEditable={false}>
          {/* Alignment */}
          <button type="button" style={align === 'left' ? btnActive : btn} onClick={() => updateAttributes({ align: 'left' })} title="По левому краю">
            ⇤
          </button>
          <button type="button" style={align === 'center' ? btnActive : btn} onClick={() => updateAttributes({ align: 'center' })} title="По центру">
            ⇔
          </button>
          <button type="button" style={align === 'right' ? btnActive : btn} onClick={() => updateAttributes({ align: 'right' })} title="По правому краю">
            ⇥
          </button>

          <span style={sep} />

          {/* Size presets */}
          {SIZE_PRESETS.map((s) => (
            <button
              key={s}
              type="button"
              style={(width || 100) === s ? btnActive : btn}
              onClick={() => setWidth(s)}
              title={`${s}%`}
            >
              {s}%
            </button>
          ))}
          <input
            type="number"
            min="10"
            max="100"
            value={customWidth}
            onChange={handleCustomWidthChange}
            onBlur={handleCustomWidthCommit}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCustomWidthCommit() }}
            style={{
              width: '38px',
              padding: '2px 4px',
              fontSize: '0.6875rem',
              background: '#333',
              border: '1px solid #555',
              borderRadius: '4px',
              color: 'white',
              textAlign: align || 'center',
              outline: 'none',
            }}
            title="Произвольная ширина %"
          />

          <span style={sep} />

          {/* Wrap */}
          <button type="button" style={wrap ? btnActive : btn} onClick={() => updateAttributes({ wrap: !wrap })} title="Обтекание текстом">
            ⇄
          </button>

          <span style={sep} />

          {/* Hotspots */}
          <button type="button" style={hsMode ? btnActive : btn} onClick={() => { setHsMode(!hsMode); setEditIdx(null) }} title="Точки на фото">
            ●
          </button>

          <span style={sep} />

          {/* Replace */}
          <button type="button" style={btn} onClick={() => replaceRef.current?.click()} title="Заменить" disabled={replacing}>
            {replacing ? '…' : '↻'}
          </button>
          <input ref={replaceRef} type="file" accept="image/*" onChange={handleReplace} style={{ display: 'none' }} />

          {/* Delete */}
          <button type="button" style={btn} onClick={() => deleteNode()} title="Удалить">
            ✕
          </button>
        </div>
      </div>

      <figcaption
        contentEditable={editor.isEditable}
        suppressContentEditableWarning
        onBlur={updateCaption}
        data-placeholder="Подпись к изображению..."
        style={{
          fontSize: '0.8125rem',
          color: 'var(--color-text-secondary)',
          fontStyle: 'italic',
          textAlign: align || 'center',
          marginTop: '6px',
          outline: 'none',
          minHeight: '1.2em',
          cursor: editor.isEditable ? 'text' : 'default',
        }}
      >
        {caption || ''}
      </figcaption>

      {/* Hotspot edit panel — below image */}
      {hsMode && (
        <div
          contentEditable={false}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '12px',
            marginTop: '8px',
            fontSize: '0.875rem',
          }}
        >
          {/* Tab row */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', marginBottom: hotspots.length > 0 ? '12px' : 0 }}>
            {hotspots.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setEditIdx(editIdx === idx ? null : idx)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: editIdx === idx ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                  background: editIdx === idx ? 'var(--color-accent)' : 'var(--color-surface)',
                  color: editIdx === idx ? 'white' : 'var(--color-text)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                }}
              >
                {idx + 1}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <button
              type="button"
              onClick={() => { setHsMode(false); setEditIdx(null) }}
              style={{
                background: 'var(--color-accent)',
                border: 'none',
                color: 'white',
                padding: '5px 14px',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Готово
            </button>
          </div>

          {/* Active hotspot fields */}
          {editIdx !== null && hotspots[editIdx] && (
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div className="hotspot-panel__number">{editIdx + 1}</div>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                  Точка {editIdx + 1}
                </span>
              </div>
              <input
                style={hsInputStyle}
                placeholder="Заголовок"
                value={hotspots[editIdx].title}
                onChange={(e) => hsEditField(editIdx, 'title', e.target.value)}
              />
              <textarea
                style={{ ...hsInputStyle, resize: 'vertical', minHeight: '60px', lineHeight: 1.4 }}
                placeholder="Описание"
                value={hotspots[editIdx].description}
                onChange={(e) => hsEditField(editIdx, 'description', e.target.value)}
                rows={3}
              />
              <button
                type="button"
                onClick={() => hsRemove(editIdx)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#e53e3e',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  padding: '4px 0',
                  marginTop: '2px',
                }}
              >
                Удалить точку
              </button>
            </div>
          )}
        </div>
      )}
    </NodeViewWrapper>
  )
}

export const CustomImage = TiptapImage.extend({
  name: 'image',
  draggable: false,
  selectable: true,

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: 100,
        parseHTML: (el) => {
          const w = el.getAttribute('data-width')
          return w ? Number(w) : 100
        },
        renderHTML: (attrs) => ({ 'data-width': attrs.width }),
      },
      align: {
        default: 'center',
        parseHTML: (el) => el.getAttribute('data-align') || 'center',
        renderHTML: (attrs) => ({ 'data-align': attrs.align }),
      },
      caption: {
        default: null,
        parseHTML: (el) => el.getAttribute('data-caption') || null,
        renderHTML: (attrs) => (attrs.caption ? { 'data-caption': attrs.caption } : {}),
      },
      wrap: {
        default: false,
        parseHTML: (el) => el.getAttribute('data-wrap') === 'true',
        renderHTML: (attrs) => (attrs.wrap ? { 'data-wrap': 'true' } : {}),
      },
      hotspots: {
        default: [],
        parseHTML: (el) => {
          try { return JSON.parse(el.getAttribute('data-hotspots') || '[]') } catch { return [] }
        },
        renderHTML: (attrs) => {
          if (!attrs.hotspots?.length) return {}
          return { 'data-hotspots': JSON.stringify(attrs.hotspots) }
        },
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView)
  },
})
