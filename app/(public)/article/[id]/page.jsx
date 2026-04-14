import { notFound } from 'next/navigation'
import {
  getArticleById,
  getCategoryById,
  getArticlesByCategory,
  getAllArticles,
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
  const nextArticle =
    currentIndex >= 0 && currentIndex < allInCategory.length - 1
      ? allInCategory[currentIndex + 1]
      : null
  const categoryArticleCount = allInCategory.length

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
        categoryArticleCount={categoryArticleCount}
      />
    </>
  )
}
