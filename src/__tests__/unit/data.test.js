import { describe, it, expect } from 'vitest'
import {
  CATEGORIES,
  ARTICLES,
  getCategoryById,
  getArticlesByCategory,
  getArticleById,
  getArticleCount,
} from '../../data/knowledge-base.js'

describe('Knowledge Base Data Integrity', () => {
  it('has 5 categories', () => {
    expect(CATEGORIES).toHaveLength(5)
  })

  it('has 14 articles', () => {
    expect(ARTICLES).toHaveLength(14)
  })

  it('all articles have unique ids', () => {
    const ids = ARTICLES.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all categories have unique ids', () => {
    const ids = CATEGORIES.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all articles reference an existing category', () => {
    const categoryIds = CATEGORIES.map((c) => c.id)
    ARTICLES.forEach((article) => {
      expect(categoryIds).toContain(article.category)
    })
  })

  it('all categories have required fields', () => {
    CATEGORIES.forEach((cat) => {
      expect(cat).toHaveProperty('id')
      expect(cat).toHaveProperty('name')
      expect(cat).toHaveProperty('icon')
      expect(cat).toHaveProperty('color')
      expect(cat).toHaveProperty('desc')
      expect(cat.name).toBeTruthy()
    })
  })

  it('all articles have required fields', () => {
    ARTICLES.forEach((article) => {
      expect(article).toHaveProperty('id')
      expect(article).toHaveProperty('category')
      expect(article).toHaveProperty('title')
      expect(article).toHaveProperty('summary')
      expect(article).toHaveProperty('content')
      expect(article.title).toBeTruthy()
    })
  })

  it('no article has empty content', () => {
    ARTICLES.forEach((article) => {
      expect(article.content.length).toBeGreaterThan(0)
    })
  })
})

describe('Helper Functions', () => {
  it('getCategoryById returns correct category', () => {
    const cat = getCategoryById('work')
    expect(cat).toBeDefined()
    expect(cat.name).toBe('Организация работы')
  })

  it('getCategoryById returns undefined for invalid id', () => {
    expect(getCategoryById('nonexistent')).toBeUndefined()
  })

  it('getArticlesByCategory returns correct articles', () => {
    const articles = getArticlesByCategory('newbie')
    expect(articles).toHaveLength(2)
    articles.forEach((a) => expect(a.category).toBe('newbie'))
  })

  it('getArticleById returns correct article', () => {
    const article = getArticleById(1)
    expect(article).toBeDefined()
    expect(article.title).toBe('Добро пожаловать!')
  })

  it('getArticleCount returns correct count', () => {
    expect(getArticleCount('work')).toBe(6)
    expect(getArticleCount('feedback')).toBe(1)
  })
})
