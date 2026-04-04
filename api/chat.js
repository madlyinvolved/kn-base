/**
 * Vercel Serverless Function: API proxy for Anthropic Claude
 *
 * Hides the API key on the server side.
 * Set ANTHROPIC_API_KEY in Vercel environment variables.
 *
 * POST /api/chat
 * Body: { messages: [{ role, content }], knowledgeBase: string }
 */

const SYSTEM_PROMPT = `Ты — AI-ассистент внутреннего портала базы знаний компании AdCorp.

Правила:
1. Отвечай ТОЛЬКО на основе предоставленной базы знаний. Не выдумывай информацию.
2. Если ответа нет в базе — честно скажи, что не нашёл информацию, и предложи обратиться к HR.
3. Отвечай кратко, дружелюбно и по делу.
4. Используй русский язык.
5. Если вопрос не связан с работой в компании — вежливо перенаправь к базе знаний.`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' })
  }

  const { messages, knowledgeBase } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: `${SYSTEM_PROMPT}\n\nБаза знаний:\n${knowledgeBase || ''}`,
        messages: messages.slice(-10).map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      return res.status(response.status).json({
        error: data.error?.message || `Anthropic API error: ${response.status}`,
      })
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reach Anthropic API' })
  }
}
