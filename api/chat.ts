/**
 * Vercel Serverless Function — AI Chat Assistant
 *
 * Provides an AI-powered Q&A about the developer.
 * Uses Google Gemini API (free tier) with developer context.
 * Demonstrates: API integration, prompt engineering, error handling.
 *
 * Environment variables required:
 * - GEMINI_API_KEY: Google AI Studio API key (free at aistudio.google.com)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// ---------------------------------------------------------------------------
// Developer context — fed to the AI as system knowledge
// ---------------------------------------------------------------------------

const DEVELOPER_CONTEXT = `
Ты — AI-ассистент на портфолио Владислава Трубникова. Отвечай кратко, дружелюбно, по делу. На русском языке.
Отвечай только на вопросы о Владиславе и его работе. На нерелевантные вопросы вежливо перенаправляй к теме.

ИНФОРМАЦИЯ О РАЗРАБОТЧИКЕ:

Имя: Владислав Трубников
Роль: Fullstack-разработчик

Стек:
- Основной: PHP, JavaScript, PostgreSQL, HTML5/CSS3, Git
- Дополнительный: ASP.NET, React, TypeScript, Docker, Redis

Опыт:
- 1 год коммерческой разработки (Октябрь 2024 — Сентябрь 2025)
- Платформа для создания сайтов — fullstack end-to-end: от БД до фичи в проде

Направления:
- Веб-приложения и конструкторы сайтов
- Клиентские интерфейсы (UX/UI + код)
- Серверная логика и оптимизация запросов
- Редизайн и унификация легаси-модулей

Подход к работе:
- Сначала понимает зачем, потом пишет код
- Делает рабочий минимум быстрее идеальной архитектуры
- Если задача ясна — сразу в продакшн с контролем ошибок

AI в работе:
- Использует для ускорения рутины: скелеты кода, тесты, рефакторинг
- Решения и ответственность — на нём. AI не знает бизнес клиента.

Коммерческие проекты:
1. Поиск по сайту — полнотекстовый индекс PostgreSQL, PHP бэкенд, JS фронт с дебаунсом. Результат: 3 клика вместо 10.
2. Редизайн модулей — унифицировал 5 модулей под единый UI/UX. Результат: пользователи перестали путаться.
3. Адаптивный онбординг — умное раскрытие разделов. Результат: -40% лишних действий.
4. Критичный баг в редакторе — данные обновляются без перезагрузки. Результат: стабильный редактор.

Личные проекты:
1. Momentum — трекер фокуса (React 19, TypeScript, ASP.NET Core, PostgreSQL, Redis, Docker)
2. Sakura Chess — шахматы с ИИ Lc0 (WPF, .NET 8, Material Design)
3. MediCare — медицинская система (ASP.NET Core 9, React 19, TypeScript, EF Core)

Контакт: через форму на сайте.
`;

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body as { message?: string };

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Сообщение не может быть пустым' });
  }

  if (message.length > 500) {
    return res.status(400).json({ error: 'Сообщение слишком длинное (макс. 500 символов)' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'AI-сервис временно недоступен' });
  }

  try {
    // Google Gemini API endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: DEVELOPER_CONTEXT }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: message.trim() }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', response.status, errorData);
      return res.status(502).json({ error: 'Не удалось получить ответ от AI' });
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Не удалось сформировать ответ.';

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Ошибка при обращении к AI-сервису' });
  }
}
