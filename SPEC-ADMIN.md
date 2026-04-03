# Дополнение к ТЗ: Админка и авторизация

**Версия:** 1.1
**Дата:** 03.04.2026
**Основное ТЗ:** [SPEC.md](SPEC.md)

---

## 1. Обзор изменений

Проект расширяется админ-панелью для управления контентом базы знаний. Это влечёт миграцию стека: Vite → Next.js, статические данные → Supabase (БД + Auth + Storage).

### Что добавляется

- Админ-панель с WYSIWYG-редактором статей
- Авторизация (админ / читатель)
- Загрузка изображений и видео
- Управление категориями и статьями через интерфейс
- Управление пользователями (для админов)

### Что НЕ меняется

- Внешний вид портала для читателей (плитки, поиск, чат-бот)
- Дизайн-система (Fraunces + DM Sans, тёплая палитра)
- AI-ассистент (Anthropic API)
- Репозиторий и CI/CD

---

## 2. Новая архитектура

### 2.1 Стек

| Компонент | Было (v1.0) | Стало (v1.1) |
|-----------|-------------|--------------|
| Фреймворк | Vite + React | **Next.js 15 (App Router)** |
| База данных | Массивы в коде | **Supabase PostgreSQL** |
| Авторизация | Нет | **Supabase Auth** |
| Хранилище файлов | Нет | **Supabase Storage** |
| Rich-text редактор | Нет | **TipTap** |
| ORM | Нет | **Supabase JS Client** |
| Хостинг | Vercel | Vercel (без изменений) |
| Стоимость | $0 | **$0** (free tier Supabase) |

### 2.2 Структура проекта

```
kn-base/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Публичные страницы (портал)
│   │   ├── page.jsx              # Главная (категории + поиск)
│   │   ├── category/[id]/page.jsx
│   │   └── article/[id]/page.jsx
│   ├── admin/                    # Админ-панель (защищено)
│   │   ├── layout.jsx            # Layout с сайдбаром + guard
│   │   ├── page.jsx              # Дашборд
│   │   ├── articles/
│   │   │   ├── page.jsx          # Список статей
│   │   │   ├── new/page.jsx      # Создание
│   │   │   └── [id]/edit/page.jsx # Редактирование
│   │   ├── categories/
│   │   │   └── page.jsx          # Управление категориями
│   │   └── users/
│   │       └── page.jsx          # Управление пользователями
│   ├── auth/
│   │   ├── login/page.jsx        # Страница входа
│   │   └── callback/route.js     # OAuth callback
│   ├── api/
│   │   └── chat/route.js         # Прокси для Anthropic API
│   ├── layout.jsx                # Root layout
│   └── globals.css               # CSS-переменные, шрифты
├── components/
│   ├── public/                   # Компоненты портала
│   │   ├── CategoryGrid.jsx
│   │   ├── ArticleView.jsx
│   │   ├── SearchBar.jsx
│   │   ├── ChatWidget.jsx
│   │   └── ...
│   ├── admin/                    # Компоненты админки
│   │   ├── AdminSidebar.jsx
│   │   ├── ArticleEditor.jsx     # TipTap editor
│   │   ├── CategoryForm.jsx
│   │   ├── UserManager.jsx
│   │   └── MediaUploader.jsx
│   └── shared/                   # Общие
│       ├── AuthGuard.jsx
│       └── Breadcrumb.jsx
├── lib/
│   ├── supabase/
│   │   ├── client.js             # Browser client
│   │   ├── server.js             # Server client
│   │   └── middleware.js         # Auth middleware
│   ├── hooks/
│   │   ├── useSearch.js
│   │   └── useChat.js
│   └── utils/
│       └── renderContent.js
├── supabase/
│   └── migrations/               # SQL миграции
│       ├── 001_create_tables.sql
│       └── 002_rls_policies.sql
├── middleware.js                  # Next.js middleware (auth guard)
└── next.config.js
```

### 2.3 Схема базы данных (Supabase PostgreSQL)

```sql
-- Профили пользователей (расширение Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'reader' CHECK (role IN ('admin', 'reader')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Категории
CREATE TABLE categories (
  id TEXT PRIMARY KEY,              -- slug: "newbie", "work" и т.д.
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL DEFAULT '📄',
  color TEXT NOT NULL DEFAULT '#666666',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Статьи
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT,
  content JSONB NOT NULL DEFAULT '{}',  -- TipTap JSON
  content_text TEXT,                     -- Plain text для поиска и чат-бота
  is_published BOOLEAN DEFAULT false,
  author_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Полнотекстовый поиск
CREATE INDEX articles_search_idx ON articles
  USING GIN (to_tsvector('russian', coalesce(title,'') || ' ' || coalesce(summary,'') || ' ' || coalesce(content_text,'')));
```

### 2.4 Row Level Security (RLS)

```sql
-- Категории: все читают, админы пишут
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_read" ON categories FOR SELECT USING (true);
CREATE POLICY "categories_write" ON categories FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Статьи: опубликованные читают все, админы видят и редактируют всё
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "articles_read_published" ON articles FOR SELECT
  USING (is_published = true OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "articles_write" ON articles FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Профили: каждый видит свой, админы видят все
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_read_own" ON profiles FOR SELECT
  USING (id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "profiles_write_admin" ON profiles FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
```

### 2.5 Supabase Storage

```
Bucket: media (public)
├── articles/
│   ├── {article_id}/
│   │   ├── image1.jpg
│   │   └── video-thumb.png
```

Политика: читать — все, загружать/удалять — только админы.

---

## 3. Функциональные требования (новые)

### FR-07: Авторизация

- Страница входа (`/auth/login`) — email + пароль
- Supabase Auth с email provider
- Middleware перенаправляет неавторизованных с `/admin/*` на `/auth/login`
- Портал (публичная часть) доступен без авторизации
- Первый пользователь регистрируется вручную в Supabase Dashboard, ему ставится роль admin
- Админ может создавать новых пользователей и назначать роли

### FR-08: Админ-панель — дашборд

- Статистика: кол-во статей, категорий, опубликованных/черновиков
- Быстрые ссылки: создать статью, управление категориями
- Доступен только пользователям с ролью `admin`

### FR-09: Управление категориями

- Список категорий с drag-and-drop сортировкой
- Создание: название, slug (id), описание, иконка (emoji-picker), цвет
- Редактирование и удаление (с проверкой — нельзя удалить категорию со статьями)

### FR-10: Редактор статей

- WYSIWYG-редактор на базе TipTap с поддержкой:
  - Заголовки (H2, H3)
  - Жирный, курсив, подчёркивание
  - Нумерованные и маркированные списки
  - Таблицы (создание, редактирование, добавление/удаление строк и колонок)
  - Изображения (загрузка в Supabase Storage, вставка по URL)
  - Видео (embed YouTube/Vimeo по URL)
  - Цитаты, разделители, код
  - Внутренние ссылки на другие статьи (выбор из выпадающего списка)
- Поля: заголовок, краткое описание, категория (выпадающий список), контент
- Статус: черновик / опубликовано (toggle)
- Автосохранение черновика каждые 30 секунд
- Предпросмотр статьи как она будет выглядеть на портале
- Кнопки: Сохранить черновик / Опубликовать / Снять с публикации

### FR-11: Список статей (админка)

- Таблица: заголовок, категория, статус, дата обновления, автор
- Фильтры: по категории, по статусу (опубликовано/черновик)
- Поиск по заголовку
- Действия: редактировать, удалить (с подтверждением), изменить статус

### FR-12: Управление пользователями

- Список пользователей: email, имя, роль, дата регистрации
- Смена роли (admin ↔ reader)
- Приглашение нового пользователя (отправка invite через Supabase Auth)
- Нельзя снять роль admin у самого себя (защита от блокировки)

### FR-13: API-прокси для чат-бота

- Серверный route handler `/api/chat`
- Anthropic API ключ в переменной окружения `ANTHROPIC_API_KEY`
- Формирование контекста: загрузка опубликованных статей из БД
- Клиент больше не вводит ключ — чат работает «из коробки»

---

## 4. Миграция данных

При переходе с v1.0 на v1.1 нужен seed-скрипт:

- Перенести 5 категорий и 14 статей из `knowledge-base.js` в Supabase
- Конвертировать plain-text контент в TipTap JSON (или сохранить как plain text на первом этапе, конвертировать позже)
- Создать первого admin-пользователя

---

## 5. Стратегия масштабирования

Архитектура спроектирована для роста:

| Этап | Что добавить | Сложность |
|------|-------------|-----------|
| Сейчас | 2 роли (admin, reader) | Базовый |
| Позже | Роль `editor` (может писать, не может управлять пользователями) | Добавить в CHECK constraint + RLS |
| Позже | Категории по отделам (видны только своим) | Добавить `department` в profiles + RLS |
| Позже | Версионирование статей | Добавить таблицу `article_versions` |
| Позже | Комментарии к статьям | Новая таблица `comments` |
| Позже | Аналитика (просмотры, популярные статьи) | Таблица `article_views` + агрегация |
| Позже | SSO (Google Workspace) | Supabase Auth → Google provider |

Все расширения — это добавление таблиц/политик в Supabase + новые компоненты. Базовая архитектура не меняется.

---

## 6. Переменные окружения

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...    # только серверная, для admin-операций

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# App
NEXT_PUBLIC_APP_URL=https://kn-base.vercel.app
```

---

## 7. Новые задачи

Добавляются как **Milestone 9–12** после существующих M1–M8.

### Milestone 9: Миграция на Next.js

| Task ID | Название | Описание | Приоритет |
|---------|----------|----------|-----------|
| T-030 | Инициализация Next.js | `create-next-app`, перенос стилей, шрифтов, CSS-переменных | 🔴 Critical |
| T-031 | Перенос публичной части | Миграция компонентов портала в `app/(public)/` + `components/public/` | 🔴 Critical |
| T-032 | Подключение Supabase | Создание проекта в Supabase, настройка клиентов (browser + server) | 🔴 Critical |
| T-033 | Миграции БД | SQL: таблицы categories, articles, profiles + RLS-политики + индексы | 🔴 Critical |
| T-034 | Seed данных | Скрипт переноса 5 категорий + 14 статей из JS в Supabase | 🟠 High |
| T-035 | Переключение портала на БД | Компоненты читают данные из Supabase вместо JS-модуля | 🔴 Critical |

### Milestone 10: Авторизация

| Task ID | Название | Описание | Приоритет |
|---------|----------|----------|-----------|
| T-036 | Настройка Supabase Auth | Email provider, создание первого admin-пользователя | 🔴 Critical |
| T-037 | Страница логина | `/auth/login` — форма email+пароль, обработка ошибок | 🔴 Critical |
| T-038 | Auth middleware | `middleware.js` — защита `/admin/*`, редирект на логин | 🔴 Critical |
| T-039 | AuthGuard компонент | Проверка роли admin на клиенте, fallback для reader | 🟠 High |
| T-040 | Профили пользователей | Триггер auto-create profile при регистрации, sync email | 🟠 High |

### Milestone 11: Админ-панель

| Task ID | Название | Описание | Приоритет |
|---------|----------|----------|-----------|
| T-041 | Layout админки | Сайдбар с навигацией, хедер с именем пользователя и выходом | 🔴 Critical |
| T-042 | Дашборд | Статистика: кол-во статей/категорий/черновиков, быстрые действия | 🟠 High |
| T-043 | Управление категориями | CRUD: создание, редактирование, удаление, сортировка | 🟠 High |
| T-044 | Список статей | Таблица с фильтрами, поиском, действиями, статусами | 🟠 High |
| T-045 | Редактор статей — TipTap | Подключение TipTap, toolbar, форматирование текста, таблицы | 🔴 Critical |
| T-046 | Загрузка медиа | Supabase Storage: upload изображений, вставка в редактор | 🟠 High |
| T-047 | Embed видео | Расширение TipTap: вставка YouTube/Vimeo по URL | 🟡 Medium |
| T-048 | Внутренние ссылки в редакторе | Расширение TipTap: выбор статьи из dropdown, вставка ссылки | 🟡 Medium |
| T-049 | Предпросмотр статьи | Модальное окно / боковая панель с рендером как на портале | 🟡 Medium |
| T-050 | Автосохранение | Debounced save черновика каждые 30 секунд | 🟡 Medium |
| T-051 | Управление пользователями | Список, смена ролей, invite нового пользователя | 🟠 High |

### Milestone 12: Интеграция и деплой

| Task ID | Название | Описание | Приоритет |
|---------|----------|----------|-----------|
| T-052 | API-прокси чат-бота | `/api/chat` — серверный route, загрузка статей из БД, Anthropic API | 🟠 High |
| T-053 | Обновление чат-виджета | Убрать ввод API-ключа, переключить на `/api/chat` | 🟠 High |
| T-054 | Тесты админки | Unit + component тесты: CRUD категорий, статей, авторизация | 🟠 High |
| T-055 | E2E тесты админки | Playwright: логин → создать статью → опубликовать → проверить на портале | 🟡 Medium |
| T-056 | Деплой v1.1 | Vercel env vars, Supabase production, миграции, seed | 🟠 High |

---

## 8. Порядок выполнения

```
M9 (Next.js миграция)
 └── M10 (Авторизация)
      └── M11 (Админ-панель)
           └── M12 (Интеграция + деплой)
```

M9 и M10 можно частично параллелить (T-032..T-033 + T-036).
M11 — самый объёмный, но задачи внутри независимы после T-041.
M12 — финальная сборка.

---

## 9. Критерии приёмки (дополнение)

Всё из v1.0 плюс:

- Админ может войти по email+пароль
- Неавторизованный пользователь не видит `/admin/*`
- Пользователь с ролью `reader` не видит `/admin/*`
- Админ может создать/отредактировать/удалить категорию
- Админ может создать статью в WYSIWYG-редакторе с таблицами, картинками и видео
- Статья в статусе «черновик» не видна на портале
- Статья в статусе «опубликовано» появляется на портале
- Чат-бот отвечает по опубликованным статьям без ввода API-ключа
- Админ может изменить роль другого пользователя
- Всё работает на бесплатном тарифе Supabase + Vercel
