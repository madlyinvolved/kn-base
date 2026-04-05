import { NextResponse } from 'next/server'
import { getAllArticles } from '../../../lib/data/queries.js'

const SYSTEM_PROMPT = `Ты — AI-ассистент внутреннего портала базы знаний компании AdCorp.

Правила:
1. Отвечай ТОЛЬКО на основе предоставленной базы знаний. Не выдумывай информацию.
2. Если ответа нет в базе — честно скажи, что не нашёл информацию, и предложи обратиться к HR.
3. Отвечай кратко, дружелюбно и по делу.
4. Используй русский язык.
5. Если вопрос не связан с работой в компании — вежливо перенаправь к базе знаний.`

async function buildKBContext() {
  const articles = await getAllArticles()
  return articles
    .filter((a) => a.content)
    .map((a) => `[Статья: ${a.title}]\n${a.content}`)
    .join('\n\n---\n\n')
}

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { messages } = body

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: 'messages array is required' }, { status: 400 })
  }

  try {
    const kbContext = await buildKBContext()

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
        system: `${SYSTEM_PROMPT}\n\nБаза знаний:\n${kbContext}`,
        messages: messages.slice(-10).map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: data.error?.message || `Anthropic API error: ${response.status}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to reach Anthropic API' }, { status: 500 })
  }
}
