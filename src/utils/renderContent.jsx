/**
 * Parses article content and converts [[id|text]] syntax to clickable links.
 * Returns an array of strings and React elements.
 */
export function renderContent(text, onArticleClick) {
  if (!text) return text

  const pattern = /\[\[(\d+)\|([^\]]+)\]\]/g
  const parts = []
  let lastIndex = 0
  let match

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    const articleId = parseInt(match[1], 10)
    const linkText = match[2]

    parts.push(
      <span
        key={`link-${match.index}`}
        role="link"
        tabIndex={0}
        onClick={() => onArticleClick(articleId)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onArticleClick(articleId)
        }}
        style={{
          color: 'var(--color-accent)',
          cursor: 'pointer',
          textDecoration: 'underline',
          textDecorationStyle: 'dotted',
          textUnderlineOffset: '3px',
        }}
      >
        {linkText}
      </span>,
    )

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts
}
