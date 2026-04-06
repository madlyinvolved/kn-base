/**
 * Converts plain text (with [[id|text]] links) to TipTap JSON document format.
 */
export function textToTipTapJSON(text) {
  if (!text) {
    return { type: 'doc', content: [{ type: 'paragraph' }] }
  }

  const paragraphs = text.split('\n\n')

  const content = paragraphs.map((para) => {
    if (!para.trim()) {
      return { type: 'paragraph' }
    }

    // Split paragraph into lines (single newlines become hard breaks)
    const lines = para.split('\n')
    const inlineContent = []

    lines.forEach((line, lineIdx) => {
      if (lineIdx > 0) {
        inlineContent.push({ type: 'hardBreak' })
      }

      // Parse [[id|text]] links within each line
      const linkPattern = /\[\[(\d+)\|([^\]]+)\]\]/g
      let lastIndex = 0
      let match

      while ((match = linkPattern.exec(line)) !== null) {
        // Text before the link
        if (match.index > lastIndex) {
          inlineContent.push({ type: 'text', text: line.slice(lastIndex, match.index) })
        }

        // The link itself — store as a marked text with a link
        const articleId = match[1]
        const linkText = match[2]
        inlineContent.push({
          type: 'text',
          text: linkText,
          marks: [
            {
              type: 'link',
              attrs: { href: `/article/${articleId}`, target: null, class: null },
            },
          ],
        })

        lastIndex = match.index + match[0].length
      }

      // Remaining text after last link
      if (lastIndex < line.length) {
        inlineContent.push({ type: 'text', text: line.slice(lastIndex) })
      }
    })

    return {
      type: 'paragraph',
      content: inlineContent.length > 0 ? inlineContent : undefined,
    }
  })

  return { type: 'doc', content }
}

/**
 * Checks if a value is a valid TipTap document JSON.
 */
export function isValidTipTapDoc(content) {
  return (
    content &&
    typeof content === 'object' &&
    content.type === 'doc' &&
    Array.isArray(content.content) &&
    content.content.length > 0
  )
}
