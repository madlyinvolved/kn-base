/**
 * Seed script for Supabase database.
 *
 * Usage:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node supabase/seed/seed.js
 *
 * Uses the admin (service role) client to bypass RLS.
 */

import { createClient } from '@supabase/supabase-js'
import { CATEGORIES, ARTICLES } from '../../lib/data/knowledge-base.js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function seed() {
  console.log('Seeding categories...')

  const categoryRows = CATEGORIES.map((cat, index) => ({
    id: cat.id,
    name: cat.name,
    description: cat.desc,
    icon: cat.icon,
    color: cat.color,
    sort_order: index,
  }))

  const { error: catError } = await supabase
    .from('categories')
    .upsert(categoryRows, { onConflict: 'id' })

  if (catError) {
    console.error('Error seeding categories:', catError.message)
    process.exit(1)
  }
  console.log(`  ${categoryRows.length} categories upserted.`)

  console.log('Seeding articles...')

  const articleRows = ARTICLES.map((article) => ({
    id: article.id,
    category_id: article.category,
    title: article.title,
    summary: article.summary,
    content: {},
    content_text: article.content || '',
    is_published: true,
  }))

  const { error: artError } = await supabase
    .from('articles')
    .upsert(articleRows, { onConflict: 'id' })

  if (artError) {
    console.error('Error seeding articles:', artError.message)
    process.exit(1)
  }
  console.log(`  ${articleRows.length} articles upserted.`)

  console.log('Seed complete!')
}

seed()
