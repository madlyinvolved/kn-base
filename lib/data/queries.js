import {
  CATEGORIES,
  ARTICLES,
  getCategoryById as staticGetCategory,
  getArticlesByCategory as staticGetByCategory,
  getArticleById as staticGetArticle,
  getArticleCount as staticGetCount,
} from './knowledge-base.js'

/**
 * Tries to create a Supabase server client.
 * Returns null if env vars are missing or import fails.
 */
async function getSupabase() {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return null
    }
    const { createClient } = await import('../supabase/server.js')
    return await createClient()
  } catch {
    return null
  }
}

export async function getCategories() {
  const supabase = await getSupabase()
  if (supabase) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order')
    if (!error && data?.length) {
      return data.map((c) => ({
        id: c.id,
        name: c.name,
        icon: c.icon,
        color: c.color,
        desc: c.description,
      }))
    }
  }
  return CATEGORIES
}

export async function getCategoryById(id) {
  const supabase = await getSupabase()
  if (supabase) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()
    if (!error && data) {
      return { id: data.id, name: data.name, icon: data.icon, color: data.color, desc: data.description }
    }
  }
  return staticGetCategory(id)
}

export async function getArticlesByCategory(categoryId) {
  const supabase = await getSupabase()
  if (supabase) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_published', true)
      .order('id')
    if (!error && data?.length) {
      return data.map(mapArticle)
    }
  }
  return staticGetByCategory(categoryId)
}

export async function getArticleById(id) {
  const supabase = await getSupabase()
  if (supabase) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single()
    if (!error && data) {
      return mapArticle(data)
    }
  }
  return staticGetArticle(id)
}

export async function getArticleCount(categoryId) {
  const supabase = await getSupabase()
  if (supabase) {
    const { count, error } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', categoryId)
      .eq('is_published', true)
    if (!error && count != null) {
      return count
    }
  }
  return staticGetCount(categoryId)
}

export async function getAllArticles() {
  const supabase = await getSupabase()
  if (supabase) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('is_published', true)
      .order('id')
    if (!error && data?.length) {
      return data.map(mapArticle)
    }
  }
  return ARTICLES
}

export async function searchArticles(query) {
  const supabase = await getSupabase()
  if (supabase && query?.trim()) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('is_published', true)
      .textSearch('content_text', query, { type: 'websearch', config: 'russian' })
    if (!error && data) {
      return data.map(mapArticle)
    }
  }
  // Fallback: client-side filter
  const q = query?.toLowerCase() || ''
  return ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      (a.content && a.content.toLowerCase().includes(q)),
  )
}

function mapArticle(row) {
  const contentJson =
    row.content && typeof row.content === 'object' && row.content.type === 'doc'
      ? row.content
      : null
  return {
    id: row.id,
    category: row.category_id,
    title: row.title,
    summary: row.summary,
    content: row.content_text || '',
    contentJson,
  }
}
