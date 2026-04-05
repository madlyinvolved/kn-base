'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
  textDecoration: 'none',
}

const backLinkStyle = {
  fontFamily: 'var(--font-body)',
  fontSize: '0.875rem',
  color: 'var(--color-accent)',
  border: '1px solid var(--color-accent)',
  borderRadius: '8px',
  padding: '6px 16px',
  textDecoration: 'none',
  transition: 'all var(--transition-fast)',
  minHeight: '36px',
  display: 'inline-flex',
  alignItems: 'center',
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

export default function Layout({ children }) {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Перейти к содержимому
      </a>
      <header style={headerStyle} role="banner">
        <nav style={headerContentStyle} aria-label="Основная навигация">
          <Link href="/" style={logoStyle}>
            AdCorp Knowledge Base
          </Link>
          {!isHome && (
            <Link href="/" style={backLinkStyle}>
              Главная
            </Link>
          )}
        </nav>
      </header>

      <main id="main-content" style={mainStyle} role="main">
        {children}
      </main>

      <footer style={footerStyle} role="contentinfo">
        <p>AdCorp Knowledge Base &copy; {new Date().getFullYear()}</p>
      </footer>
    </>
  )
}
