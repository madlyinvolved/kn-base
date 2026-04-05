import { describe, it, expect, vi } from 'vitest'
import { renderContent } from '../../lib/utils/renderContent.jsx'

describe('renderContent', () => {
  it('returns plain text unchanged', () => {
    const result = renderContent('Hello world', vi.fn())
    expect(result).toBe('Hello world')
  })

  it('returns null/undefined as-is', () => {
    expect(renderContent(null, vi.fn())).toBeNull()
    expect(renderContent(undefined, vi.fn())).toBeUndefined()
  })

  it('parses [[id|text]] links', () => {
    const onClick = vi.fn()
    const result = renderContent('See [[5|Структура компании]] for details', onClick)

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(3)
    expect(result[0]).toBe('See ')
    expect(result[2]).toBe(' for details')
  })

  it('handles multiple links', () => {
    const onClick = vi.fn()
    const result = renderContent('[[1|Link1]] and [[2|Link2]]', onClick)

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(3)
  })

  it('text without links returns string', () => {
    const result = renderContent('No links here', vi.fn())
    expect(typeof result).toBe('string')
  })
})
