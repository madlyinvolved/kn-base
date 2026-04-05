'use client'

import { useState } from 'react'
import { createClient } from '../../lib/supabase/client.js'

const toolbarStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2px',
  padding: '8px 12px',
  borderBottom: '1px solid var(--color-border)',
  background: 'var(--color-bg)',
}

const btnBase = {
  padding: '6px 10px',
  fontSize: '0.8125rem',
  fontFamily: 'var(--font-body)',
  background: 'transparent',
  border: '1px solid transparent',
  borderRadius: '6px',
  cursor: 'pointer',
  color: 'var(--color-text)',
  transition: 'all var(--transition-fast)',
  minWidth: '32px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const activeBtn = {
  ...btnBase,
  background: 'var(--color-accent)',
  color: 'white',
}

const separatorStyle = {
  width: '1px',
  height: '24px',
  background: 'var(--color-border)',
  margin: '0 4px',
  alignSelf: 'center',
}

export default function EditorToolbar({ editor }) {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showVideoInput, setShowVideoInput] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')

  if (!editor) return null

  function btn(label, action, isActive) {
    return (
      <button
        type="button"
        style={isActive ? activeBtn : btnBase}
        onClick={action}
        title={label}
      >
        {label}
      </button>
    )
  }

  function handleInsertImage() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = e.target.files?.[0]
      if (!file) return

      const supabase = createClient()
      const fileName = `${Date.now()}-${file.name}`
      const filePath = `articles/${fileName}`

      const { error } = await supabase.storage
        .from('media')
        .upload(filePath, file)

      if (error) {
        // Fallback: read as base64
        const reader = new FileReader()
        reader.onload = () => {
          editor.chain().focus().setImage({ src: reader.result }).run()
        }
        reader.readAsDataURL(file)
        return
      }

      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath)

      editor.chain().focus().setImage({ src: urlData.publicUrl }).run()
    }
    input.click()
  }

  function handleInsertImageUrl() {
    const url = prompt('URL изображения:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  function handleSetLink() {
    if (showLinkInput) {
      if (linkUrl) {
        editor.chain().focus().setLink({ href: linkUrl }).run()
      }
      setShowLinkInput(false)
      setLinkUrl('')
    } else {
      setShowLinkInput(true)
    }
  }

  function handleInsertVideo() {
    if (showVideoInput) {
      if (videoUrl) {
        editor.commands.setYoutubeVideo({ src: videoUrl })
      }
      setShowVideoInput(false)
      setVideoUrl('')
    } else {
      setShowVideoInput(true)
    }
  }

  function handleInsertTable() {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  return (
    <div>
      <div style={toolbarStyle}>
        {btn('B', () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'))}
        {btn('I', () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'))}
        {btn('U', () => editor.chain().focus().toggleUnderline().run(), editor.isActive('underline'))}
        {btn('S', () => editor.chain().focus().toggleStrike().run(), editor.isActive('strike'))}

        <span style={separatorStyle} />

        {btn('H2', () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 }))}
        {btn('H3', () => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive('heading', { level: 3 }))}

        <span style={separatorStyle} />

        {btn('•', () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'))}
        {btn('1.', () => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'))}
        {btn('❝', () => editor.chain().focus().toggleBlockquote().run(), editor.isActive('blockquote'))}
        {btn('—', () => editor.chain().focus().setHorizontalRule().run(), false)}
        {btn('</>', () => editor.chain().focus().toggleCodeBlock().run(), editor.isActive('codeBlock'))}

        <span style={separatorStyle} />

        {btn('🔗', handleSetLink, editor.isActive('link'))}
        {editor.isActive('link') &&
          btn('✂️', () => editor.chain().focus().unsetLink().run(), false)}

        <span style={separatorStyle} />

        {btn('🖼️', handleInsertImage, false)}
        {btn('🌐', handleInsertImageUrl, false)}
        {btn('▶️', handleInsertVideo, false)}
        {btn('📊', handleInsertTable, false)}
      </div>

      {showLinkInput && (
        <div style={{ ...toolbarStyle, gap: '8px' }}>
          <input
            type="url"
            placeholder="https://..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            style={{
              flex: 1,
              padding: '6px 10px',
              fontSize: '0.8125rem',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              outline: 'none',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSetLink()
            }}
            autoFocus
          />
          <button type="button" style={btnBase} onClick={handleSetLink}>
            Вставить
          </button>
          <button
            type="button"
            style={btnBase}
            onClick={() => {
              setShowLinkInput(false)
              setLinkUrl('')
            }}
          >
            Отмена
          </button>
        </div>
      )}

      {showVideoInput && (
        <div style={{ ...toolbarStyle, gap: '8px' }}>
          <input
            type="url"
            placeholder="YouTube или Vimeo URL..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            style={{
              flex: 1,
              padding: '6px 10px',
              fontSize: '0.8125rem',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              outline: 'none',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleInsertVideo()
            }}
            autoFocus
          />
          <button type="button" style={btnBase} onClick={handleInsertVideo}>
            Вставить
          </button>
          <button
            type="button"
            style={btnBase}
            onClick={() => {
              setShowVideoInput(false)
              setVideoUrl('')
            }}
          >
            Отмена
          </button>
        </div>
      )}
    </div>
  )
}
