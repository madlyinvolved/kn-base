'use client'

import { useEffect, useState } from 'react'
import AdminSidebar from './AdminSidebar.jsx'
import { createClient } from '../../lib/supabase/client.js'

const contentStyle = {
  marginLeft: '240px',
  minHeight: '100vh',
  padding: '32px',
  background: 'var(--color-bg)',
}

export default function AdminShell({ children }) {
  const [email, setEmail] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setEmail(user.email)
    })
  }, [])

  return (
    <div>
      <AdminSidebar userEmail={email} />
      <div style={contentStyle}>{children}</div>
    </div>
  )
}
