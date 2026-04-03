const navStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '24px',
  fontSize: '0.875rem',
  color: 'var(--color-text-secondary)',
  flexWrap: 'wrap',
}

const linkStyle = {
  color: 'var(--color-accent)',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  padding: 0,
  fontFamily: 'var(--font-body)',
  fontSize: '0.875rem',
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

/**
 * Breadcrumb navigation
 * @param {Array} items - Array of { label, onClick } objects. Last item has no onClick (current page).
 */
export default function Breadcrumb({ items }) {
  if (!items || items.length === 0) return null

  return (
    <nav style={navStyle} aria-label="Навигация">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <span key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {index > 0 && <span style={separatorStyle}>→</span>}
            {isLast ? (
              <span style={currentStyle} aria-current="page">
                {item.label}
              </span>
            ) : (
              <button
                style={linkStyle}
                onClick={item.onClick}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                {item.label}
              </button>
            )}
          </span>
        )
      })}
    </nav>
  )
}
