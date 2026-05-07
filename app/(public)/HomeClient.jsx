'use client'

import { useState } from 'react'
import Link from 'next/link'
import CategoryGrid from '../../components/public/CategoryGrid.jsx'
import SearchBar from '../../components/public/SearchBar.jsx'
import SearchResults from '../../components/public/SearchResults.jsx'
import { useSearch } from '../../lib/hooks/useSearch.js'

const discountsBannerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '14px 20px',
  background: '#FAECE7',
  border: '1px solid #F5C4B3',
  borderRadius: '12px',
  textDecoration: 'none',
  color: '#993C1D',
  marginTop: '24px',
  transition: 'all var(--transition-fast)',
}

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
        <>
          <CategoryGrid categories={categories} articleCounts={articleCounts} />
          <Link
            href="/discounts"
            style={discountsBannerStyle}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
          >
            <span style={{ fontSize: '1.5rem' }}>🏷️</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Корпоративные скидки</div>
              <div style={{ fontSize: '0.8125rem', opacity: 0.8 }}>Скидки от партнёров для сотрудников</div>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: '1.25rem' }}>→</span>
          </Link>
        </>
      )}
    </>
  )
}
