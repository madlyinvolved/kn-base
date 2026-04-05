import Layout from '../../components/public/Layout.jsx'
import ChatWidget from '../../components/public/ChatWidget/ChatWidget.jsx'

export default function PublicLayout({ children }) {
  return (
    <Layout>
      {children}
      <ChatWidget />
    </Layout>
  )
}
