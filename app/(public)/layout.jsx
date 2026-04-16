import Layout from '../../components/public/Layout.jsx'
import ChatWidget from '../../components/public/ChatWidget/ChatWidget.jsx'

// Temporarily disable the chat widget. Flip to true to restore the floating
// button; /api/chat and ChatWidget are intentionally kept around.
const CHAT_ENABLED = false

export default function PublicLayout({ children }) {
  return (
    <Layout>
      {children}
      {CHAT_ENABLED && <ChatWidget />}
    </Layout>
  )
}
