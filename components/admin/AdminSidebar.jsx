'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client.js'

const sidebarStyle = {
  width: '240px',
  minHeight: '100vh',
  background: 'var(--color-surface)',
  borderRight: '1px solid var(--color-border)',
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 50,
}

const logoStyle = {
  padding: '20px 20px 16px',
  fontFamily: 'var(--font-display)',
  fontSize: '1rem',
  fontWeight: 600,
  color: 'var(--color-text)',
  borderBottom: '1px solid var(--color-border-light)',
  textDecoration: 'none',
  display: 'block',
}

const navStyle = {
  flex: 1,
  padding: '12px 8px',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
}

const navItemBase = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 14px',
  fontSize: '0.875rem',
  fontFamily: 'var(--font-body)',
  borderRadius: '8px',
  textDecoration: 'none',
  color: 'var(--color-text)',
  transition: 'all var(--transition-fast)',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'left',
}

const activeStyle = {
  background: `var(--color-accent)`,
  color: 'white',
}

const footerStyle = {
  padding: '16px',
  borderTop: '1px solid var(--color-border-light)',
}

const NAV_ITEMS = [
  { href: '/admin', label: 'Дашборд', icon: '📊' },
  { href: '/admin/articles', label: 'Статьи', icon: '📝' },
  { href: '/admin/categories', label: 'Категории', icon: '📁' },
  { href: '/admin/users', label: 'Пользователи', icon: '👥' },
]

export default function AdminSidebar({ userEmail }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <aside style={sidebarStyle}>
      <Link href="/admin" style={logoStyle}>
        AdCorp Admin
      </Link>

      <nav style={navStyle}>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                ...navItemBase,
                ...(isActive ? activeStyle : {}),
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div style={footerStyle}>
        {userEmail && (
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '10px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {userEmail}
          </div>
        )}
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link
            href="/"
            style={{
              ...navItemBase,
              fontSize: '0.8125rem',
              padding: '8px 12px',
              justifyContent: 'center',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
            }}
          >
            Портал
          </Link>
          <button
            onClick={handleLogout}
            style={{
              ...navItemBase,
              fontSize: '0.8125rem',
              padding: '8px 12px',
              justifyContent: 'center',
              color: '#dc2626',
              border: '1px solid #fecaca',
              borderRadius: '8px',
            }}
          >
            Выйти
          </button>
        </div>
      </div>
    </aside>
  )
}
