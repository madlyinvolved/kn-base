# kn-base — База знаний AdCorp

Внутренний портал базы знаний для сотрудников компании AdCorp. Плиточный интерфейс с поиском и AI-ассистентом на основе Claude.

## Быстрый старт

```bash
# Клонировать репозиторий
git clone https://github.com/madlyinvolved/kn-base.git
cd kn-base

# Установить зависимости
npm install

# Запустить dev-сервер
npm run dev
```

Портал будет доступен на `http://localhost:5173`

## Структура проекта

```
kn-base/
├── docs/                       # Документация проекта
│   ├── SPEC.md                 # Техническое задание
│   ├── BACKLOG.md              # Бэклог задач
│   ├── ARCHITECTURE.md         # Архитектура
│   ├── TESTING.md              # Стратегия тестирования
│   ├── CONTENT-GUIDE.md        # Руководство по наполнению
│   └── REVIEW-CHECKLIST.md     # Чеклист ревью
├── src/
│   ├── data/                   # Данные базы знаний
│   ├── components/             # React-компоненты
│   ├── hooks/                  # Кастомные хуки
│   ├── styles/                 # Глобальные стили
│   ├── utils/                  # Утилиты
│   ├── App.jsx
│   └── main.jsx
├── e2e/                        # E2E-тесты (Playwright)
├── .github/workflows/          # CI/CD
└── package.json
```

## Документация

| Документ                                        | Описание                        |
| ----------------------------------------------- | ------------------------------- |
| [SPEC.md](docs/SPEC.md)                         | Полное ТЗ с разбивкой на задачи |
| [BACKLOG.md](docs/BACKLOG.md)                   | Бэклог с трекингом статусов     |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md)         | Архитектура и решения           |
| [TESTING.md](docs/TESTING.md)                   | Стратегия тестирования          |
| [CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md)       | Как добавлять статьи            |
| [REVIEW-CHECKLIST.md](docs/REVIEW-CHECKLIST.md) | Чеклист для PR-ревью            |

## Скрипты

```bash
npm run dev          # Dev-сервер
npm run build        # Production-сборка
npm run preview      # Превью production-сборки
npm run lint         # ESLint
npm run test         # Vitest (unit + component)
npm run test:e2e     # Playwright E2E
```

## Стек

- **Vite 6** + **React 19** — сборка и UI
- **Fraunces** + **DM Sans** — типографика
- **Anthropic Claude Sonnet** — AI-ассистент
- **Vitest** + **React Testing Library** — тесты
- **Playwright** — E2E
- **Vercel** — деплой

## Добавление контента

См. [CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md). Кратко: добавь объект в массив `ARTICLES` в `src/data/knowledge-base.js`, закоммить и запуши.

## Лицензия

Проприетарный. Только для внутреннего использования AdCorp.
