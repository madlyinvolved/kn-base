import AuthGuard from '../../components/shared/AuthGuard.jsx'

export const metadata = {
  title: 'Админ-панель — База знаний AdCorp',
}

export default function AdminLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>
}
