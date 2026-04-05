'use client'

import { useEffect, useState } from 'react'
import { createClient } from '../../../lib/supabase/client.js'

const titleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: '24px',
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  background: 'var(--color-surface)',
  borderRadius: '12px',
  overflow: 'hidden',
  border: '1px solid var(--color-border)',
}

const thStyle = {
  textAlign: 'left',
  padding: '12px 16px',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--color-text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  borderBottom: '1px solid var(--color-border)',
  background: 'var(--color-bg)',
}

const tdStyle = {
  padding: '12px 16px',
  fontSize: '0.875rem',
  borderBottom: '1px solid var(--color-border-light)',
}

const selectStyle = {
  padding: '6px 10px',
  fontSize: '0.8125rem',
  fontFamily: 'var(--font-body)',
  border: '1px solid var(--color-border)',
  borderRadius: '6px',
  background: 'var(--color-surface)',
  cursor: 'pointer',
}

const badgeAdmin = {
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: 600,
  background: '#e0e7ff',
  color: '#3730a3',
}

const badgeReader = {
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: 600,
  background: '#f3f4f6',
  color: '#6b7280',
}

const inviteFormStyle = {
  display: 'flex',
  gap: '12px',
  marginBottom: '24px',
  alignItems: 'flex-end',
}

const inputStyle = {
  padding: '10px 14px',
  fontSize: '0.875rem',
  fontFamily: 'var(--font-body)',
  border: '1px solid var(--color-border)',
  borderRadius: '8px',
  outline: 'none',
  minWidth: '280px',
}

const btnStyle = {
  padding: '10px 20px',
  fontSize: '0.875rem',
  fontFamily: 'var(--font-body)',
  fontWeight: 600,
  background: 'var(--color-accent)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
}

export default function UsersPage() {
  const [profiles, setProfiles] = useState([])
  const [currentUserId, setCurrentUserId] = useState(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [message, setMessage] = useState('')

  const supabase = createClient()

  async function loadProfiles() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) setCurrentUserId(user.id)

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at')
    setProfiles(data || [])
  }

  useEffect(() => {
    loadProfiles()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleRoleChange(profileId, newRole) {
    if (profileId === currentUserId && newRole !== 'admin') {
      alert('Нельзя снять роль admin у самого себя.')
      return
    }

    await supabase.from('profiles').update({ role: newRole }).eq('id', profileId)
    loadProfiles()
  }

  async function handleInvite(e) {
    e.preventDefault()
    setMessage('')

    if (!inviteEmail.trim()) return

    const { error } = await supabase.auth.admin.createUser({
      email: inviteEmail.trim(),
      email_confirm: true,
    })

    if (error) {
      setMessage(`Ошибка: ${error.message}`)
      return
    }

    setMessage(`Пользователь ${inviteEmail} создан`)
    setInviteEmail('')
    loadProfiles()
  }

  return (
    <div>
      <h1 style={titleStyle}>Пользователи</h1>

      <form style={inviteFormStyle} onSubmit={handleInvite}>
        <div>
          <label
            style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, marginBottom: '6px' }}
          >
            Пригласить пользователя
          </label>
          <input
            style={inputStyle}
            type="email"
            placeholder="email@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
        </div>
        <button type="submit" style={btnStyle}>
          Пригласить
        </button>
      </form>

      {message && (
        <div
          style={{
            padding: '10px 14px',
            fontSize: '0.8125rem',
            color: message.startsWith('Ошибка') ? '#dc2626' : '#15803d',
            background: message.startsWith('Ошибка') ? '#fef2f2' : '#dcfce7',
            borderRadius: '8px',
            marginBottom: '16px',
          }}
        >
          {message}
        </div>
      )}

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Имя</th>
            <th style={thStyle}>Роль</th>
            <th style={thStyle}>Дата регистрации</th>
            <th style={thStyle}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile.id}>
              <td style={{ ...tdStyle, fontWeight: 500 }}>{profile.email}</td>
              <td style={tdStyle}>{profile.display_name || '—'}</td>
              <td style={tdStyle}>
                <span style={profile.role === 'admin' ? badgeAdmin : badgeReader}>
                  {profile.role}
                </span>
              </td>
              <td style={{ ...tdStyle, fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                {new Date(profile.created_at).toLocaleDateString('ru-RU')}
              </td>
              <td style={tdStyle}>
                <select
                  style={selectStyle}
                  value={profile.role}
                  onChange={(e) => handleRoleChange(profile.id, e.target.value)}
                  disabled={profile.id === currentUserId}
                >
                  <option value="admin">admin</option>
                  <option value="reader">reader</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
