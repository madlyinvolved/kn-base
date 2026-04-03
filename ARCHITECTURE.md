# Архитектура проекта: kn-base

## Обзор

Single-page React-приложение без серверного бэкенда. Все данные хранятся в коде (data-модуль). AI-функциональность реализуется через клиентские вызовы Anthropic API.

## Диаграмма компонентов

```
┌─────────────────────────────────────────────────┐
│                    App.jsx                       │
│  ┌─────────────────────────────────────────────┐ │
│  │              Layout.jsx                     │ │
│  │  ┌─────────┐  ┌──────────────────────────┐  │ │
│  │  │ Header  │  │       <main>             │  │ │
│  │  │ (sticky │  │  ┌────────────────────┐  │  │ │
│  │  │  blur)  │  │  │  Breadcrumb.jsx    │  │  │ │
│  │  └─────────┘  │  └────────────────────┘  │  │ │
│  │               │                          │  │ │
│  │               │  view === "home"          │  │ │
│  │               │  ┌────────────────────┐  │  │ │
│  │               │  │ SearchBar.jsx      │  │  │ │
│  │               │  │ SearchResults.jsx  │  │  │ │
│  │               │  │ CategoryGrid.jsx   │  │  │ │
│  │               │  └────────────────────┘  │  │ │
│  │               │                          │  │ │
│  │               │  view === "category"      │  │ │
│  │               │  ┌────────────────────┐  │  │ │
│  │               │  │ ArticleList.jsx    │  │  │ │
│  │               │  └────────────────────┘  │  │ │
│  │               │                          │  │ │
│  │               │  view === "article"       │  │ │
│  │               │  ┌────────────────────┐  │  │ │
│  │               │  │ ArticleView.jsx    │  │  │ │
│  │               │  └────────────────────┘  │  │ │
│  │               └──────────────────────────┘  │ │
│  │  ┌─────────┐                                │ │
│  │  │ Footer  │                                │ │
│  │  └─────────┘                                │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  ┌───────────────────────────────┐  ┌──────────┐ │
│  │       ChatWidget.jsx         │  │ ChatFab  │ │
│  │  ┌─────────────────────────┐ │  │  .jsx    │ │
│  │  │   ChatMessages.jsx     │ │  │ (fixed)  │ │
│  │  │   ChatInput.jsx        │ │  └──────────┘ │
│  │  └─────────────────────────┘ │               │
│  └───────────────────────────────┘               │
└─────────────────────────────────────────────────┘
```

## Потоки данных

```
knowledge-base.js ──→ App.jsx ──→ CategoryGrid / ArticleList / ArticleView
                         │
                         ├──→ useSearch(query) ──→ SearchResults
                         │
                         └──→ useChat(apiKey, articles) ──→ ChatWidget
                                      │
                                      ▼
                              Anthropic API (Claude Sonnet)
                              POST /v1/messages
                              System prompt + KB context
```

## Решения и обоснования

### Почему нет React Router?

Масштаб проекта мал (3 представления), а URL-навигация и deep linking не критичны для внутреннего портала. Состояние `view` в React достаточно. При росте — миграция на React Router тривиальна.

### Почему данные в коде, а не в БД?

14 статей, 5 категорий — объём мал. JSON в коде = zero infrastructure, мгновенная загрузка, простое обновление (PR в Git). На фазе 2 — миграция на внешний JSON или Google Sheets API.

### Почему inline styles, а не CSS Modules / Tailwind?

Прототип в single-file JSX. При декомпозиции рекомендуется мигрировать на CSS Modules или styled-components. CSS-переменные уже подготовлены в `global.css`.

### Почему клиентский вызов API?

MVP без бэкенда. API-ключ вводит администратор при использовании. На фазе 3 — Vercel serverless function как прокси.

## Безопасность

- API-ключ живёт только в React state, теряется при закрытии вкладки
- Не сохраняется в localStorage/cookies
- Заголовок `anthropic-dangerous-direct-browser-access` — осознанное решение для MVP
- На продакшене: serverless proxy + env variable `ANTHROPIC_API_KEY`
