import Layout from '../../components/public/Layout.jsx'
// ChatWidget disabled. To restore: import ChatWidget and add {CHAT_ENABLED && <ChatWidget />} below.
// import ChatWidget from '../../components/public/ChatWidget/ChatWidget.jsx'

export default function PublicLayout({ children }) {
  return (
    <Layout>
      {children}
    </Layout>
  )
}
