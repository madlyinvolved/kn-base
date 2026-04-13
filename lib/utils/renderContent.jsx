import Link from 'next/link'

/**
 * Parses article content (plain text with [[id|text]] syntax) and converts
 * the special links to clickable spans. Returns an array of strings and React elements.
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

/**
 * Renders a TipTap JSON document as React elements. Supports the node and
 * mark types used by the article editor so the portal, preview, and editor
 * share the same output.
 */
export function renderTipTapContent(doc) {
  if (!doc || typeof doc !== 'object' || doc.type !== 'doc') return null
  return renderNodes(doc.content, 'root')
}

function renderNodes(nodes, prefix) {
  if (!Array.isArray(nodes)) return null
  return nodes.map((n, i) => renderNode(n, `${prefix}-${i}`))
}

function renderNode(node, key) {
  if (!node) return null
  const children = node.content ? renderNodes(node.content, key) : null

  switch (node.type) {
    case 'paragraph':
      return <p key={key}>{children}</p>
    case 'heading': {
      const level = node.attrs?.level || 2
      if (level === 3) return <h3 key={key}>{children}</h3>
      return <h2 key={key}>{children}</h2>
    }
    case 'bulletList':
      return <ul key={key}>{children}</ul>
    case 'orderedList':
      return <ol key={key}>{children}</ol>
    case 'listItem':
      return <li key={key}>{children}</li>
    case 'blockquote':
      return <blockquote key={key}>{children}</blockquote>
    case 'horizontalRule':
      return <hr key={key} />
    case 'codeBlock':
      return (
        <pre key={key}>
          <code>{children}</code>
        </pre>
      )
    case 'hardBreak':
      return <br key={key} />
    case 'image':
      return renderImage(node, key)
    case 'table':
      return (
        <table key={key}>
          <tbody>{children}</tbody>
        </table>
      )
    case 'tableRow':
      return <tr key={key}>{children}</tr>
    case 'tableCell':
      return <td key={key}>{children}</td>
    case 'tableHeader':
      return <th key={key}>{children}</th>
    case 'contactCards':
      return renderContactCards(node, key)
    case 'text':
      return renderTextNode(node, key)
    default:
      return children
  }
}

function renderImage(node, key) {
  const attrs = node.attrs || {}
  const align = attrs.align || 'center'
  const width = attrs.width || 100
  const wrap = attrs.wrap === true

  const figureStyle = {
    margin: '1em 0',
    textAlign: align === 'center' ? 'center' : align === 'right' ? 'right' : 'left',
  }

  if (wrap) {
    figureStyle.float = align === 'right' ? 'right' : 'left'
    figureStyle.maxWidth = '50%'
    figureStyle.marginLeft = align === 'right' ? '16px' : 0
    figureStyle.marginRight = align === 'left' ? '16px' : 0
  }

  const imgStyle = {
    width: `${width}%`,
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '8px',
    display: 'inline-block',
  }

  return (
    <figure key={key} style={figureStyle}>
      <img src={attrs.src} alt={attrs.alt || attrs.caption || ''} style={imgStyle} />
      {attrs.caption && (
        <figcaption
          style={{
            fontSize: '0.8125rem',
            color: 'var(--color-text-secondary)',
            fontStyle: 'italic',
            textAlign: 'center',
            marginTop: '6px',
          }}
        >
          {attrs.caption}
        </figcaption>
      )}
    </figure>
  )
}

function renderTextNode(node, key) {
  let el = node.text
  const marks = node.marks || []

  for (const mark of marks) {
    if (mark.type === 'bold') el = <strong>{el}</strong>
    else if (mark.type === 'italic') el = <em>{el}</em>
    else if (mark.type === 'underline') el = <u>{el}</u>
    else if (mark.type === 'strike') el = <s>{el}</s>
    else if (mark.type === 'code') el = <code>{el}</code>
    else if (mark.type === 'link') {
      const href = mark.attrs?.href || '#'
      if (href.startsWith('/article/')) {
        el = (
          <Link href={href} style={{ color: 'var(--color-accent)' }}>
            {el}
          </Link>
        )
      } else {
        el = (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {el}
          </a>
        )
      }
    }
  }

  return <span key={key}>{el}</span>
}

function renderContactCards(node, key) {
  const cards = node.attrs?.cards || []
  if (!cards.length) return null

  return (
    <div
      key={key}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        margin: '16px 0',
      }}
    >
      {cards.map((card, idx) => (
        <div
          key={idx}
          style={{
            padding: '16px',
            borderRadius: '12px',
            border: idx === 0 ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
            background: idx === 0 ? '#fef6f3' : 'var(--color-surface)',
            boxShadow: idx === 0 ? '0 0 0 1px var(--color-accent)' : 'none',
            fontSize: '0.875rem',
            lineHeight: 1.5,
          }}
        >
          {card.name && (
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '4px' }}>
              {card.name}
            </div>
          )}
          {card.role && (
            <div
              style={{
                fontSize: '0.8125rem',
                color: 'var(--color-text-secondary)',
                marginBottom: '8px',
              }}
            >
              {card.role}
            </div>
          )}
          {card.phone && (
            <div style={{ fontSize: '0.8125rem', marginBottom: '2px' }}>
              📞 {card.phone}
            </div>
          )}
          {card.email && (
            <div style={{ fontSize: '0.8125rem', wordBreak: 'break-all' }}>
              ✉️ {card.email}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
