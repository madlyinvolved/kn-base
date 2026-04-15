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
    case 'paragraph': {
      const hasContent =
        Array.isArray(children) && children.some((c) => c != null && c !== false)
      if (!hasContent) {
        return (
          <p key={key}>
            <br />
          </p>
        )
      }
      return <p key={key}>{children}</p>
    }
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
            textAlign: align,
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

const AVATAR_COLORS = ['#e85d2a', '#3b82f6', '#8b5cf6', '#059669', '#d946ef', '#f59e0b', '#6366f1', '#ec4899']

function contactInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.trim().slice(0, 2).toUpperCase()
}

function contactColor(name) {
  let hash = 0
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function parseTopics(topics) {
  if (!topics) return []
  return topics
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/^[-•*]\s*/, ''))
}

function renderContactCards(node, key) {
  const cards = node.attrs?.cards || []
  if (!cards.length) return null

  return (
    <div key={key} className="contact-cards-grid">
      {cards.map((card, idx) => {
        const topics = parseTopics(card.topics)
        return (
          <div key={idx} className="contact-card">
            <div className="contact-card__left">
              {card.photo ? (
                <img src={card.photo} alt={card.name || ''} className="contact-card__photo" />
              ) : (
                <div
                  className="contact-card__photo-placeholder"
                  style={{ background: contactColor(card.name) }}
                >
                  {contactInitials(card.name)}
                </div>
              )}
              {card.name && <div className="contact-card__name">{card.name}</div>}
              {card.slack && <div className="contact-card__slack">{card.slack}</div>}
            </div>
            {topics.length > 0 && (
              <div className="contact-card__right">
                <div className="contact-card__heading">Можно обратиться по вопросам:</div>
                <ul className="contact-card__topics">
                  {topics.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
