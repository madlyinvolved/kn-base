'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client.js'

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--color-bg)',
  padding: '24px',
}

const cardStyle = {
  width: '100%',
  maxWidth: '400px',
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: '16px',
  padding: '40px 32px',
  boxShadow: 'var(--shadow-md)',
}

const titleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '1.75rem',
  fontWeight: 700,
  textAlign: 'center',
  marginBottom: '8px',
}

const subtitleStyle = {
  fontSize: '0.875rem',
  color: 'var(--color-text-secondary)',
  textAlign: 'center',
  marginBottom: '32px',
}

const labelStyle = {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: 500,
  marginBottom: '6px',
  color: 'var(--color-text)',
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  fontSize: '0.9375rem',
  fontFamily: 'var(--font-body)',
  border: '1px solid var(--color-border)',
  borderRadius: '10px',
  outline: 'none',
  background: 'var(--color-bg)',
  color: 'var(--color-text)',
  transition: 'border-color var(--transition-fast)',
  boxSizing: 'border-box',
}

const buttonStyle = {
  width: '100%',
  padding: '12px',
  fontSize: '1rem',
  fontFamily: 'var(--font-body)',
  fontWeight: 600,
  background: 'var(--color-accent)',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'background var(--transition-fast)',
  marginTop: '24px',
}

const errorStyle = {
  padding: '10px 14px',
  fontSize: '0.8125rem',
  color: '#dc2626',
  background: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '8px',
  marginTop: '16px',
}

const linkStyle = {
  display: 'block',
  textAlign: 'center',
  marginTop: '20px',
  fontSize: '0.8125rem',
  color: 'var(--color-accent)',
  textDecoration: 'none',
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (authError) {
        setError(
          authError.message === 'Invalid login credentials'
            ? 'Неверный email или пароль'
            : authError.message,
        )
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Ошибка подключения к серверу')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Вход</h1>
        <p style={subtitleStyle}>Админ-панель базы знаний AdCorp</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
              required
              autoComplete="email"
              placeholder="you@adcorp.com"
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="password">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
              required
              autoComplete="current-password"
              placeholder="Введите пароль"
            />
          </div>

          <button
            type="submit"
            style={{
              ...buttonStyle,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>

          {error && <div style={errorStyle}>{error}</div>}
        </form>

        <a href="/" style={linkStyle}>
          ← На главную портала
        </a>
      </div>
    </div>
  )
}
