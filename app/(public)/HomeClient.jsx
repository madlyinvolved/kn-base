'use client'

import { useState } from 'react'
import CategoryGrid from '../../components/public/CategoryGrid.jsx'
import SearchBar from '../../components/public/SearchBar.jsx'
import SearchResults from '../../components/public/SearchResults.jsx'
import { useSearch } from '../../lib/hooks/useSearch.js'

export default function HomeClient({ categories, articleCounts, articles }) {
  const [query, setQuery] = useState('')
  const results = useSearch(query, articles)

  return (
    <>
      <section className="hero">
        <h1>База знаний AdCorp</h1>
        <p>Найдите ответы на любые вопросы о работе в компании</p>
      </section>

      <SearchBar value={query} onChange={setQuery} />

      {query.trim() ? (
        <SearchResults results={results} query={query} categories={categories} />
      ) : (
        <CategoryGrid categories={categories} articleCounts={articleCounts} />
      )}
    </>
  )
}
