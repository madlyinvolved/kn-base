'use client'

import { useState, useEffect } from 'react'

const CATEGORIES = {
  sport: { label: 'Спорт', color: '#0F6E56', bg: '#E1F5EE', icon: '🏋️' },
  english: { label: 'Английский', color: '#534AB7', bg: '#EEEDFE', icon: '🇬🇧' },
  courses: { label: 'Курсы', color: '#993C1D', bg: '#FAECE7', icon: '📚' },
  food: { label: 'Еда', color: '#854F0B', bg: '#FAEEDA', icon: '🍽️' },
  health: { label: 'Здоровье', color: '#2E6FAC', bg: '#E6F1FB', icon: '💊' },
  other: { label: 'Другое', color: '#666', bg: '#F1EFE8', icon: '🎁' },
}

function getCat(key) {
  return CATEGORIES[key] || CATEGORIES.other
}

function formatDate(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

function renderDescription(text) {
  if (!text) return null
  return text.split('\n').map((line, i) => {
    const trimmed = line.trim()
    if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
      return <li key={i} style={{ marginLeft: '16px', marginBottom: '2px' }}>{trimmed.replace(/^[•\-]\s*/, '')}</li>
    }
    if (trimmed === '') return <br key={i} />
    return <p key={i} style={{ margin: '0 0 4px' }}>{trimmed}</p>
  })
}

export default function DiscountsClient({ discounts }) {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [copied, setCopied] = useState(false)

  const filtered = filter === 'all' ? discounts : discounts.filter((d) => d.category === filter)

  useEffect(() => {
    if (selected) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [selected])

  useEffect(() => {
    if (!selected) return
    function onKey(e) { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  async function copyPromo(code) {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const pills = [
    { key: 'all', label: 'Все' },
    ...Object.entries(CATEGORIES).map(([key, val]) => ({ key, label: val.label })),
  ]

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
          Корпоративные скидки
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
          Скидки от партнёров для сотрудников AdCorp
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {pills.map((p) => {
          const isActive = filter === p.key
          const cat = CATEGORIES[p.key]
          return (
            <button
              key={p.key}
              onClick={() => setFilter(p.key)}
              style={{
                padding: '5px 14px',
                borderRadius: '16px',
                fontSize: '12px',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                border: '1px solid',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                background: isActive ? (cat?.bg || '#FAECE7') : 'var(--color-surface)',
                color: isActive ? (cat?.color || '#993C1D') : 'var(--color-text-secondary)',
                borderColor: isActive ? (cat?.color || '#F5C4B3') : 'var(--color-border)',
              }}
            >
              {p.label}
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '40px 0' }}>
          Нет доступных скидок
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }} className="discounts-grid">
          {filtered.map((d) => (
            <DiscountCard key={d.id} discount={d} onClick={() => setSelected(d)} />
          ))}
        </div>
      )}

      {selected && (
        <DiscountModal
          discount={selected}
          onClose={() => setSelected(null)}
          onCopyPromo={copyPromo}
          copied={copied}
        />
      )}
    </div>
  )
}

function DiscountCard({ discount, onClick }) {
  const cat = getCat(discount.category)

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 16px',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all var(--transition-fast)',
        width: '100%',
        fontFamily: 'var(--font-body)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = cat.color }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
    >
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '10px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: discount.logo_url ? 'white' : cat.bg,
        border: discount.logo_url ? '1px solid var(--color-border)' : 'none',
      }}>
        {discount.logo_url ? (
          <img src={discount.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <span style={{ fontSize: '18px' }}>{cat.icon}</span>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, fontSize: '14px', color: 'var(--color-text)' }}>
          {discount.partner_name}
        </div>
        {discount.short_description && (
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {discount.short_description}
          </div>
        )}
      </div>

      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontWeight: 500, fontSize: '16px', color: cat.color }}>
          {discount.discount_value}
        </div>
        {discount.valid_until && (
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            до {formatDate(discount.valid_until)}
          </div>
        )}
      </div>
    </button>
  )
}

function DiscountModal({ discount, onClose, onCopyPromo, copied }) {
  const cat = getCat(discount.category)

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        padding: '24px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '480px',
          maxHeight: 'calc(100vh - 48px)',
          overflowY: 'auto',
          background: 'var(--color-surface)',
          borderRadius: '16px',
          padding: '24px',
          position: 'relative',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: 'var(--color-text-secondary)',
            padding: '4px',
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            background: discount.logo_url ? 'white' : cat.bg,
            border: discount.logo_url ? '1px solid var(--color-border)' : 'none',
          }}>
            {discount.logo_url ? (
              <img src={discount.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: '22px' }}>{cat.icon}</span>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '16px' }}>{discount.partner_name}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{cat.label}</div>
          </div>
          <div style={{ fontWeight: 700, fontSize: '20px', color: cat.color }}>
            {discount.discount_value}
          </div>
        </div>

        {discount.full_description && (
          <div style={{ fontSize: '14px', lineHeight: 1.5, marginBottom: '16px', color: 'var(--color-text)' }}>
            {renderDescription(discount.full_description)}
          </div>
        )}

        {discount.conditions && (
          <div style={{
            background: 'var(--color-bg)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
          }}>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
              Условия
            </div>
            <div style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--color-text)' }}>
              {renderDescription(discount.conditions)}
            </div>
          </div>
        )}

        {discount.promo_code && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Промокод</div>
            <button
              onClick={() => onCopyPromo(discount.promo_code)}
              style={{
                fontFamily: 'monospace',
                fontSize: '14px',
                fontWeight: 600,
                padding: '8px 16px',
                background: cat.bg,
                color: cat.color,
                border: `1px dashed ${cat.color}`,
                borderRadius: '8px',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              {discount.promo_code}
              {copied && (
                <span style={{
                  position: 'absolute',
                  top: '-28px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--color-text)',
                  color: 'var(--color-surface)',
                  fontSize: '11px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  whiteSpace: 'nowrap',
                }}>
                  Скопировано!
                </span>
              )}
            </button>
          </div>
        )}

        {discount.link && (
          <a
            href={discount.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 500,
              color: cat.color,
              border: `1px solid ${cat.color}`,
              borderRadius: '8px',
              textDecoration: 'none',
              marginBottom: '16px',
              transition: 'all var(--transition-fast)',
            }}
          >
            Перейти на сайт →
          </a>
        )}

        {discount.valid_until && (
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
            Действует до {formatDate(discount.valid_until)}
          </div>
        )}
      </div>
    </div>
  )
}
