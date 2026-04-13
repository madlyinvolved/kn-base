'use client'

import { Image as TiptapImage } from '@tiptap/extension-image'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { useRef, useState } from 'react'
import { uploadImageToStorage } from '../../lib/utils/uploadImage.js'

const SIZE_PRESETS = [25, 50, 75, 100]

function ImageNodeView({ node, updateAttributes, deleteNode, selected, editor }) {
  const { src, alt, width, align, caption, wrap } = node.attrs
  const [replacing, setReplacing] = useState(false)
  const [customWidth, setCustomWidth] = useState(String(width || 100))
  const replaceRef = useRef(null)

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
    width: `${width || 100}%`,
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '8px',
    display: 'inline-block',
    outline: selected ? '2px solid var(--color-accent)' : 'none',
    outlineOffset: '2px',
    cursor: 'default',
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

  return (
    <NodeViewWrapper as="figure" style={figureAlign} data-image-node draggable={false}>
      <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
        <img src={src} alt={alt || caption || ''} style={imgStyle} draggable={false} />

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
              textAlign: 'center',
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
          textAlign: 'center',
          marginTop: '6px',
          outline: 'none',
          minHeight: '1.2em',
          cursor: editor.isEditable ? 'text' : 'default',
        }}
      >
        {caption || ''}
      </figcaption>
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
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView)
  },
})
