'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Link } from '@tiptap/extension-link'
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table'
import { Youtube } from '@tiptap/extension-youtube'
import { Placeholder } from '@tiptap/extension-placeholder'
import EditorToolbar from './EditorToolbar.jsx'
import { CustomImage } from './ImageNode.jsx'
import { ContactCards } from './ContactCardsNode.jsx'
import { uploadImageToStorage } from '../../lib/utils/uploadImage.js'
import { useState } from 'react'

const editorWrapperStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: '12px',
  transition: 'border-color 150ms ease',
}

function emitUpdate(editor, onUpdate) {
  onUpdate({
    json: editor.getJSON(),
    text: editor.getText(),
    html: editor.getHTML(),
  })
}

async function insertUploadedImages(editor, files, position) {
  const images = Array.from(files).filter((f) => f.type.startsWith('image/'))
  if (!images.length) return false

  for (const file of images) {
    const url = await uploadImageToStorage(file)
    if (!url) continue
    const chain = editor.chain().focus()
    if (typeof position === 'number') {
      chain.insertContentAt(position, {
        type: 'image',
        attrs: { src: url, align: 'center', width: 100 },
      })
    } else {
      chain.setImage({ src: url, align: 'center', width: 100 })
    }
    chain.run()
  }
  return true
}

function countWords(text) {
  if (!text) return 0
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length
}

function readingTime(words) {
  const minutes = Math.ceil(words / 200)
  if (minutes <= 1) return '~1 мин'
  return `~${minutes} мин`
}

function pluralWords(n) {
  if (n % 10 === 1 && n % 100 !== 11) return 'слово'
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return 'слова'
  return 'слов'
}

export default function ArticleEditor({ content, onUpdate, saveStatus }) {
  const [wordCount, setWordCount] = useState(0)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      CustomImage.configure({ allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Youtube.configure({ width: 640, height: 360 }),
      Placeholder.configure({ placeholder: 'Начните писать статью...' }),
      ContactCards,
    ],
    content: content || '',
    editorProps: {
      handleDrop(view, event, _slice, moved) {
        if (moved) return false
        const files = event.dataTransfer?.files
        if (!files?.length) return false
        const hasImage = Array.from(files).some((f) => f.type.startsWith('image/'))
        if (!hasImage) return false

        event.preventDefault()
        const coords = view.posAtCoords({ left: event.clientX, top: event.clientY })
        const pos = coords?.pos ?? view.state.selection.from
        insertUploadedImages(view._kn_editor, files, pos)
        return true
      },
      handlePaste(view, event) {
        const files = event.clipboardData?.files
        if (!files?.length) return false
        const hasImage = Array.from(files).some((f) => f.type.startsWith('image/'))
        if (!hasImage) return false

        event.preventDefault()
        insertUploadedImages(view._kn_editor, files)
        return true
      },
    },
    onCreate: ({ editor: ed }) => {
      ed.view._kn_editor = ed
      const text = ed.getText()
      setWordCount(countWords(text))
      emitUpdate(ed, onUpdate)
    },
    onUpdate: ({ editor: ed }) => {
      const text = ed.getText()
      setWordCount(countWords(text))
      emitUpdate(ed, onUpdate)
    },
  })

  return (
    <div style={editorWrapperStyle}>
      <EditorToolbar editor={editor} />
      <div
        style={{
          padding: '20px 24px',
          minHeight: '300px',
          fontSize: '0.9375rem',
          lineHeight: 1.35,
        }}
        className="tiptap-editor"
      >
        <EditorContent editor={editor} />
      </div>
      <div
        style={{
          display: 'flex',
          gap: '6px',
          padding: '6px 16px',
          borderTop: '1px solid var(--color-border)',
          fontSize: '0.6875rem',
          color: 'var(--color-text-secondary)',
          background: 'var(--color-bg)',
          borderRadius: '0 0 12px 12px',
        }}
      >
        <span>{wordCount} {pluralWords(wordCount)}</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span>{readingTime(wordCount)} чтения</span>
        {saveStatus && (
          <>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>{saveStatus}</span>
          </>
        )}
      </div>
    </div>
  )
}
