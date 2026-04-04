import { describe, it, expect, vi } from 'vitest'
import { renderContent } from '../../utils/renderContent.jsx'

describe('renderContent', () => {
  it('returns plain text as-is when no links', () => {
    const result = renderContent('Hello world', vi.fn())
    expect(result).toBe('Hello world')
  })

  it('returns falsy value as-is', () => {
    expect(renderContent('', vi.fn())).toBe('')
    expect(renderContent(null, vi.fn())).toBeNull()
    expect(renderContent(undefined, vi.fn())).toBeUndefined()
  })

  it('parses [[id|text]] into clickable element', () => {
    const onClick = vi.fn()
    const result = renderContent('See [[10|Сервисы для работы]] here', onClick)
    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(3)
    expect(result[0]).toBe('See ')
    expect(result[2]).toBe(' here')
    // The middle element is a React element (span)
    expect(result[1].props.children).toBe('Сервисы для работы')
  })

  it('handles multiple links in one text', () => {
    const onClick = vi.fn()
    const result = renderContent('A [[1|First]] and [[2|Second]] end', onClick)
    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(5)
    expect(result[0]).toBe('A ')
    expect(result[1].props.children).toBe('First')
    expect(result[2]).toBe(' and ')
    expect(result[3].props.children).toBe('Second')
    expect(result[4]).toBe(' end')
  })

  it('handles link at start of text', () => {
    const onClick = vi.fn()
    const result = renderContent('[[5|Link]] after', onClick)
    expect(Array.isArray(result)).toBe(true)
    expect(result[0].props.children).toBe('Link')
    expect(result[1]).toBe(' after')
  })

  it('handles link at end of text', () => {
    const onClick = vi.fn()
    const result = renderContent('Before [[5|Link]]', onClick)
    expect(Array.isArray(result)).toBe(true)
    expect(result[0]).toBe('Before ')
    expect(result[1].props.children).toBe('Link')
  })
})
