import { useMemo } from 'react'

/**
 * Full-text search hook for articles
 * Implementation in T-009
 */
export function useSearch(query, articles) {
  return useMemo(() => {
    if (!query || !query.trim()) return []
    const q = query.toLowerCase()
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q),
    )
  }, [query, articles])
}
