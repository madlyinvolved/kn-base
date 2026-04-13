'use client'

import { Image as TiptapImage } from '@tiptap/extension-image'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { useRef, useState } from 'react'
import { uploadImageToStorage } from '../../lib/utils/uploadImage.js'

/**
 * ImageNodeView — floating dark toolbar + inline-editable caption.
 * Shown whenever the image node is selected in the editor.
 */
function ImageNodeView({ node, updateAttributes, deleteNode, selected, editor }) {
  const { src, alt, width, align, caption, wrap } = node.attrs
  const [replacing, setReplacing] = useState(false)
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

  const toolbarStyle = {
    position: 'absolute',
    top: '-44px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: selected ? 'inline-flex' : 'none',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 8px',
    background: '#1a1a1a',
    color: 'white',
    borderRadius: '8px',
    boxShadow: 'var(--shadow-md)',
    whiteSpace: 'nowrap',
    zIndex: 30,
    fontSize: '0.75rem',
  }

  const iconBtn = {
    background: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.8125rem',
    lineHeight: 1,
  }

  const activeIconBtn = {
    ...iconBtn,
    background: 'var(--color-accent)',
  }

  const sep = {
    width: '1px',
    height: '18px',
    background: '#444',
    margin: '0 2px',
  }

  function updateCaption(e) {
    const text = e.target.innerText.trim()
    updateAttributes({ caption: text || null })
  }

  return (
    <NodeViewWrapper as="figure" style={figureAlign} data-image-node>
      <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
        <img src={src} alt={alt || caption || ''} style={imgStyle} />

        <div style={toolbarStyle} contentEditable={false}>
          <button
            type="button"
            style={align === 'left' ? activeIconBtn : iconBtn}
            onClick={() => updateAttributes({ align: 'left' })}
            title="По левому краю"
          >
            ⇤
          </button>
          <button
            type="button"
            style={align === 'center' ? activeIconBtn : iconBtn}
            onClick={() => updateAttributes({ align: 'center' })}
            title="По центру"
          >
            ⇔
          </button>
          <button
            type="button"
            style={align === 'right' ? activeIconBtn : iconBtn}
            onClick={() => updateAttributes({ align: 'right' })}
            title="По правому краю"
          >
            ⇥
          </button>

          <span style={sep} />

          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0 6px' }}>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={width || 100}
              onChange={(e) => updateAttributes({ width: Number(e.target.value) })}
              style={{ width: '80px', accentColor: 'var(--color-accent)' }}
              title="Ширина"
            />
            <span style={{ minWidth: '32px', textAlign: 'right' }}>{width || 100}%</span>
          </label>

          <span style={sep} />

          <button
            type="button"
            style={wrap ? activeIconBtn : iconBtn}
            onClick={() => updateAttributes({ wrap: !wrap })}
            title="Обтекание текстом"
          >
            ⇄
          </button>

          <span style={sep} />

          <button
            type="button"
            style={iconBtn}
            onClick={() => replaceRef.current?.click()}
            title="Заменить"
            disabled={replacing}
          >
            {replacing ? '…' : '↻'}
          </button>
          <input
            ref={replaceRef}
            type="file"
            accept="image/*"
            onChange={handleReplace}
            style={{ display: 'none' }}
          />

          <button
            type="button"
            style={iconBtn}
            onClick={() => deleteNode()}
            title="Удалить"
          >
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
  draggable: true,
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
