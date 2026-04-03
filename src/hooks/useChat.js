import { useState, useCallback, useRef } from 'react'

const SYSTEM_PROMPT = `Ты — AI-ассистент внутреннего портала базы знаний компании AdCorp.

Правила:
1. Отвечай ТОЛЬКО на основе предоставленной базы знаний. Не выдумывай информацию.
2. Если ответа нет в базе — честно скажи, что не нашёл информацию, и предложи обратиться к HR.
3. Отвечай кратко, дружелюбно и по делу.
4. Используй русский язык.
5. Если вопрос не связан с работой в компании — вежливо перенаправь к базе знаний.`

function buildKBContext(articles) {
  return articles
    .filter((a) => a.content)
    .map((a) => `[Статья: ${a.title}]\n${a.content}`)
    .join('\n\n---\n\n')
}

const MAX_HISTORY = 10

export function useChat(apiKey, articles) {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const sendMessage = useCallback(
    async (text) => {
      if (!apiKey || !text.trim() || isLoading) return

      const userMessage = { role: 'user', content: text.trim() }
      setMessages((prev) => [...prev, userMessage])
      setError(null)
      setIsLoading(true)

      const history = [...messages, userMessage].slice(-MAX_HISTORY)

      const kbContext = buildKBContext(articles)

      try {
        abortRef.current = new AbortController()

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            system: `${SYSTEM_PROMPT}\n\nБаза знаний:\n${kbContext}`,
            messages: history.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
          signal: abortRef.current.signal,
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          const errMsg =
            response.status === 401
              ? 'Неверный API-ключ. Проверьте и попробуйте снова.'
              : data.error?.message || `Ошибка API: ${response.status}`
          throw new Error(errMsg)
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
    [apiKey, articles, messages, isLoading],
  )

  return { messages, isLoading, error, sendMessage }
}
