'use client'

import { useState, useRef, useEffect, Fragment } from 'react'
import Link from 'next/link'

const HOTSPOT_COLORS = ['#e85d2a', '#6d5ce7', '#0ea574', '#d97706']

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
  if (attrs.hotspots?.length > 0) {
    return <ImageWithHotspots key={key} attrs={attrs} />
  }
  return renderSimpleImage(attrs, key)
}

function renderSimpleImage(attrs, key) {
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

function ImageWithHotspots({ attrs }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const [activeIdx, setActiveIdx] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef(null)

  const align = attrs.align || 'center'
  const width = attrs.width || 100
  const wrap = attrs.wrap === true
  const hotspots = attrs.hotspots || []

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    function onDocClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveIdx(null)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

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

  function getTooltipStyle(h) {
    // Mobile: always below the dot, centered
    if (isMobile) {
      return {
        position: 'absolute',
        left: `${h.x}%`,
        top: `calc(${h.y}% + 14px)`,
        transform: 'translateX(-50%)',
        zIndex: 20,
      }
    }
    // Desktop: left half → right of dot; right half → left of dot
    // Top quarter → below dot; otherwise → vertically centered
    const toLeft = h.x > 50
    const toBottom = h.y < 25
    const style = { position: 'absolute', zIndex: 20 }

    if (toLeft) {
      style.left = `${h.x}%`
      style.transform = toBottom
        ? 'translateX(calc(-100% - 14px))'
        : 'translateX(calc(-100% - 14px)) translateY(-50%)'
    } else {
      style.left = `calc(${h.x}% + 14px)`
      if (!toBottom) style.transform = 'translateY(-50%)'
    }
    style.top = toBottom ? `calc(${h.y}% + 14px)` : `${h.y}%`

    return style
  }

  return (
    <figure ref={containerRef} style={figureStyle}>
      <div style={{ position: 'relative', display: 'inline-block', width: `${width}%`, maxWidth: '100%' }}>
        <img
          src={attrs.src}
          alt={attrs.alt || attrs.caption || ''}
          style={{ width: '100%', maxWidth: '100%', height: 'auto', borderRadius: '8px', display: 'block' }}
        />
        {hotspots.map((h, idx) => {
          const color = HOTSPOT_COLORS[idx % HOTSPOT_COLORS.length]
          const visible = hoveredIdx === idx || activeIdx === idx

          return (
            <Fragment key={idx}>
              <div
                className="hotspot-dot"
                style={{ left: `${h.x}%`, top: `${h.y}%`, background: color }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => setActiveIdx(activeIdx === idx ? null : idx)}
              >
                {idx + 1}
              </div>
              {(h.title || h.description) && visible && (
                <div className="hotspot-tooltip" style={getTooltipStyle(h)}>
                  {h.title && <div className="hotspot-tooltip__title">{h.title}</div>}
                  {h.description && <div className="hotspot-tooltip__desc">{h.description}</div>}
                </div>
              )}
            </Fragment>
          )
        })}
      </div>
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

const AVATAR_COLORS = ['#e85d2a', '#6d5ce7', '#0ea574', '#d97706']

function contactInitials(name) {
  if (!name) return '?'
  const cleaned = name.replace(/^@/, '')
  const parts = cleaned.split(/[.\s_-]+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return cleaned.slice(0, 2).toUpperCase()
}

function contactColor(name, idx) {
  if (typeof idx === 'number') return AVATAR_COLORS[idx % AVATAR_COLORS.length]
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
            {card.photo ? (
              <img src={card.photo} alt={card.name || ''} className="contact-card__photo" />
            ) : (
              <div
                className="contact-card__photo-placeholder"
                style={{ background: contactColor(card.name, idx) }}
              >
                {contactInitials(card.name)}
              </div>
            )}
            <div className="contact-card__body">
              {card.name && <div className="contact-card__name">{card.name}</div>}
              {topics.length > 0 && (
                <ul className="contact-card__topics">
                  {topics.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
