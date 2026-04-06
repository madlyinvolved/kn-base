-- ===========================================
-- Seed: Categories (5) + Articles (14)
-- Generated from lib/data/knowledge-base.js
-- Content includes TipTap JSON in content column
-- Safe to re-run (uses ON CONFLICT upsert)
-- ===========================================

-- Categories
INSERT INTO categories (id, name, description, icon, color, sort_order) VALUES
  ('newbie', 'Новому сотруднику', 'Первые шаги в компании', '👋', '#e85d2a', 0),
  ('company', 'О компании', 'Чем мы занимаемся и как устроены', '🏢', '#2a7de8', 1),
  ('work', 'Организация работы', 'График, зарплата, отпуска и сервисы', '⚙️', '#7c3aed', 2),
  ('life', 'Корпоративная жизнь', 'Сообщества, каналы, активности', '🎉', '#059669', 3),
  ('feedback', 'Обратная связь', 'Как поделиться мнением', '💬', '#d97706', 4)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  sort_order = EXCLUDED.sort_order;

-- Articles
INSERT INTO articles (id, category_id, title, summary, content, content_text, is_published) VALUES (
  1,
  'newbie',
  'Добро пожаловать!',
  'Первый день в AdCorp — что нужно знать',
  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Добро пожаловать в AdCorp! Мы рады, что ты с нами 🎉"}]},{"type":"paragraph","content":[{"type":"text","text":"📌 Что сделать в первый день:"}]},{"type":"paragraph","content":[{"type":"text","text":"• Получить ноутбук и настроить рабочее место — обратись к системному администратору (@Kirill Shakhov в Slack)"},{"type":"hardBreak"},{"type":"text","text":"• Получить доступы к рабочим сервисам — подробнее в карточке "},{"type":"text","text":"Сервисы для работы","marks":[{"type":"link","attrs":{"href":"/article/10","target":null,"class":null}}]},{"type":"hardBreak"},{"type":"text","text":"• Познакомиться с командой — твой руководитель представит тебя коллегам"},{"type":"hardBreak"},{"type":"text","text":"• Подписаться на основные каналы в Slack — список в карточке "},{"type":"text","text":"Общие каналы в Slack","marks":[{"type":"link","attrs":{"href":"/article/13","target":null,"class":null}}]},{"type":"hardBreak"},{"type":"text","text":"• Прочитать про компанию — "},{"type":"text","text":"Чем занимается компания","marks":[{"type":"link","attrs":{"href":"/article/3","target":null,"class":null}}]},{"type":"text","text":" и "},{"type":"text","text":"Структура компании","marks":[{"type":"link","attrs":{"href":"/article/5","target":null,"class":null}}]}]},{"type":"paragraph","content":[{"type":"text","text":"📌 Что сделать в первую неделю:"}]},{"type":"paragraph","content":[{"type":"text","text":"• Изучить раздел "},{"type":"text","text":"График и режим работы","marks":[{"type":"link","attrs":{"href":"/article/6","target":null,"class":null}}]},{"type":"text","text":" — чтобы понимать рабочий распорядок"},{"type":"hardBreak"},{"type":"text","text":"• Разобраться с "},{"type":"text","text":"Зарплата и выплаты","marks":[{"type":"link","attrs":{"href":"/article/7","target":null,"class":null}}]},{"type":"text","text":" — даты, способы получения"},{"type":"hardBreak"},{"type":"text","text":"• Познакомиться с "},{"type":"text","text":"Сообщества и клубы","marks":[{"type":"link","attrs":{"href":"/article/12","target":null,"class":null}}]},{"type":"text","text":" — у нас много активностей!"},{"type":"hardBreak"},{"type":"text","text":"• Сохранить "},{"type":"text","text":"Полезные контакты","marks":[{"type":"link","attrs":{"href":"/article/2","target":null,"class":null}}]},{"type":"text","text":" — пригодятся"}]},{"type":"paragraph","content":[{"type":"text","text":"⚠️ Если что-то непонятно — не стесняйся спрашивать. У нас дружная команда, и все понимают, что первое время нужно освоиться."}]},{"type":"paragraph","content":[{"type":"text","text":"Хорошего старта! 🚀"}]}]}'::jsonb,
  'Добро пожаловать в AdCorp! Мы рады, что ты с нами 🎉

📌 Что сделать в первый день:

• Получить ноутбук и настроить рабочее место — обратись к системному администратору (@Kirill Shakhov в Slack)
• Получить доступы к рабочим сервисам — подробнее в карточке [[10|Сервисы для работы]]
• Познакомиться с командой — твой руководитель представит тебя коллегам
• Подписаться на основные каналы в Slack — список в карточке [[13|Общие каналы в Slack]]
• Прочитать про компанию — [[3|Чем занимается компания]] и [[5|Структура компании]]

📌 Что сделать в первую неделю:

• Изучить раздел [[6|График и режим работы]] — чтобы понимать рабочий распорядок
• Разобраться с [[7|Зарплата и выплаты]] — даты, способы получения
• Познакомиться с [[12|Сообщества и клубы]] — у нас много активностей!
• Сохранить [[2|Полезные контакты]] — пригодятся

⚠️ Если что-то непонятно — не стесняйся спрашивать. У нас дружная команда, и все понимают, что первое время нужно освоиться.

Хорошего старта! 🚀',
  true
)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  content_text = EXCLUDED.content_text,
  is_published = EXCLUDED.is_published;

INSERT INTO articles (id, category_id, title, summary, content, content_text, is_published) VALUES (
  2,
  'newbie',
  'Полезные контакты',
  'К кому обращаться по разным вопросам',
  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Здесь собраны контакты людей, к которым можно обращаться по различным вопросам."}]},{"type":"paragraph","content":[{"type":"text","text":"👩‍💼 HR и кадровые вопросы:"},{"type":"hardBreak"},{"type":"text","text":"• @Anna Leonova — оформление, отпуска, больничные, справки, адаптация новых сотрудников"},{"type":"hardBreak"},{"type":"text","text":"• Slack-канал: #hr-questions"}]},{"type":"paragraph","content":[{"type":"text","text":"📋 Административные вопросы:"},{"type":"hardBreak"},{"type":"text","text":"• @Karina Skilevaya — заказ канцелярии, пропуска, организация рабочего места, бронирование переговорок"},{"type":"hardBreak"},{"type":"text","text":"• Подробнее — в карточке "},{"type":"text","text":"Рабочее место и заявки в АХО","marks":[{"type":"link","attrs":{"href":"/article/9","target":null,"class":null}}]}]},{"type":"paragraph","content":[{"type":"text","text":"💻 IT и техническая поддержка:"},{"type":"hardBreak"},{"type":"text","text":"• @Kirill Shakhov — настройка ноутбука, доступы к сервисам, VPN, техническая помощь"},{"type":"hardBreak"},{"type":"text","text":"• Slack-канал: #it-support"},{"type":"hardBreak"},{"type":"text","text":"• Список сервисов — "},{"type":"text","text":"Сервисы для работы","marks":[{"type":"link","attrs":{"href":"/article/10","target":null,"class":null}}]}]},{"type":"paragraph","content":[{"type":"text","text":"💰 Финансовые вопросы:"},{"type":"hardBreak"},{"type":"text","text":"• Бухгалтерия — вопросы по зарплате, справки 2-НДФЛ"},{"type":"hardBreak"},{"type":"text","text":"• Подробнее — "},{"type":"text","text":"Зарплата и выплаты","marks":[{"type":"link","attrs":{"href":"/article/7","target":null,"class":null}}]}]},{"type":"paragraph","content":[{"type":"text","text":"📢 Обратная связь:"},{"type":"hardBreak"},{"type":"text","text":"• Если хочешь поделиться мнением о процессах — "},{"type":"text","text":"Как дать обратную связь","marks":[{"type":"link","attrs":{"href":"/article/14","target":null,"class":null}}]}]},{"type":"paragraph","content":[{"type":"text","text":"⚠️ Если не знаешь, к кому обратиться — пиши в #general или спроси своего руководителя."}]}]}'::jsonb,
  'Здесь собраны контакты людей, к которым можно обращаться по различным вопросам.

👩‍💼 HR и кадровые вопросы:
• @Anna Leonova — оформление, отпуска, больничные, справки, адаптация новых сотрудников
• Slack-канал: #hr-questions

📋 Административные вопросы:
• @Karina Skilevaya — заказ канцелярии, пропуска, организация рабочего места, бронирование переговорок
• Подробнее — в карточке [[9|Рабочее место и заявки в АХО]]

💻 IT и техническая поддержка:
• @Kirill Shakhov — настройка ноутбука, доступы к сервисам, VPN, техническая помощь
• Slack-канал: #it-support
• Список сервисов — [[10|Сервисы для работы]]

💰 Финансовые вопросы:
• Бухгалтерия — вопросы по зарплате, справки 2-НДФЛ
• Подробнее — [[7|Зарплата и выплаты]]

📢 Обратная связь:
• Если хочешь поделиться мнением о процессах — [[14|Как дать обратную связь]]

⚠️ Если не знаешь, к кому обратиться — пиши в #general или спроси своего руководителя.',
  true
)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  content_text = EXCLUDED.content_text,
  is_published = EXCLUDED.is_published;

INSERT INTO articles (id, category_id, title, summary, content, content_text, is_published) VALUES (
  3,
  'company',
  'Чем занимается компания',
  'Наши продукты и направления',
  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"AdCorp — это рекламная сеть, которая объединяет несколько продуктов в сфере digital-рекламы."}]},{"type":"paragraph","content":[{"type":"text","text":"🌐 Наши бренды:"}]},{"type":"paragraph","content":[{"type":"text","text":"• ClickAdilla — рекламная сеть для вебмастеров и рекламодателей. Платформа связывает тех, кто хочет разместить рекламу, с площадками, где есть трафик."}]},{"type":"paragraph","content":[{"type":"text","text":"• MyBid — fully-managed рекламная сеть. Автоматизированная платформа, где алгоритмы помогают рекламодателям получать максимум от их бюджета."}]},{"type":"paragraph","content":[{"type":"text","text":"• OnClicka — push-уведомления и попандер-реклама. Специализируется на форматах рекламы, которые показываются через уведомления браузера или новые вкладки."}]},{"type":"paragraph","content":[{"type":"text","text":"📊 Как мы зарабатываем:"}]},{"type":"paragraph","content":[{"type":"text","text":"Рекламодатели платят за размещение рекламы → мы показываем рекламу на площадках наших партнёров (вебмастеров) → вебмастера получают долю дохода за показ рекламы на своих сайтах."}]},{"type":"paragraph","content":[{"type":"text","text":"Подробнее о принципах работы рекламы — в карточке "},{"type":"text","text":"Как работает реклама","marks":[{"type":"link","attrs":{"href":"/article/4","target":null,"class":null}}]},{"type":"text","text":"."},{"type":"hardBreak"},{"type":"text","text":"Структура команд и кто за что отвечает — "},{"type":"text","text":"Структура компании","marks":[{"type":"link","attrs":{"href":"/article/5","target":null,"class":null}}]},{"type":"text","text":"."}]}]}'::jsonb,
  'AdCorp — это рекламная сеть, которая объединяет несколько продуктов в сфере digital-рекламы.

🌐 Наши бренды:

• ClickAdilla — рекламная сеть для вебмастеров и рекламодателей. Платформа связывает тех, кто хочет разместить рекламу, с площадками, где есть трафик.

• MyBid — fully-managed рекламная сеть. Автоматизированная платформа, где алгоритмы помогают рекламодателям получать максимум от их бюджета.

• OnClicka — push-уведомления и попандер-реклама. Специализируется на форматах рекламы, которые показываются через уведомления браузера или новые вкладки.

📊 Как мы зарабатываем:

Рекламодатели платят за размещение рекламы → мы показываем рекламу на площадках наших партнёров (вебмастеров) → вебмастера получают долю дохода за показ рекламы на своих сайтах.

Подробнее о принципах работы рекламы — в карточке [[4|Как работает реклама]].
Структура команд и кто за что отвечает — [[5|Структура компании]].',
  true
)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  content_text = EXCLUDED.content_text,
  is_published = EXCLUDED.is_published;

INSERT INTO articles (id, category_id, title, summary, content, content_text, is_published) VALUES (
  4,
  'company',
  'Как работает реклама',
  'Основы рекламного бизнеса простым языком',
  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Чтобы лучше понимать нашу работу, полезно знать базовые понятия digital-рекламы."}]},{"type":"paragraph","content":[{"type":"text","text":"📖 Ключевые термины:"}]},{"type":"paragraph","content":[{"type":"text","text":"• Рекламодатель (advertiser) — компания или человек, который хочет показать свою рекламу и платит за это"},{"type":"hardBreak"},{"type":"text","text":"• Вебмастер (publisher) — владелец сайта или приложения, на котором показывается реклама и который получает за это деньги"},{"type":"hardBreak"},{"type":"text","text":"• Трафик — посетители сайта или приложения"},{"type":"hardBreak"},{"type":"text","text":"• Рекламная сеть — платформа-посредник, которая соединяет рекламодателей и вебмастеров (это мы!)"}]},{"type":"paragraph","content":[{"type":"text","text":"💡 Форматы рекламы, с которыми мы работаем:"}]},{"type":"paragraph","content":[{"type":"text","text":"• Banner — классические рекламные баннеры на сайтах"},{"type":"hardBreak"},{"type":"text","text":"• Popunder — страница рекламодателя, открывающаяся в новой вкладке"},{"type":"hardBreak"},{"type":"text","text":"• Push-уведомления — рекламные уведомления в браузере или на телефоне"},{"type":"hardBreak"},{"type":"text","text":"• Native — рекламные блоки, встроенные в контент сайта и похожие на обычные материалы"},{"type":"hardBreak"},{"type":"text","text":"• Video — видеореклама (pre-roll, in-stream)"}]},{"type":"paragraph","content":[{"type":"text","text":"📈 Как считают эффективность:"}]},{"type":"paragraph","content":[{"type":"text","text":"• CPM (Cost Per Mille) — цена за 1000 показов"},{"type":"hardBreak"},{"type":"text","text":"• CPC (Cost Per Click) — цена за клик"},{"type":"hardBreak"},{"type":"text","text":"• CPA (Cost Per Action) — цена за целевое действие (покупка, регистрация)"},{"type":"hardBreak"},{"type":"text","text":"• CTR (Click-Through Rate) — процент кликов от показов"}]},{"type":"paragraph","content":[{"type":"text","text":"О наших конкретных продуктах — "},{"type":"text","text":"Чем занимается компания","marks":[{"type":"link","attrs":{"href":"/article/3","target":null,"class":null}}]},{"type":"text","text":"."}]}]}'::jsonb,
  'Чтобы лучше понимать нашу работу, полезно знать базовые понятия digital-рекламы.

📖 Ключевые термины:

• Рекламодатель (advertiser) — компания или человек, который хочет показать свою рекламу и платит за это
• Вебмастер (publisher) — владелец сайта или приложения, на котором показывается реклама и который получает за это деньги
• Трафик — посетители сайта или приложения
• Рекламная сеть — платформа-посредник, которая соединяет рекламодателей и вебмастеров (это мы!)

💡 Форматы рекламы, с которыми мы работаем:

• Banner — классические рекламные баннеры на сайтах
• Popunder — страница рекламодателя, открывающаяся в новой вкладке
• Push-уведомления — рекламные уведомления в браузере или на телефоне
• Native — рекламные блоки, встроенные в контент сайта и похожие на обычные материалы
• Video — видеореклама (pre-roll, in-stream)

📈 Как считают эффективность:

• CPM (Cost Per Mille) — цена за 1000 показов
• CPC (Cost Per Click) — цена за клик
• CPA (Cost Per Action) — цена за целевое действие (покупка, регистрация)
• CTR (Click-Through Rate) — процент кликов от показов

О наших конкретных продуктах — [[3|Чем занимается компания]].',
  true
)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  content_text = EXCLUDED.content_text,
  is_published = EXCLUDED.is_published;

INSERT INTO articles (id, category_id, title, summary, content, content_text, is_published) VALUES (
  5,
  'company',
  'Структура компании',
  'Бренды, команды и кто за что отвечает',
  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"AdCorp состоит из нескольких продуктовых команд и общих подразделений."}]},{"type":"paragraph","content":[{"type":"text","text":"🏗️ Продуктовые команды:"}]},{"type":"paragraph","content":[{"type":"text","text":"• Команда ClickAdilla — разработка и поддержка рекламной сети ClickAdilla"},{"type":"hardBreak"},{"type":"text","text":"• Команда MyBid — разработка fully-managed платформы MyBid"},{"type":"hardBreak"},{"type":"text","text":"• Команда OnClicka — push-уведомления и попандер-форматы"}]},{"type":"paragraph","content":[{"type":"text","text":"🔧 Общие подразделения:"}]},{"type":"paragraph","content":[{"type":"text","text":"• Разработка (Development) — бэкенд, фронтенд, DevOps, QA"},{"type":"hardBreak"},{"type":"text","text":"• Дизайн (Design) — UI/UX, графический дизайн, креативы"},{"type":"hardBreak"},{"type":"text","text":"• Маркетинг (Marketing) — привлечение рекламодателей и вебмастеров, контент, SMM"},{"type":"hardBreak"},{"type":"text","text":"• Аккаунт-менеджмент — работа с клиентами (рекламодателями и вебмастерами)"},{"type":"hardBreak"},{"type":"text","text":"• HR — подбор персонала, адаптация, корпоративная культура"},{"type":"hardBreak"},{"type":"text","text":"• Финансы и бухгалтерия — выплаты, отчётность"},{"type":"hardBreak"},{"type":"text","text":"• АХО (административно-хозяйственный отдел) — офис, техника, снабжение"}]},{"type":"paragraph","content":[{"type":"text","text":"📌 Каждая продуктовая команда работает относительно автономно, но есть общие процессы и инструменты для всех — подробнее в "},{"type":"text","text":"Сервисы для работы","marks":[{"type":"link","attrs":{"href":"/article/10","target":null,"class":null}}]},{"type":"text","text":"."}]},{"type":"paragraph","content":[{"type":"text","text":"Контакты ключевых людей — "},{"type":"text","text":"Полезные контакты","marks":[{"type":"link","attrs":{"href":"/article/2","target":null,"class":null}}]},{"type":"text","text":"."}]}]}'::jsonb,
  'AdCorp состоит из нескольких продуктовых команд и общих подразделений.

🏗️ Продуктовые команды:

• Команда ClickAdilla — разработка и поддержка рекламной сети ClickAdilla
• Команда MyBid — разработка fully-managed платформы MyBid
• Команда OnClicka — push-уведомления и попандер-форматы

🔧 Общие подразделения:

• Разработка (Development) — бэкенд, фронтенд, DevOps, QA
• Дизайн (Design) — UI/UX, графический дизайн, креативы
• Маркетинг (Marketing) — привлечение рекламодателей и вебмастеров, контент, SMM
• Аккаунт-менеджмент — работа с клиентами (рекламодателями и вебмастерами)
• HR — подбор персонала, адаптация, корпоративная культура
• Финансы и бухгалтерия — выплаты, отчётность
• АХО (административно-хозяйственный отдел) — офис, техника, снабжение

📌 Каждая продуктовая команда работает относительно автономно, но есть общие процессы и инструменты для всех — подробнее в [[10|Сервисы для работы]].

Контакты ключевых людей — [[2|Полезные контакты]].',
  true
)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  content_text = EXCLUDED.content_text,
  is_published = EXCLUDED.is_published;

INSERT INTO articles (id, category_id, title, summary, content, content_text, is_published) VALUES (
  6,
  'work',
  'График и режим работы',
  'Рабочее время, гибкий график, удалёнка',
  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"⏰ Рабочее время:"}]},{"type":"paragraph","content":[{"type":"text","text":"Стандартный рабочий день — с 10:00 до 19:00 (включая 1 час обеда)."}]},{"type":"paragraph","content":[{"type":"text","text":"📌 Гибкий график:"}]},{"type":"paragraph","content":[{"type":"text","text":"У нас действует гибкое начало рабочего дня. Ты можешь приходить в офис в промежутке с 9:00 до 11:00, главное — отработать 8 часов в день. Согласуй удобный график со своим руководителем."}]},{"type":"paragraph","content":[{"type":"text","text":"🏠 Удалённая работа:"}]},{"type":"paragraph","content":[{"type":"text","text":"• Возможность работать удалённо обсуждается с руководителем индивидуально"},{"type":"hardBreak"},{"type":"text","text":"• Некоторые позиции полностью удалённые"},{"type":"hardBreak"},{"type":"text","text":"• Для оформления удалённого дня — подробнее в "},{"type":"text","text":"Отпуска, отгулы, удалёнка","marks":[{"type":"link","attrs":{"href":"/article/8","target":null,"class":null}}]}]},{"type":"paragraph","content":[{"type":"text","text":"📅 Выходные и праздники:"}]},{"type":"paragraph","content":[{"type":"text","text":"• Суббота и воскресенье — выходные"},{"type":"hardBreak"},{"type":"text","text":"• Государственные праздники РФ — нерабочие дни"},{"type":"hardBreak"},{"type":"text","text":"• Перенос выходных — по производственному календарю"}]},{"type":"paragraph","content":[{"type":"text","text":"⚠️ Если ты заболел — сообщи руководителю и в HR (@Anna Leonova) как можно раньше. Для больничного потребуется лист нетрудоспособности."}]}]}'::jsonb,
  '⏰ Рабочее время:

Стандартный рабочий день — с 10:00 до 19:00 (включая 1 час обеда).

📌 Гибкий график:

У нас действует гибкое начало рабочего дня. Ты можешь приходить в офис в промежутке с 9:00 до 11:00, главное — отработать 8 часов в день. Согласуй удобный график со своим руководителем.

🏠 Удалённая работа:

• Возможность работать удалённо обсуждается с руководителем индивидуально
• Некоторые позиции полностью удалённые
• Для оформления удалённого дня — подробнее в [[8|Отпуска, отгулы, удалёнка]]

📅 Выходные и праздники:

• Суббота и воскресенье — выходные
• Государственные праздники РФ — нерабочие дни
• Перенос выходных — по производственному календарю

⚠️ Если ты заболел — сообщи руководителю и в HR (@Anna Leonova) как можно раньше. Для больничного потребуется лист нетрудоспособности.',
  true
)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  content_text = EXCLUDED.content_text,
  is_published = EXCLUDED.is_published;

INSERT INTO articles (id, category_id, title, summary, content, content_text, is_published) VALUES (
  7,
  'work',
  'Зарплата и выплаты',
  'Даты выплат, бонусы, оформление',
  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"💰 Даты выплат:"}]},{"type":"paragraph","content":[{"type":"text","text":"• Аванс — 25-го числа каждого месяца"},{"type":"hardBreak"},{"type":"text","text":"• Основная часть зарплаты — 10-го числа следующего месяца"}]},{"type":"paragraph","content":[{"type":"text","text":"Если дата выплаты приходится на выходной или праздник — выплата производится в последний рабочий день перед этой датой."}]},{"type":"paragraph","content":[{"type":"text","text":"💳 Способ получения:"}]},{"type":"paragraph","content":[{"type":"text","text":"Зарплата перечисляется на банковскую карту. Реквизиты указываются при оформлении. Если нужно сменить реквизиты — обратись в бухгалтерию."}]},{"type":"paragraph","content":[{"type":"text","text":"📄 Справки:"}]},{"type":"paragraph","content":[{"type":"text","text":"• 2-НДФЛ и другие справки — запрашивай в бухгалтерии через Slack"},{"type":"hardBreak"},{"type":"text","text":"• Срок подготовки — обычно 3 рабочих дня"}]},{"type":"paragraph","content":[{"type":"text","text":"💎 Бонусы:"}]},{"type":"paragraph","content":[{"type":"text","text":"• Система бонусов зависит от подразделения и позиции"},{"type":"hardBreak"},{"type":"text","text":"• Детали обсуждаются с руководителем при оформлении"},{"type":"hardBreak"},{"type":"text","text":"• Пересмотр зарплаты — по результатам performance review (раз в полгода)"}]},{"type":"paragraph","content":[{"type":"text","text":"По вопросам зарплаты — обращайся в бухгалтерию или к "},{"type":"text","text":"Полезные контакты","marks":[{"type":"link","attrs":{"href":"/article/2","target":null,"class":null}}]},{"type":"text","text":"."}]}]}'::jsonb,
  '💰 Даты выплат:

• Аванс — 25-го числа каждого месяца
• Основная часть зарплаты — 10-го числа следующего месяца

Если дата выплаты приходится на выходной или праздник — выплата производится в последний рабочий день перед этой датой.

💳 Способ получения:

Зарплата перечисляется на банковскую карту. Реквизиты указываются при оформлении. Если нужно сменить реквизиты — обратись в бухгалтерию.

📄 Справки:

• 2-НДФЛ и другие справки — запрашивай в бухгалтерии через Slack
• Срок подготовки — обычно 3 рабочих дня

💎 Бонусы:

• Система бонусов зависит от подразделения и позиции
• Детали обсуждаются с руководителем при оформлении
• Пересмотр зарплаты — по результатам performance review (раз в полгода)

По вопросам зарплаты — обращайся в бухгалтерию или к [[2|Полезные контакты]].',
  true
)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  content_text = EXCLUDED.content_text,
  is_published = EXCLUDED.is_published;

INSERT INTO articles (id, category_id, title, summary, content, content_text, is_published) VALUES (
  8,
  'work',
  'Отпуска, отгулы, удалёнка',
  'Как оформить отпуск или отгул',
  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"🌴 Ежегодный отпуск:"}]},{"type":"paragraph","content":[{"type":"text","text":"• 28 календарных дней в году (по ТК РФ)"},{"type":"hardBreak"},{"type":"text","text":"• Можно делить на части, но одна часть — не менее 14 дней подряд"},{"type":"hardBreak"},{"type":"text","text":"• Заявление на отпуск подаётся минимум за 2 недели"},{"type":"hardBreak"},{"type":"text","text":"• Согласовывается с руководителем, затем оформляется через HR (@Anna Leonova)"}]},{"type":"paragraph","content":[{"type":"text","text":"📋 Как оформить отпуск:"}]},{"type":"paragraph","content":[{"type":"text","text":"1. Согласуй даты с руководителем"},{"type":"hardBreak"},{"type":"text","text":"2. Напиши @Anna Leonova в Slack с датами и типом отпуска"},{"type":"hardBreak"},{"type":"text","text":"3. Получи подтверждение"},{"type":"hardBreak"},{"type":"text","text":"4. Настрой автоответ в почте и Slack на время отсутствия"}]},{"type":"paragraph","content":[{"type":"text","text":"🏠 Удалённый день (remote day):"}]},{"type":"paragraph","content":[{"type":"text","text":"• Согласуй с руководителем заранее (желательно за 1 день)"},{"type":"hardBreak"},{"type":"text","text":"• Поставь статус 🏠 в Slack"},{"type":"hardBreak"},{"type":"text","text":"• Будь на связи в рабочие часы"}]},{"type":"paragraph","content":[{"type":"text","text":"⚡ Отгул:"}]},{"type":"paragraph","content":[{"type":"text","text":"• Оформляется за счёт переработки или как день без сохранения зарплаты"},{"type":"hardBreak"},{"type":"text","text":"• Согласуй с руководителем и сообщи HR"},{"type":"hardBreak"},{"type":"text","text":"• Экстренные случаи — предупреди руководителя как можно раньше"}]},{"type":"paragraph","content":[{"type":"text","text":"⚠️ Больничный:"}]},{"type":"paragraph","content":[{"type":"text","text":"• Сообщи руководителю и HR в первый день болезни"},{"type":"hardBreak"},{"type":"text","text":"• Оформи лист нетрудоспособности у врача"},{"type":"hardBreak"},{"type":"text","text":"• Передай номер электронного больничного в HR"}]},{"type":"paragraph","content":[{"type":"text","text":"Контакты HR — "},{"type":"text","text":"Полезные контакты","marks":[{"type":"link","attrs":{"href":"/article/2","target":null,"class":null}}]},{"type":"text","text":"."}]}]}'::jsonb,
  '🌴 Ежегодный отпуск:

• 28 календарных дней в году (по ТК РФ)
• Можно делить на части, но одна часть — не менее 14 дней подряд
• Заявление на отпуск подаётся минимум за 2 недели
• Согласовывается с руководителем, затем оформляется через HR (@Anna Leonova)

📋 Как оформить отпуск:

1. Согласуй даты с руководителем
2. Напиши @Anna Leonova в Slack с датами и типом отпуска
3. Получи подтверждение
4. Настрой автоответ в почте и Slack на время отсутствия

🏠 Удалённый день (remote day):

• Согласуй с руководителем заранее (желательно за 1 день)
• Поставь статус 🏠 в Slack
• Будь на связи в рабочие часы

⚡ Отгул:

• Оформляется за счёт переработки или как день без сохранения зарплаты
• Согласуй с руководителем и сообщи HR
• Экстренные случаи — предупреди руководителя как можно раньше

⚠️ Больничный:

• Сообщи руководителю и HR в первый день болезни
• Оформи лист нетрудоспособности у врача
• Передай номер электронного больничного в HR

Контакты HR — [[2|Полезные контакты]].',
  true
)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  content_text = EXCLUDED.content_text,
  is_published = EXCLUDED.is_published;

INSERT INTO articles (id, category_id, title, summary, content, content_text, is_published) VALUES (
  9,
  'work',
  'Рабочее место и заявки в АХО',
  'Техника, канцелярия и хозяйственные вопросы',
  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"🖥️ Рабочее оборудование:"}]},{"type":"paragraph","content":[{"type":"text","text":"При выходе на работу ты получаешь:"},{"type":"hardBreak"},{"type":"text","text":"• Ноутбук (MacBook или Windows — зависит от позиции)"},{"type":"hardBreak"},{"type":"text","text":"• Монитор (при работе в офисе)"},{"type":"hardBreak"},{"type":"text","text":"• Клавиатуру и мышь (по запросу)"},{"type":"hardBreak"},{"type":"text","text":"• Гарнитуру для звонков"}]},{"type":"paragraph","content":[{"type":"text","text":"Настройку техники выполняет IT-отдел — обратись к @Kirill Shakhov."}]},{"type":"paragraph","content":[{"type":"text","text":"📦 Заявки в АХО (административно-хозяйственный отдел):"}]},{"type":"paragraph","content":[{"type":"text","text":"Для заказа канцелярии, оборудования или решения хозяйственных вопросов:"}]},{"type":"paragraph","content":[{"type":"text","text":"1. Напиши @Karina Skilevaya в Slack"},{"type":"hardBreak"},{"type":"text","text":"2. Опиши, что нужно (канцелярия, техника, мебель и т.д.)"},{"type":"hardBreak"},{"type":"text","text":"3. Получи подтверждение и ориентировочные сроки"}]},{"type":"paragraph","content":[{"type":"text","text":"📌 Что можно заказать через АХО:"}]},{"type":"paragraph","content":[{"type":"text","text":"• Канцелярия (ручки, блокноты, стикеры)"},{"type":"hardBreak"},{"type":"text","text":"• Мелкая техника (переходники, кабели, флешки)"},{"type":"hardBreak"},{"type":"text","text":"• Мебель (стул, подставка под ноутбук)"},{"type":"hardBreak"},{"type":"text","text":"• Бытовые нужды (вода, чай, кофе — есть на кухне)"}]},{"type":"paragraph","content":[{"type":"text","text":"🔑 Доступ в офис:"}]},{"type":"paragraph","content":[{"type":"text","text":"• Пропуск оформляется в первый рабочий день через АХО"},{"type":"hardBreak"},{"type":"text","text":"• При потере пропуска — сообщи @Karina Skilevaya"}]},{"type":"paragraph","content":[{"type":"text","text":"Переговорки и видеосвязь — "},{"type":"text","text":"Переговорки и видеоконференции","marks":[{"type":"link","attrs":{"href":"/article/11","target":null,"class":null}}]},{"type":"text","text":"."},{"type":"hardBreak"},{"type":"text","text":"IT-вопросы — "},{"type":"text","text":"Сервисы для работы","marks":[{"type":"link","attrs":{"href":"/article/10","target":null,"class":null}}]},{"type":"text","text":"."}]}]}'::jsonb,
  '🖥️ Рабочее оборудование:

При выходе на работу ты получаешь:
• Ноутбук (MacBook или Windows — зависит от позиции)
• Монитор (при работе в офисе)
• Клавиатуру и мышь (по запросу)
• Гарнитуру для звонков

Настройку техники выполняет IT-отдел — обратись к @Kirill Shakhov.

📦 Заявки в АХО (административно-хозяйственный отдел):

Для заказа канцелярии, оборудования или решения хозяйственных вопросов:

1. Напиши @Karina Skilevaya в Slack
2. Опиши, что нужно (канцелярия, техника, мебель и т.д.)
3. Получи подтверждение и ориентировочные сроки

📌 Что можно заказать через АХО:

• Канцелярия (ручки, блокноты, стикеры)
• Мелкая техника (переходники, кабели, флешки)
• Мебель (стул, подставка под ноутбук)
• Бытовые нужды (вода, чай, кофе — есть на кухне)

🔑 Доступ в офис:

• Пропуск оформляется в первый рабочий день через АХО
• При потере пропуска — сообщи @Karina Skilevaya

Переговорки и видеосвязь — [[11|Переговорки и видеоконференции]].
IT-вопросы — [[10|Сервисы для работы]].',
  true
)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  content_text = EXCLUDED.content_text,
  is_published = EXCLUDED.is_published;

INSERT INTO articles (id, category_id, title, summary, content, content_text, is_published) VALUES (
  10,
  'work',
  'Сервисы для работы',
  'Инструменты и доступы',
  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Основные инструменты, которые мы используем в работе."}]},{"type":"paragraph","content":[{"type":"text","text":"💬 Коммуникация:"},{"type":"hardBreak"},{"type":"text","text":"• Slack — основной мессенджер для рабочего общения. Список каналов — "},{"type":"text","text":"Общие каналы в Slack","marks":[{"type":"link","attrs":{"href":"/article/13","target":null,"class":null}}]},{"type":"hardBreak"},{"type":"text","text":"• Google Meet / Zoom — видеозвонки"},{"type":"hardBreak"},{"type":"text","text":"• Email (Google Workspace) — для внешних коммуникаций"}]},{"type":"paragraph","content":[{"type":"text","text":"📋 Управление задачами:"},{"type":"hardBreak"},{"type":"text","text":"• Jira — трекинг задач для разработки"},{"type":"hardBreak"},{"type":"text","text":"• Confluence — внутренняя wiki и документация"},{"type":"hardBreak"},{"type":"text","text":"• Notion — заметки и базы знаний отдельных команд"}]},{"type":"paragraph","content":[{"type":"text","text":"💻 Разработка:"},{"type":"hardBreak"},{"type":"text","text":"• GitHub — хранение кода, code review, CI/CD"},{"type":"hardBreak"},{"type":"text","text":"• Figma — дизайн и прототипирование"},{"type":"hardBreak"},{"type":"text","text":"• Sentry — мониторинг ошибок"}]},{"type":"paragraph","content":[{"type":"text","text":"☁️ Инфраструктура:"},{"type":"hardBreak"},{"type":"text","text":"• Google Workspace — почта, календарь, документы, диск"},{"type":"hardBreak"},{"type":"text","text":"• 1Password — менеджер паролей (для командных аккаунтов)"},{"type":"hardBreak"},{"type":"text","text":"• VPN — для доступа к внутренним сервисам удалённо"}]},{"type":"paragraph","content":[{"type":"text","text":"📌 Как получить доступ:"}]},{"type":"paragraph","content":[{"type":"text","text":"Все доступы выдаются через IT-отдел. Напиши @Kirill Shakhov в Slack с указанием:"},{"type":"hardBreak"},{"type":"text","text":"• Какой сервис нужен"},{"type":"hardBreak"},{"type":"text","text":"• Для какой задачи"},{"type":"hardBreak"},{"type":"text","text":"• Руководитель, который может подтвердить"}]},{"type":"paragraph","content":[{"type":"text","text":"Обычно доступы выдаются в течение 1 рабочего дня."}]},{"type":"paragraph","content":[{"type":"text","text":"Контакты IT — "},{"type":"text","text":"Полезные контакты","marks":[{"type":"link","attrs":{"href":"/article/2","target":null,"class":null}}]},{"type":"text","text":"."}]}]}'::jsonb,
  'Основные инструменты, которые мы используем в работе.

💬 Коммуникация:
• Slack — основной мессенджер для рабочего общения. Список каналов — [[13|Общие каналы в Slack]]
• Google Meet / Zoom — видеозвонки
• Email (Google Workspace) — для внешних коммуникаций

📋 Управление задачами:
• Jira — трекинг задач для разработки
• Confluence — внутренняя wiki и документация
• Notion — заметки и базы знаний отдельных команд

💻 Разработка:
• GitHub — хранение кода, code review, CI/CD
• Figma — дизайн и прототипирование
• Sentry — мониторинг ошибок

☁️ Инфраструктура:
• Google Workspace — почта, календарь, документы, диск
• 1Password — менеджер паролей (для командных аккаунтов)
• VPN — для доступа к внутренним сервисам удалённо

📌 Как получить доступ:

Все доступы выдаются через IT-отдел. Напиши @Kirill Shakhov в Slack с указанием:
• Какой сервис нужен
• Для какой задачи
• Руководитель, который может подтвердить

Обычно доступы выдаются в течение 1 рабочего дня.

Контакты IT — [[2|Полезные контакты]].',
  true
)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  content_text = EXCLUDED.content_text,
  is_published = EXCLUDED.is_published;

INSERT INTO articles (id, category_id, title, summary, content, content_text, is_published) VALUES (
  11,
  'work',
  'Переговорки и видеоконференции',
  'Бронирование и настройка связи',
  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"🚪 Переговорные комнаты:"}]},{"type":"paragraph","content":[{"type":"text","text":"В офисе есть несколько переговорных комнат разного размера:"}]},{"type":"paragraph","content":[{"type":"text","text":"• Jupiter (большая, до 12 человек) — для общих встреч и презентаций"},{"type":"hardBreak"},{"type":"text","text":"• Saturn (средняя, до 6 человек) — для командных обсуждений"},{"type":"hardBreak"},{"type":"text","text":"• Mercury (маленькая, до 3 человек) — для 1-на-1 и коротких звонков"}]},{"type":"paragraph","content":[{"type":"text","text":"📅 Бронирование:"}]},{"type":"paragraph","content":[{"type":"text","text":"1. Открой Google Calendar"},{"type":"hardBreak"},{"type":"text","text":"2. Создай событие и добавь переговорку как ресурс"},{"type":"hardBreak"},{"type":"text","text":"3. Проверь, что комната свободна на нужное время"},{"type":"hardBreak"},{"type":"text","text":"4. Если нужна помощь — обратись к @Karina Skilevaya"}]},{"type":"paragraph","content":[{"type":"text","text":"📹 Видеоконференции:"}]},{"type":"paragraph","content":[{"type":"text","text":"Для видеозвонков используем:"},{"type":"hardBreak"},{"type":"text","text":"• Google Meet — встроен в Google Calendar, создаётся автоматически при добавлении участников"},{"type":"hardBreak"},{"type":"text","text":"• Zoom — для внешних клиентов (ссылку создаёт организатор)"}]},{"type":"paragraph","content":[{"type":"text","text":"🔧 Оборудование в переговорках:"}]},{"type":"paragraph","content":[{"type":"text","text":"Во всех переговорках есть:"},{"type":"hardBreak"},{"type":"text","text":"• Экран или телевизор для трансляции"},{"type":"hardBreak"},{"type":"text","text":"• Веб-камера"},{"type":"hardBreak"},{"type":"text","text":"• Спикерфон"}]},{"type":"paragraph","content":[{"type":"text","text":"Для подключения к экрану — используй HDMI-кабель или трансляцию через Chromecast."}]},{"type":"paragraph","content":[{"type":"text","text":"📌 Данные для Jupiter (видеоконференции):"},{"type":"hardBreak"},{"type":"text","text":"• Логин: jupiter@adcorp.com"},{"type":"hardBreak"},{"type":"text","text":"• Пароль: уточняй у IT (@Kirill Shakhov)"}]},{"type":"paragraph","content":[{"type":"text","text":"Проблемы с техникой — "},{"type":"text","text":"Рабочее место и заявки в АХО","marks":[{"type":"link","attrs":{"href":"/article/9","target":null,"class":null}}]},{"type":"text","text":"."}]}]}'::jsonb,
  '🚪 Переговорные комнаты:

В офисе есть несколько переговорных комнат разного размера:

• Jupiter (большая, до 12 человек) — для общих встреч и презентаций
• Saturn (средняя, до 6 человек) — для командных обсуждений
• Mercury (маленькая, до 3 человек) — для 1-на-1 и коротких звонков

📅 Бронирование:

1. Открой Google Calendar
2. Создай событие и добавь переговорку как ресурс
3. Проверь, что комната свободна на нужное время
4. Если нужна помощь — обратись к @Karina Skilevaya

📹 Видеоконференции:

Для видеозвонков используем:
• Google Meet — встроен в Google Calendar, создаётся автоматически при добавлении участников
• Zoom — для внешних клиентов (ссылку создаёт организатор)

🔧 Оборудование в переговорках:

Во всех переговорках есть:
• Экран или телевизор для трансляции
• Веб-камера
• Спикерфон

Для подключения к экрану — используй HDMI-кабель или трансляцию через Chromecast.

📌 Данные для Jupiter (видеоконференции):
• Логин: jupiter@adcorp.com
• Пароль: уточняй у IT (@Kirill Shakhov)

Проблемы с техникой — [[9|Рабочее место и заявки в АХО]].',
  true
)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  content_text = EXCLUDED.content_text,
  is_published = EXCLUDED.is_published;

INSERT INTO articles (id, category_id, title, summary, content, content_text, is_published) VALUES (
  12,
  'life',
  'Сообщества и клубы',
  'Спорт, игры и активности',
  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"У нас в компании много неформальных активностей — присоединяйся к тому, что интересно!"}]},{"type":"paragraph","content":[{"type":"text","text":"⚽ Спорт:"},{"type":"hardBreak"},{"type":"text","text":"• Футбол — играем раз в неделю (обычно четверг вечер). Канал: #football"},{"type":"hardBreak"},{"type":"text","text":"• Бег — совместные пробежки по утрам. Канал: #running"},{"type":"hardBreak"},{"type":"text","text":"• Спортзал — у компании есть корпоративная скидка в фитнес-клуб, подробности у HR"}]},{"type":"paragraph","content":[{"type":"text","text":"🎮 Игры:"},{"type":"hardBreak"},{"type":"text","text":"• Настольные игры — собираемся по пятницам после работы. Канал: #board-games"},{"type":"hardBreak"},{"type":"text","text":"• CS2 / другие онлайн-игры — канал: #gaming"},{"type":"hardBreak"},{"type":"text","text":"• Мафия — периодически играем в офисе"}]},{"type":"paragraph","content":[{"type":"text","text":"📚 Развитие:"},{"type":"hardBreak"},{"type":"text","text":"• Книжный клуб — обсуждаем книги раз в месяц. Канал: #book-club"},{"type":"hardBreak"},{"type":"text","text":"• Tech Talks — внутренние доклады от коллег по техническим темам"},{"type":"hardBreak"},{"type":"text","text":"• English Club — практика английского. Канал: #english"}]},{"type":"paragraph","content":[{"type":"text","text":"🎉 Корпоративные мероприятия:"},{"type":"hardBreak"},{"type":"text","text":"• Дни рождения — поздравляем в #birthdays"},{"type":"hardBreak"},{"type":"text","text":"• Тимбилдинги — раз в квартал"},{"type":"hardBreak"},{"type":"text","text":"• Новогодняя вечеринка — главное событие года"}]},{"type":"paragraph","content":[{"type":"text","text":"Все каналы для активностей — в Slack. Общий список каналов — "},{"type":"text","text":"Общие каналы в Slack","marks":[{"type":"link","attrs":{"href":"/article/13","target":null,"class":null}}]},{"type":"text","text":"."},{"type":"hardBreak"},{"type":"text","text":"Есть идея нового клуба? Напиши в "},{"type":"text","text":"Как дать обратную связь","marks":[{"type":"link","attrs":{"href":"/article/14","target":null,"class":null}}]},{"type":"text","text":"!"}]}]}'::jsonb,
  'У нас в компании много неформальных активностей — присоединяйся к тому, что интересно!

⚽ Спорт:
• Футбол — играем раз в неделю (обычно четверг вечер). Канал: #football
• Бег — совместные пробежки по утрам. Канал: #running
• Спортзал — у компании есть корпоративная скидка в фитнес-клуб, подробности у HR

🎮 Игры:
• Настольные игры — собираемся по пятницам после работы. Канал: #board-games
• CS2 / другие онлайн-игры — канал: #gaming
• Мафия — периодически играем в офисе

📚 Развитие:
• Книжный клуб — обсуждаем книги раз в месяц. Канал: #book-club
• Tech Talks — внутренние доклады от коллег по техническим темам
• English Club — практика английского. Канал: #english

🎉 Корпоративные мероприятия:
• Дни рождения — поздравляем в #birthdays
• Тимбилдинги — раз в квартал
• Новогодняя вечеринка — главное событие года

Все каналы для активностей — в Slack. Общий список каналов — [[13|Общие каналы в Slack]].
Есть идея нового клуба? Напиши в [[14|Как дать обратную связь]]!',
  true
)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  content_text = EXCLUDED.content_text,
  is_published = EXCLUDED.is_published;

INSERT INTO articles (id, category_id, title, summary, content, content_text, is_published) VALUES (
  13,
  'life',
  'Общие каналы в Slack',
  'Полезные каналы для общения',
  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Slack — наш основной инструмент общения. Вот важные каналы, на которые стоит подписаться:"}]},{"type":"paragraph","content":[{"type":"text","text":"📢 Обязательные:"},{"type":"hardBreak"},{"type":"text","text":"• #general — объявления компании, важные новости"},{"type":"hardBreak"},{"type":"text","text":"• #random — общение на свободные темы, мемы, обсуждения"},{"type":"hardBreak"},{"type":"text","text":"• #hr-questions — вопросы к HR (отпуска, документы, процессы)"},{"type":"hardBreak"},{"type":"text","text":"• #it-support — техническая помощь, проблемы с доступами"}]},{"type":"paragraph","content":[{"type":"text","text":"💼 Рабочие:"},{"type":"hardBreak"},{"type":"text","text":"• #dev — общий канал разработки"},{"type":"hardBreak"},{"type":"text","text":"• #design — дизайн и креативы"},{"type":"hardBreak"},{"type":"text","text":"• #marketing — маркетинг и продвижение"},{"type":"hardBreak"},{"type":"text","text":"• #product — продуктовые обсуждения"}]},{"type":"paragraph","content":[{"type":"text","text":"🎉 Активности:"},{"type":"hardBreak"},{"type":"text","text":"• #football — корпоративный футбол"},{"type":"hardBreak"},{"type":"text","text":"• #running — совместные пробежки"},{"type":"hardBreak"},{"type":"text","text":"• #board-games — настольные игры"},{"type":"hardBreak"},{"type":"text","text":"• #gaming — компьютерные игры"},{"type":"hardBreak"},{"type":"text","text":"• #book-club — книжный клуб"},{"type":"hardBreak"},{"type":"text","text":"• #english — практика английского"},{"type":"hardBreak"},{"type":"text","text":"• #birthdays — поздравления с днём рождения"}]},{"type":"paragraph","content":[{"type":"text","text":"🍔 Быт:"},{"type":"hardBreak"},{"type":"text","text":"• #food — где пообедать, рекомендации, совместные заказы"},{"type":"hardBreak"},{"type":"text","text":"• #marketplace — продажа/покупка вещей между коллегами"}]},{"type":"paragraph","content":[{"type":"text","text":"📌 Чтобы подписаться на канал — найди его через поиск в Slack или попроси коллегу добавить."}]},{"type":"paragraph","content":[{"type":"text","text":"Подробнее о сообществах — "},{"type":"text","text":"Сообщества и клубы","marks":[{"type":"link","attrs":{"href":"/article/12","target":null,"class":null}}]},{"type":"text","text":"."},{"type":"hardBreak"},{"type":"text","text":"Контакты по разным вопросам — "},{"type":"text","text":"Полезные контакты","marks":[{"type":"link","attrs":{"href":"/article/2","target":null,"class":null}}]},{"type":"text","text":"."}]}]}'::jsonb,
  'Slack — наш основной инструмент общения. Вот важные каналы, на которые стоит подписаться:

📢 Обязательные:
• #general — объявления компании, важные новости
• #random — общение на свободные темы, мемы, обсуждения
• #hr-questions — вопросы к HR (отпуска, документы, процессы)
• #it-support — техническая помощь, проблемы с доступами

💼 Рабочие:
• #dev — общий канал разработки
• #design — дизайн и креативы
• #marketing — маркетинг и продвижение
• #product — продуктовые обсуждения

🎉 Активности:
• #football — корпоративный футбол
• #running — совместные пробежки
• #board-games — настольные игры
• #gaming — компьютерные игры
• #book-club — книжный клуб
• #english — практика английского
• #birthdays — поздравления с днём рождения

🍔 Быт:
• #food — где пообедать, рекомендации, совместные заказы
• #marketplace — продажа/покупка вещей между коллегами

📌 Чтобы подписаться на канал — найди его через поиск в Slack или попроси коллегу добавить.

Подробнее о сообществах — [[12|Сообщества и клубы]].
Контакты по разным вопросам — [[2|Полезные контакты]].',
  true
)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  content_text = EXCLUDED.content_text,
  is_published = EXCLUDED.is_published;

INSERT INTO articles (id, category_id, title, summary, content, content_text, is_published) VALUES (
  14,
  'feedback',
  'Как дать обратную связь',
  'Каналы обратной связи и анонимные опросы',
  '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Нам важно твоё мнение! Вот как можно поделиться обратной связью:"}]},{"type":"paragraph","content":[{"type":"text","text":"💬 Напрямую руководителю:"},{"type":"hardBreak"},{"type":"text","text":"Самый простой способ — поговорить со своим руководителем на 1-on-1 встрече. Обсуждай всё, что волнует: процессы, команду, рабочие условия."}]},{"type":"paragraph","content":[{"type":"text","text":"📝 HR:"},{"type":"hardBreak"},{"type":"text","text":"Если вопрос касается корпоративной культуры, условий работы или межличностных отношений — пиши @Anna Leonova. Все обращения конфиденциальны."}]},{"type":"paragraph","content":[{"type":"text","text":"📊 Анонимные опросы:"},{"type":"hardBreak"},{"type":"text","text":"Раз в квартал мы проводим анонимный опрос удовлетворённости. Ссылка публикуется в #general. Результаты обсуждаются на общей встрече."}]},{"type":"paragraph","content":[{"type":"text","text":"💡 Идеи и предложения:"},{"type":"hardBreak"},{"type":"text","text":"• Канал #ideas в Slack — предлагай улучшения процессов, офиса, инструментов"},{"type":"hardBreak"},{"type":"text","text":"• Идеи обсуждаются на еженедельной встрече руководителей"}]},{"type":"paragraph","content":[{"type":"text","text":"⚠️ Жалобы и проблемы:"},{"type":"hardBreak"},{"type":"text","text":"• Если есть серьёзная проблема — не молчи. Обратись к HR или своему руководителю"},{"type":"hardBreak"},{"type":"text","text":"• Если проблема с руководителем — обратись напрямую к HR"},{"type":"hardBreak"},{"type":"text","text":"• Анонимность гарантируется при обращении через анонимную форму (ссылка в #hr-questions)"}]},{"type":"paragraph","content":[{"type":"text","text":"📌 Обратная связь — это не жалоба. Мы ценим конструктивные предложения и стараемся улучшать процессы на основе мнений команды."}]},{"type":"paragraph","content":[{"type":"text","text":"Контакты HR и других подразделений — "},{"type":"text","text":"Полезные контакты","marks":[{"type":"link","attrs":{"href":"/article/2","target":null,"class":null}}]},{"type":"text","text":"."}]}]}'::jsonb,
  'Нам важно твоё мнение! Вот как можно поделиться обратной связью:

💬 Напрямую руководителю:
Самый простой способ — поговорить со своим руководителем на 1-on-1 встрече. Обсуждай всё, что волнует: процессы, команду, рабочие условия.

📝 HR:
Если вопрос касается корпоративной культуры, условий работы или межличностных отношений — пиши @Anna Leonova. Все обращения конфиденциальны.

📊 Анонимные опросы:
Раз в квартал мы проводим анонимный опрос удовлетворённости. Ссылка публикуется в #general. Результаты обсуждаются на общей встрече.

💡 Идеи и предложения:
• Канал #ideas в Slack — предлагай улучшения процессов, офиса, инструментов
• Идеи обсуждаются на еженедельной встрече руководителей

⚠️ Жалобы и проблемы:
• Если есть серьёзная проблема — не молчи. Обратись к HR или своему руководителю
• Если проблема с руководителем — обратись напрямую к HR
• Анонимность гарантируется при обращении через анонимную форму (ссылка в #hr-questions)

📌 Обратная связь — это не жалоба. Мы ценим конструктивные предложения и стараемся улучшать процессы на основе мнений команды.

Контакты HR и других подразделений — [[2|Полезные контакты]].',
  true
)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  content_text = EXCLUDED.content_text,
  is_published = EXCLUDED.is_published;

-- Reset article ID sequence to max(id)+1
SELECT setval('articles_id_seq', (SELECT COALESCE(MAX(id), 0) FROM articles));
