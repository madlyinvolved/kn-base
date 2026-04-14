import { notFound } from 'next/navigation'
import {
  getArticleById,
  getCategoryById,
  getArticlesByCategory,
  getAllArticles,
  getCategories,
} from '../../../../lib/data/queries.js'
import ArticleView from '../../../../components/public/ArticleView.jsx'
import Breadcrumb from '../../../../components/shared/Breadcrumb.jsx'

export async function generateStaticParams() {
  const articles = await getAllArticles()
  return articles.map((a) => ({ id: String(a.id) }))
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const article = await getArticleById(Number(id))
  if (!article) return {}
  return { title: `${article.title} — База знаний AdCorp` }
}

export default async function ArticlePage({ params }) {
  const { id } = await params
  const article = await getArticleById(Number(id))
  if (!article) notFound()

  const category = await getCategoryById(article.category)
  if (!category) notFound()

  const allInCategory = await getArticlesByCategory(article.category)
  const currentIndex = allInCategory.findIndex((a) => a.id === article.id)
  const isLastInCategory =
    currentIndex >= 0 && currentIndex === allInCategory.length - 1
  const nextArticle = !isLastInCategory && currentIndex >= 0
    ? allInCategory[currentIndex + 1]
    : null
  const categoryArticleCount = allInCategory.length

  let nextCategory = null
  if (isLastInCategory) {
    const categories = await getCategories()
    const catIdx = categories.findIndex((c) => c.id === category.id)
    if (catIdx >= 0 && catIdx < categories.length - 1) {
      nextCategory = categories[catIdx + 1]
    }
  }

  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: category.name, href: `/category/${category.id}` },
    { label: article.title },
  ]

  return (
    <>
      <Breadcrumb items={breadcrumbs} />
      <ArticleView
        article={article}
        category={category}
        nextArticle={nextArticle}
        nextCategory={nextCategory}
        isLastInCategory={isLastInCategory}
        categoryArticleCount={categoryArticleCount}
      />
    </>
  )
}
