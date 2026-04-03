const headerStyle = {
  position: 'sticky',
  top: 0,
  zIndex: 100,
  background: 'rgba(250, 249, 247, 0.85)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderBottom: '1px solid var(--color-border-light)',
  height: 'var(--header-height)',
  display: 'flex',
  alignItems: 'center',
}

const headerContentStyle = {
  maxWidth: 'var(--max-width)',
  width: '100%',
  margin: '0 auto',
  padding: '0 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}

const logoStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '1.25rem',
  fontWeight: 600,
  color: 'var(--color-text)',
  cursor: 'pointer',
  userSelect: 'none',
  border: 'none',
  background: 'none',
  padding: 0,
}

const backButtonStyle = {
  fontFamily: 'var(--font-body)',
  fontSize: '0.875rem',
  color: 'var(--color-accent)',
  background: 'none',
  border: '1px solid var(--color-accent)',
  borderRadius: '8px',
  padding: '6px 16px',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
}

const mainStyle = {
  maxWidth: 'var(--max-width)',
  margin: '0 auto',
  padding: '32px 24px',
  minHeight: 'calc(100vh - var(--header-height) - 80px)',
}

const footerStyle = {
  textAlign: 'center',
  padding: '24px',
  color: 'var(--color-text-secondary)',
  fontSize: '0.8125rem',
  borderTop: '1px solid var(--color-border-light)',
}

export default function Layout({ children, showBack, onGoHome }) {
  return (
    <div className="app">
      <header style={headerStyle}>
        <div style={headerContentStyle}>
          <button style={logoStyle} onClick={onGoHome} aria-label="На главную">
            AdCorp Knowledge Base
          </button>
          {showBack && (
            <button
              style={backButtonStyle}
              onClick={onGoHome}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-accent)'
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none'
                e.currentTarget.style.color = 'var(--color-accent)'
              }}
            >
              Главная
            </button>
          )}
        </div>
      </header>

      <main style={mainStyle}>{children}</main>

      <footer style={footerStyle}>
        <p>AdCorp Knowledge Base &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}
