import { NextResponse } from 'next/server'
import { getAllArticles } from '../../../lib/data/queries.js'

const SYSTEM_PROMPT = `Ты — AI-ассистент внутреннего портала базы знаний компании AdCorp.

Правила:
1. Отвечай ТОЛЬКО на основе предоставленной базы знаний. Не выдумывай информацию.
2. Если ответа нет в базе — честно скажи, что не нашёл информацию, и предложи обратиться к HR.
3. Отвечай кратко, дружелюбно и по делу.
4. Используй русский язык.
5. Если вопрос не связан с работой в компании — вежливо перенаправь к базе знаний.`

const MODEL_FALLBACKS = [
  'deepseek/deepseek-r1-0528:free',
  'qwen/qwen3-8b:free',
  'google/gemma-3-4b-it:free',
  'mistralai/mistral-small-3.1-24b-instruct:free',
]

async function buildKBContext() {
  const articles = await getAllArticles()
  return articles
    .filter((a) => a.content)
    .map((a) => `[Статья: ${a.title}]\n${a.content}`)
    .join('\n\n---\n\n')
}

async function callOpenRouter({ apiKey, model, openaiMessages }) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: openaiMessages,
      max_tokens: 1024,
    }),
  })

  const data = await response.json().catch(() => ({}))
  return { ok: response.ok, status: response.status, data }
}

function isNoEndpointsError(data) {
  const msg = (data?.error?.message || '').toLowerCase()
  return msg.includes('no endpoints found') || msg.includes('no allowed providers')
}

export async function POST(request) {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'OPENROUTER_API_KEY not configured' }, { status: 500 })
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

    const openaiMessages = [
      { role: 'system', content: `${SYSTEM_PROMPT}\n\nБаза знаний:\n${kbContext}` },
      ...messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
    ]

    let lastError = null
    let lastStatus = 500

    for (const model of MODEL_FALLBACKS) {
      const { ok, status, data } = await callOpenRouter({ apiKey, model, openaiMessages })

      if (ok) {
        const text = data.choices?.[0]?.message?.content || ''
        return NextResponse.json({ content: [{ text }] })
      }

      lastError = data.error?.message || `OpenRouter API error: ${status}`
      lastStatus = status

      if (!isNoEndpointsError(data)) {
        break
      }
    }

    return NextResponse.json(
      { error: lastError || 'OpenRouter API error' },
      { status: lastStatus },
    )
  } catch {
    return NextResponse.json({ error: 'Failed to reach OpenRouter API' }, { status: 500 })
  }
}
