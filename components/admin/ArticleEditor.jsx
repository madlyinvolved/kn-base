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
import { uploadImageToStorage } from '../../lib/utils/uploadImage.js'

const editorWrapperStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: '12px',
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

export default function ArticleEditor({ content, onUpdate }) {
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
        // Async upload — editor instance comes from closure below.
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
      // Stash editor on the view so handleDrop/handlePaste can reach it.
      ed.view._kn_editor = ed
      emitUpdate(ed, onUpdate)
    },
    onUpdate: ({ editor: ed }) => {
      emitUpdate(ed, onUpdate)
    },
  })

  return (
    <div style={editorWrapperStyle}>
      <EditorToolbar editor={editor} />
      <div
        style={{
          padding: '20px',
          minHeight: '300px',
          fontSize: '0.9375rem',
          lineHeight: 1.7,
        }}
        className="tiptap-editor"
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
