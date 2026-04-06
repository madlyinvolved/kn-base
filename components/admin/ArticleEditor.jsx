'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Image } from '@tiptap/extension-image'
import { Link } from '@tiptap/extension-link'
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table'
import { Youtube } from '@tiptap/extension-youtube'
import { Placeholder } from '@tiptap/extension-placeholder'
import EditorToolbar from './EditorToolbar.jsx'

const editorWrapperStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: '12px',
  overflow: 'hidden',
}

function emitUpdate(editor, onUpdate) {
  onUpdate({
    json: editor.getJSON(),
    text: editor.getText(),
    html: editor.getHTML(),
  })
}

export default function ArticleEditor({ content, onUpdate }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Image.configure({ allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Youtube.configure({ width: 640, height: 360 }),
      Placeholder.configure({ placeholder: 'Начните писать статью...' }),
    ],
    content: content || '',
    onCreate: ({ editor: ed }) => {
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
