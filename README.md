# 🚀 Developer Portfolio — Vladislav Trubnikov

Лендинг-презентация разработчика. Тестовое задание.

**[Демо →](https://portfolio-d4cloves.vercel.app)** *(ссылка появится после деплоя)*

---

## 📋 О проекте

Современный одностраничный сайт-портфолио, демонстрирующий навыки frontend-разработки, работу с API и организацию проекта.

### Что реализовано

| Раздел | Описание |
|--------|----------|
| **Hero** | Имя, фото, профессиональный тэглайн |
| **Обо мне** | Стек технологий, опыт, направления разработки |
| **Подход** | Принципы работы, использование AI |
| **Кейсы** | Коммерческие и личные проекты с результатами |
| **Контакты** | Форма обратной связи с отправкой писем |
| **AI-ассистент** | Чат-виджет с OpenAI — отвечает на вопросы о разработчике |

### Форма обратной связи

- Поля: имя, телефон, email, комментарий
- Клиентская валидация с inline-ошибками
- Состояния: loading / success / error
- После отправки: письмо владельцу + копия пользователю
- Обработка сетевых ошибок

---

## 🛠 Стек

### Frontend
- **TypeScript** — типизированная логика
- **HTML5** — семантическая разметка (header, nav, main, section, footer)
- **SCSS** — модульные стили с BEM-нейминг
- **Vite** — сборка и dev-сервер

### Backend (Serverless)
- **Vercel Serverless Functions** — обработка формы
- **Nodemailer** — отправка писем через SMTP

### Backend (Symfony — альтернативная реализация)
- **PHP 8.2+** / **Symfony 7.1**
- Чистая архитектура: Controller → DTO → Service
- Валидация через атрибуты, Twig-шаблоны для писем

### Тестирование
- **Vitest** — unit-тесты
- **fast-check** — property-based тесты
- **jsdom** — DOM-окружение

---

## 📁 Структура проекта

```
├── index.html                  # Точка входа — семантическая разметка
├── src/
│   ├── main.ts                 # Entry point — инициализация модулей
│   ├── scripts/
│   │   ├── validator.ts        # Чистая валидация (без DOM)
│   │   ├── notification.ts     # UI-состояния формы
│   │   ├── form.ts             # Оркестрация отправки
│   │   ├── navigation.ts       # Smooth scroll + active section
│   │   └── animations.ts      # Scroll-анимации (Intersection Observer)
│   ├── styles/
│   │   ├── main.scss           # Импорт всех партиалов
│   │   ├── _variables.scss     # CSS custom properties, breakpoints
│   │   ├── _reset.scss         # Normalize
│   │   ├── _typography.scss    # Шрифты, текстовые стили
│   │   ├── _layout.scss        # Grid, container, responsive
│   │   ├── _navigation.scss    # Sticky nav
│   │   ├── _hero.scss          # Hero-секция
│   │   ├── _about.scss         # Стек и опыт
│   │   ├── _approach.scss      # Подход к работе
│   │   ├── _cases.scss         # Карточки проектов
│   │   ├── _contact.scss       # Форма + состояния
│   │   └── _animations.scss    # Entrance + hover эффекты
│   └── assets/
│       └── photo_*.jpg         # Фото разработчика
├── api/
│   └── contact.ts              # Vercel serverless — отправка писем
├── backend/                    # Symfony-реализация (PHP)
│   ├── src/
│   │   ├── Controller/         # API-контроллер
│   │   ├── Dto/                # Иммутабельный DTO с валидацией
│   │   ├── Service/            # Бизнес-логика отправки
│   │   └── EventSubscriber/    # JSON-ответы на ошибки
│   └── templates/emails/       # Twig-шаблоны писем
├── tests/
│   ├── unit/                   # Unit-тесты модулей
│   └── properties/             # Property-based тесты
├── vite.config.ts              # Конфигурация сборки
├── vitest.config.ts            # Конфигурация тестов
├── vercel.json                 # Настройки деплоя Vercel
└── package.json
```

---

## 🚀 Запуск

### Локальная разработка

```bash
npm install
npm run dev
```

### Сборка

```bash
npm run build     # → dist/
```

### Тесты

```bash
npm test          # Запуск всех тестов
npm run test:watch  # Watch-режим
```

---

## 🌐 Деплой (Vercel)

1. Подключить репозиторий на [vercel.com](https://vercel.com)
2. Добавить Environment Variables:
   - `SMTP_HOST` — хост SMTP-сервера
   - `SMTP_PORT` — порт (465)
   - `SMTP_USER` — логин почты
   - `SMTP_PASS` — пароль приложения
   - `OWNER_EMAIL` — email для уведомлений
   - `OWNER_NAME` — имя владельца
   - `OPENAI_API_KEY` — ключ OpenAI API (для AI-чата)
3. Deploy — Vercel автоматически соберёт фронт и подхватит serverless-функцию

---

## 🎨 Ключевые решения

| Решение | Обоснование |
|---------|-------------|
| Vanilla TypeScript | Задание требует JS/TS + HTML + SCSS; фреймворк избыточен для одной страницы |
| SCSS + BEM | Модульность, предсказуемость, нет конфликтов специфичности |
| Intersection Observer | Нативный API для анимаций, без библиотек |
| CSS Custom Properties | Единый источник правды для темы |
| Чистые функции валидации | Тестируемость, переиспользуемость, нет зависимости от DOM |
| Два бэкенда | Serverless для деплоя + Symfony для демонстрации PHP-навыков |

---

## 📱 Адаптивность

- Mobile-first подход
- Breakpoints: 320px → 768px → 1024px → 1440px
- Одна колонка на мобильных, мульти-колонка на десктопе
- `prefers-reduced-motion` — отключение анимаций для accessibility

---

## ✅ Что демонстрирует проект

- [x] Frontend: семантический HTML, модульный SCSS, типизированный JS
- [x] Работа с API: валидация, отправка, обработка ошибок, loading-состояния
- [x] AI-инструменты: использованы для генерации скелетов, тестов, рефакторинга
- [x] AI-интеграция: чат-виджет с OpenAI API — посетитель может задать вопрос о разработчике
- [x] Организация проекта: чёткая структура, разделение ответственности, тесты
