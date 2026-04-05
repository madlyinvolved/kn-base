'use client'

const containerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '48px 24px',
}

const titleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: '16px',
}

export default function AdminDashboard() {
  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Админ-панель</h1>
      <p style={{ color: 'var(--color-text-secondary)' }}>
        Дашборд будет реализован в Milestone 11.
      </p>
    </div>
  )
}
