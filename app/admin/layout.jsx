import AuthGuard from '../../components/shared/AuthGuard.jsx'
import AdminShell from '../../components/admin/AdminShell.jsx'

export const metadata = {
  title: 'Админ-панель — База знаний AdCorp',
}

export default function AdminLayout({ children }) {
  return (
    <AuthGuard>
      <AdminShell>{children}</AdminShell>
    </AuthGuard>
  )
}
