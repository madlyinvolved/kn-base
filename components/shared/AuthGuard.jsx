'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client.js'

const loadingStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  fontSize: '1rem',
  color: 'var(--color-text-secondary)',
}

const deniedStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  gap: '16px',
  padding: '24px',
  textAlign: 'center',
}

const buttonStyle = {
  padding: '10px 24px',
  fontSize: '0.875rem',
  fontFamily: 'var(--font-body)',
  fontWeight: 600,
  background: 'var(--color-accent)',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
}

export default function AuthGuard({ children }) {
  const router = useRouter()
  const [status, setStatus] = useState('loading') // loading | authorized | denied

  useEffect(() => {
    async function checkRole() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'admin') {
        setStatus('authorized')
      } else {
        setStatus('denied')
      }
    }

    checkRole()
  }, [router])

  if (status === 'loading') {
    return <div style={loadingStyle}>Загрузка...</div>
  }

  if (status === 'denied') {
    return (
      <div style={deniedStyle}>
        <div style={{ fontSize: '3rem' }}>🔒</div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
          }}
        >
          Нет доступа
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
          Эта страница доступна только администраторам.
        </p>
        <button style={buttonStyle} onClick={() => router.push('/')}>
          На главную
        </button>
      </div>
    )
  }

  return children
}
