import { useMemo } from 'react'

export function useSearch(query, articles) {
  return useMemo(() => {
    if (!query || !query.trim()) return []
    const q = query.toLowerCase()
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        (a.content && a.content.toLowerCase().includes(q)),
    )
  }, [query, articles])
}
