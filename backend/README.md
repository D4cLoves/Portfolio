# Portfolio Backend — Contact Form API

Symfony-бэкенд для обработки контактной формы портфолио.

## Стек

- PHP 8.2+
- Symfony 7.1 (framework-bundle, mailer, validator, twig-bundle)
- NelmioCorsBundle (CORS для фронтенда)

## Установка

```bash
cd backend
composer install
```

## Настройка

1. Скопируйте `.env.example` в `.env` (если ещё не скопирован):
   ```bash
   cp .env.example .env
   ```

2. Отредактируйте `.env` — укажите реальные значения:
   - `APP_SECRET` — случайная строка для безопасности фреймворка
   - `MAILER_DSN` — DSN вашего SMTP-сервера (например, `smtp://user:pass@smtp.gmail.com:587`)
   - `OWNER_EMAIL` — email, на который приходят уведомления
   - `OWNER_NAME` — имя владельца сайта

## Запуск (dev)

```bash
# Встроенный PHP-сервер
php -S localhost:8000 -t public

# Или Symfony CLI (если установлен)
symfony server:start
```

## API

### POST /api/contact

Принимает JSON:

```json
{
  "name": "Иван Иванов",
  "email": "ivan@example.com",
  "phone": "+7 (999) 123-45-67",
  "comment": "Хочу обсудить проект"
}
```

#### Успех (200):
```json
{
  "success": true,
  "message": "Сообщение отправлено! Я свяжусь с вами в ближайшее время."
}
```

#### Ошибка валидации (422):
```json
{
  "success": false,
  "errors": {
    "name": "Имя обязательно для заполнения",
    "email": "Введите корректный email адрес"
  }
}
```

#### Ошибка сервера (500):
```json
{
  "success": false,
  "error": "Не удалось отправить сообщение. Попробуйте позже."
}
```

## Архитектура

```
src/
├── Kernel.php                          # Минимальное ядро Symfony
├── Controller/ContactController.php    # API-контроллер формы
├── Dto/ContactRequest.php              # DTO с валидацией
├── Service/ContactMailer.php           # Сервис отправки писем
└── EventSubscriber/ExceptionSubscriber.php  # JSON-ответы на ошибки
```

- **DTO** — иммутабельный объект с декларативной валидацией через атрибуты
- **Service** — бизнес-логика отправки писем вынесена из контроллера
- **EventSubscriber** — перехватывает исключения и возвращает JSON вместо HTML

## CORS

Настроен через NelmioCorsBundle. В dev-режиме разрешены запросы с любого origin.
Для продакшна замените `'*'` на URL фронтенда в `config/packages/nelmio_cors.yaml`.

## Продакшн

1. Установите `APP_ENV=prod` в `.env`
2. Укажите реальный `MAILER_DSN`
3. Сгенерируйте случайный `APP_SECRET`
4. Настройте веб-сервер (nginx/Apache) с document root на `public/`
