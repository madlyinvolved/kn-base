import { getCategories, getArticleCount, getAllArticles } from '../../lib/data/queries.js'
import HomeClient from './HomeClient.jsx'

export default async function HomePage() {
  const categories = await getCategories()

  const counts = {}
  for (const cat of categories) {
    counts[cat.id] = await getArticleCount(cat.id)
  }

  const articles = await getAllArticles()

  return <HomeClient categories={categories} articleCounts={counts} articles={articles} />
}
