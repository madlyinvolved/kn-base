'use client'

import Link from 'next/link'

const navStyle = {
  marginBottom: '24px',
  fontSize: '0.875rem',
  color: 'var(--color-text-secondary)',
}

const listStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
  listStyle: 'none',
  padding: 0,
  margin: 0,
}

const linkStyle = {
  color: 'var(--color-accent)',
  textDecoration: 'none',
  transition: 'opacity var(--transition-fast)',
}

const separatorStyle = {
  color: 'var(--color-text-secondary)',
  opacity: 0.5,
  userSelect: 'none',
}

const currentStyle = {
  color: 'var(--color-text)',
  fontWeight: 500,
}

export default function Breadcrumb({ items }) {
  if (!items || items.length === 0) return null

  return (
    <nav style={navStyle} aria-label="Хлебные крошки">
      <ol style={listStyle}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {index > 0 && (
                <span style={separatorStyle} aria-hidden="true">
                  →
                </span>
              )}
              {isLast ? (
                <span style={currentStyle} aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} style={linkStyle}>
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
