import { notFound } from 'next/navigation'
import { getCategoryById, getArticlesByCategory, getCategories } from '../../../../lib/data/queries.js'
import ArticleList from '../../../../components/public/ArticleList.jsx'
import Breadcrumb from '../../../../components/shared/Breadcrumb.jsx'

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((cat) => ({ id: cat.id }))
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const category = await getCategoryById(id)
  if (!category) return {}
  return { title: `${category.name} — База знаний AdCorp` }
}

export default async function CategoryPage({ params }) {
  const { id } = await params
  const category = await getCategoryById(id)
  if (!category) notFound()

  const articles = await getArticlesByCategory(id)

  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: category.name },
  ]

  return (
    <>
      <Breadcrumb items={breadcrumbs} />
      <ArticleList category={category} articles={articles} />
    </>
  )
}
