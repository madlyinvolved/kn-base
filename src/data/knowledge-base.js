/**
 * Knowledge base data module
 * Single source of truth for categories and articles
 */

export const CATEGORIES = [
  {
    id: 'newbie',
    name: 'Новому сотруднику',
    icon: '👋',
    color: '#e85d2a',
    desc: 'Первые шаги в компании',
  },
  {
    id: 'company',
    name: 'О компании',
    icon: '🏢',
    color: '#2a7de8',
    desc: 'Чем мы занимаемся и как устроены',
  },
  {
    id: 'work',
    name: 'Организация работы',
    icon: '⚙️',
    color: '#7c3aed',
    desc: 'График, зарплата, отпуска и сервисы',
  },
  {
    id: 'life',
    name: 'Корпоративная жизнь',
    icon: '🎉',
    color: '#059669',
    desc: 'Сообщества, каналы, активности',
  },
  {
    id: 'feedback',
    name: 'Обратная связь',
    icon: '💬',
    color: '#d97706',
    desc: 'Как поделиться мнением',
  },
]

export const ARTICLES = [
  {
    id: 1,
    category: 'newbie',
    title: 'Добро пожаловать!',
    summary: 'Первый день в AdCorp — что нужно знать',
    content: '',
  },
  {
    id: 2,
    category: 'newbie',
    title: 'Полезные контакты',
    summary: 'К кому обращаться по разным вопросам',
    content: '',
  },
  {
    id: 3,
    category: 'company',
    title: 'Чем занимается компания',
    summary: 'Наши продукты и направления',
    content: '',
  },
  {
    id: 4,
    category: 'company',
    title: 'Как работает реклама',
    summary: 'Основы рекламного бизнеса простым языком',
    content: '',
  },
  {
    id: 5,
    category: 'company',
    title: 'Структура компании',
    summary: 'Бренды, команды и кто за что отвечает',
    content: '',
  },
  {
    id: 6,
    category: 'work',
    title: 'График и режим работы',
    summary: 'Рабочее время, гибкий график, удалёнка',
    content: '',
  },
  {
    id: 7,
    category: 'work',
    title: 'Зарплата и выплаты',
    summary: 'Даты выплат, бонусы, оформление',
    content: '',
  },
  {
    id: 8,
    category: 'work',
    title: 'Отпуска, отгулы, удалёнка',
    summary: 'Как оформить отпуск или отгул',
    content: '',
  },
  {
    id: 9,
    category: 'work',
    title: 'Рабочее место и заявки в АХО',
    summary: 'Техника, канцелярия и хозяйственные вопросы',
    content: '',
  },
  {
    id: 10,
    category: 'work',
    title: 'Сервисы для работы',
    summary: 'Инструменты и доступы',
    content: '',
  },
  {
    id: 11,
    category: 'work',
    title: 'Переговорки и видеоконференции',
    summary: 'Бронирование и настройка связи',
    content: '',
  },
  {
    id: 12,
    category: 'life',
    title: 'Сообщества и клубы',
    summary: 'Спорт, игры и активности',
    content: '',
  },
  {
    id: 13,
    category: 'life',
    title: 'Общие каналы в Slack',
    summary: 'Полезные каналы для общения',
    content: '',
  },
  {
    id: 14,
    category: 'feedback',
    title: 'Как дать обратную связь',
    summary: 'Каналы обратной связи и анонимные опросы',
    content: '',
  },
]

/**
 * Helper: get category by id
 */
export function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id)
}

/**
 * Helper: get articles by category id
 */
export function getArticlesByCategory(categoryId) {
  return ARTICLES.filter((a) => a.category === categoryId)
}

/**
 * Helper: get article by id
 */
export function getArticleById(id) {
  return ARTICLES.find((a) => a.id === id)
}

/**
 * Helper: get article count for a category
 */
export function getArticleCount(categoryId) {
  return ARTICLES.filter((a) => a.category === categoryId).length
}
