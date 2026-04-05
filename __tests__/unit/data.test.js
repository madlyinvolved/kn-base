import { describe, it, expect } from 'vitest'
import {
  CATEGORIES,
  ARTICLES,
  getCategoryById,
  getArticlesByCategory,
  getArticleById,
  getArticleCount,
} from '../../lib/data/knowledge-base.js'

describe('Knowledge Base Data', () => {
  it('has 5 categories', () => {
    expect(CATEGORIES).toHaveLength(5)
  })

  it('has 14 articles', () => {
    expect(ARTICLES).toHaveLength(14)
  })

  it('all articles have required fields', () => {
    ARTICLES.forEach((article) => {
      expect(article).toHaveProperty('id')
      expect(article).toHaveProperty('category')
      expect(article).toHaveProperty('title')
      expect(article).toHaveProperty('summary')
      expect(article).toHaveProperty('content')
      expect(article.content.length).toBeGreaterThan(0)
    })
  })

  it('all article categories exist', () => {
    const catIds = CATEGORIES.map((c) => c.id)
    ARTICLES.forEach((article) => {
      expect(catIds).toContain(article.category)
    })
  })

  it('getCategoryById returns correct category', () => {
    expect(getCategoryById('newbie').name).toBe('Новому сотруднику')
    expect(getCategoryById('nonexistent')).toBeUndefined()
  })

  it('getArticlesByCategory returns filtered articles', () => {
    const newbieArticles = getArticlesByCategory('newbie')
    expect(newbieArticles.length).toBe(2)
    newbieArticles.forEach((a) => expect(a.category).toBe('newbie'))
  })

  it('getArticleById returns correct article', () => {
    const article = getArticleById(1)
    expect(article.title).toBe('Добро пожаловать!')
    expect(getArticleById(999)).toBeUndefined()
  })

  it('getArticleCount returns correct count', () => {
    expect(getArticleCount('newbie')).toBe(2)
    expect(getArticleCount('company')).toBe(3)
    expect(getArticleCount('work')).toBe(6)
    expect(getArticleCount('life')).toBe(2)
    expect(getArticleCount('feedback')).toBe(1)
  })
})
