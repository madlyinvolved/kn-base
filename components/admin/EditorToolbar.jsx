'use client'

import { useState } from 'react'
import { uploadImageToStorage } from '../../lib/utils/uploadImage.js'

const toolbarStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2px',
  padding: '8px 12px',
  borderBottom: '1px solid var(--color-border)',
  background: 'var(--color-bg)',
  borderRadius: '12px 12px 0 0',
  position: 'sticky',
  top: 72,
  zIndex: 20,
}

const btnStyle = {
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

const btnActive = {
  ...btnStyle,
  background: 'var(--color-accent)',
  color: 'white',
}

const sep = (
  <span
    style={{
      width: '1px',
      height: '20px',
      background: 'var(--color-border)',
      margin: '0 6px',
      alignSelf: 'center',
      flexShrink: 0,
    }}
  />
)

export default function EditorToolbar({ editor }) {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showVideoInput, setShowVideoInput] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [showTableDialog, setShowTableDialog] = useState(false)
  const [tableRows, setTableRows] = useState(3)
  const [tableCols, setTableCols] = useState(3)
  const [uploadingImage, setUploadingImage] = useState(false)

  if (!editor) return null

  function btn(label, action, isActive, title) {
    return (
      <button
        type="button"
        style={isActive ? btnActive : btnStyle}
        onClick={action}
        title={title || label}
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
      setUploadingImage(true)
      const url = await uploadImageToStorage(file)
      setUploadingImage(false)
      if (url) {
        editor
          .chain()
          .focus()
          .setImage({ src: url, align: 'center', width: 100 })
          .run()
      } else {
        alert('Не удалось загрузить изображение. Проверьте подключение или размер файла.')
      }
    }
    input.click()
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

  function confirmInsertTable() {
    const rows = Math.max(1, Math.min(20, Number(tableRows) || 1))
    const cols = Math.max(1, Math.min(10, Number(tableCols) || 1))
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
    setShowTableDialog(false)
  }

  const inlineInputStyle = {
    flex: 1,
    padding: '6px 10px',
    fontSize: '0.8125rem',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    outline: 'none',
  }

  return (
    <div>
      <div style={toolbarStyle}>
        {/* Group 1: Text formatting */}
        {btn('B', () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'), 'Жирный')}
        {btn('I', () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'), 'Курсив')}
        {btn('U', () => editor.chain().focus().toggleUnderline().run(), editor.isActive('underline'), 'Подчёркнутый')}
        {btn('S', () => editor.chain().focus().toggleStrike().run(), editor.isActive('strike'), 'Зачёркнутый')}

        {sep}

        {/* Group 2: Headings */}
        {btn('H2', () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 }), 'Заголовок 2')}
        {btn('H3', () => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive('heading', { level: 3 }), 'Заголовок 3')}

        {sep}

        {/* Group 3: Lists, quote, rule, code */}
        {btn('•', () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'), 'Маркированный список')}
        {btn('1.', () => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'), 'Нумерованный список')}
        {btn('❝', () => editor.chain().focus().toggleBlockquote().run(), editor.isActive('blockquote'), 'Цитата')}
        {btn('—', () => editor.chain().focus().setHorizontalRule().run(), false, 'Разделитель')}
        {btn('</>', () => editor.chain().focus().toggleCodeBlock().run(), editor.isActive('codeBlock'), 'Код')}

        {sep}

        {/* Group 4: Link, photo, video */}
        {btn('🔗', handleSetLink, editor.isActive('link'), 'Ссылка')}
        {editor.isActive('link') &&
          btn('✂️', () => editor.chain().focus().unsetLink().run(), false, 'Убрать ссылку')}
        <button
          type="button"
          style={btnStyle}
          onClick={handleInsertImage}
          disabled={uploadingImage}
          title="Загрузить фото"
        >
          {uploadingImage ? '…' : '↑Фото'}
        </button>
        {btn('Видео', handleInsertVideo, false, 'Вставить видео')}

        {sep}

        {/* Group 5: Table, contacts */}
        {btn('Таблица', () => setShowTableDialog(true), false, 'Вставить таблицу')}
        {btn('Контакты', () => editor.chain().focus().insertContent({ type: 'contactCards' }).run(), false, 'Карточка контактов')}
      </div>

      {showLinkInput && (
        <div style={{ ...toolbarStyle, gap: '8px', borderRadius: 0 }}>
          <input
            type="url"
            placeholder="https://..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            style={inlineInputStyle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSetLink()
            }}
            autoFocus
          />
          <button type="button" style={btnStyle} onClick={handleSetLink}>
            Вставить
          </button>
          <button
            type="button"
            style={btnStyle}
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
        <div style={{ ...toolbarStyle, gap: '8px', borderRadius: 0 }}>
          <input
            type="url"
            placeholder="YouTube или Vimeo URL..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            style={inlineInputStyle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleInsertVideo()
            }}
            autoFocus
          />
          <button type="button" style={btnStyle} onClick={handleInsertVideo}>
            Вставить
          </button>
          <button
            type="button"
            style={btnStyle}
            onClick={() => {
              setShowVideoInput(false)
              setVideoUrl('')
            }}
          >
            Отмена
          </button>
        </div>
      )}

      {showTableDialog && (
        <div className="editor-modal-overlay" onClick={() => setShowTableDialog(false)}>
          <div className="editor-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Вставить таблицу</h3>
            <div className="editor-modal-row">
              <label htmlFor="table-rows">Строки</label>
              <input
                id="table-rows"
                type="number"
                min="1"
                max="20"
                value={tableRows}
                onChange={(e) => setTableRows(e.target.value)}
              />
            </div>
            <div className="editor-modal-row">
              <label htmlFor="table-cols">Столбцы</label>
              <input
                id="table-cols"
                type="number"
                min="1"
                max="10"
                value={tableCols}
                onChange={(e) => setTableCols(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                type="button"
                className="editor-btn-outline"
                onClick={() => setShowTableDialog(false)}
              >
                Отмена
              </button>
              <button
                type="button"
                className="editor-btn-primary"
                onClick={confirmInsertTable}
              >
                Вставить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
