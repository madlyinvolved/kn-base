import { useState, useCallback, useRef } from 'react'

const MAX_HISTORY = 10

export function useChat() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim() || isLoading) return

      const userMessage = { role: 'user', content: text.trim() }
      setMessages((prev) => [...prev, userMessage])
      setError(null)
      setIsLoading(true)

      const history = [...messages, userMessage].slice(-MAX_HISTORY)

      try {
        abortRef.current = new AbortController()

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: history.map((m) => ({ role: m.role, content: m.content })),
          }),
          signal: abortRef.current.signal,
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.error || `Ошибка сервера: ${response.status}`)
        }

        const data = await response.json()
        const assistantText = data.content?.[0]?.text || 'Не удалось получить ответ.'
        setMessages((prev) => [...prev, { role: 'assistant', content: assistantText }])
      } catch (err) {
        if (err.name === 'AbortError') return
        setError(err.message || 'Произошла ошибка при обращении к AI.')
      } finally {
        setIsLoading(false)
        abortRef.current = null
      }
    },
    [messages, isLoading],
  )

  return { messages, isLoading, error, sendMessage }
}
