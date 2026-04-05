import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useSearch } from '../../lib/hooks/useSearch.js'
import { ARTICLES } from '../../lib/data/knowledge-base.js'

describe('useSearch', () => {
  it('returns empty array for empty query', () => {
    const { result } = renderHook(() => useSearch('', ARTICLES))
    expect(result.current).toEqual([])
  })

  it('finds articles by title', () => {
    const { result } = renderHook(() => useSearch('зарплата', ARTICLES))
    expect(result.current.length).toBeGreaterThan(0)
    expect(result.current.some((a) => a.title.includes('Зарплата'))).toBe(true)
  })

  it('finds articles by content', () => {
    const { result } = renderHook(() => useSearch('ClickAdilla', ARTICLES))
    expect(result.current.length).toBeGreaterThan(0)
  })

  it('returns empty for nonexistent query', () => {
    const { result } = renderHook(() => useSearch('xyznonexistent123', ARTICLES))
    expect(result.current).toEqual([])
  })

  it('is case insensitive', () => {
    const { result } = renderHook(() => useSearch('ЗАРПЛАТА', ARTICLES))
    expect(result.current.length).toBeGreaterThan(0)
  })
})
