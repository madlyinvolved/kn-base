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
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 })
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

    const geminiMessages = messages.slice(-10).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: `${SYSTEM_PROMPT}\n\nБаза знаний:\n${kbContext}` }],
        },
        contents: geminiMessages,
        generationConfig: {
          maxOutputTokens: 1024,
        },
      }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      const errMsg = data.error?.message || `Gemini API error: ${response.status}`
      return NextResponse.json({ error: errMsg }, { status: response.status })
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    return NextResponse.json({ content: [{ text }] })
  } catch {
    return NextResponse.json({ error: 'Failed to reach Gemini API' }, { status: 500 })
  }
}
