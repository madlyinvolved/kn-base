'use client'

const wrapperStyle = {
  position: 'relative',
  maxWidth: '520px',
  margin: '24px auto 0',
}

const inputStyle = {
  width: '100%',
  padding: '14px 20px 14px 48px',
  fontSize: '1rem',
  fontFamily: 'var(--font-body)',
  background: 'var(--color-surface)',
  border: '2px solid var(--color-border)',
  borderRadius: '14px',
  outline: 'none',
  transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
  color: 'var(--color-text)',
}

const iconStyle = {
  position: 'absolute',
  left: '16px',
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '1.125rem',
  color: 'var(--color-text-secondary)',
  pointerEvents: 'none',
}

export default function SearchBar({ value, onChange }) {
  return (
    <div style={wrapperStyle}>
      <span style={iconStyle} aria-hidden="true">
        🔍
      </span>
      <input
        type="text"
        style={inputStyle}
        placeholder="Поиск по базе знаний..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--color-accent)'
          e.target.style.boxShadow = '0 0 0 3px rgba(232, 93, 42, 0.1)'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--color-border)'
          e.target.style.boxShadow = 'none'
        }}
        aria-label="Поиск по базе знаний"
      />
    </div>
  )
}
