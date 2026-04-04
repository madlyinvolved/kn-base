import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useSearch } from '../../hooks/useSearch.js'
import { ARTICLES } from '../../data/knowledge-base.js'

describe('useSearch', () => {
  it('returns empty array for empty query', () => {
    const { result } = renderHook(() => useSearch('', ARTICLES))
    expect(result.current).toEqual([])
  })

  it('returns empty array for whitespace query', () => {
    const { result } = renderHook(() => useSearch('   ', ARTICLES))
    expect(result.current).toEqual([])
  })

  it('finds article by title', () => {
    const { result } = renderHook(() => useSearch('Добро пожаловать', ARTICLES))
    expect(result.current.length).toBeGreaterThan(0)
    expect(result.current[0].title).toBe('Добро пожаловать!')
  })

  it('finds article by content', () => {
    const { result } = renderHook(() => useSearch('отпуск', ARTICLES))
    expect(result.current.length).toBeGreaterThan(0)
  })

  it('search is case-insensitive', () => {
    const { result } = renderHook(() => useSearch('ЗАРПЛАТА', ARTICLES))
    expect(result.current.length).toBeGreaterThan(0)
  })

  it('finds by partial match', () => {
    const { result } = renderHook(() => useSearch('сервис', ARTICLES))
    expect(result.current.length).toBeGreaterThan(0)
  })

  it('returns empty for non-matching query', () => {
    const { result } = renderHook(() => useSearch('xyznonexistent123', ARTICLES))
    expect(result.current).toEqual([])
  })
})
