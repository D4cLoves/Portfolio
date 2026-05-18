/**
 * Vercel Serverless Function — Contact Form Handler
 *
 * Handles POST /api/contact requests from the frontend.
 * Validates input, sends notification email to the site owner,
 * and a confirmation copy to the user via Nodemailer.
 *
 * Environment variables required (set in Vercel dashboard):
 * - SMTP_HOST: SMTP server hostname (e.g., smtp.mail.ru)
 * - SMTP_PORT: SMTP port (e.g., 465)
 * - SMTP_USER: SMTP login (e.g., vladislavvtr12@mail.ru)
 * - SMTP_PASS: App-specific password
 * - OWNER_EMAIL: Email to receive contact notifications
 * - OWNER_NAME: Display name for the owner
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

interface ContactData {
  name: string;
  email: string;
  phone?: string;
  comment?: string;
}

interface ValidationError {
  field: string;
  message: string;
}

function validate(data: unknown): { valid: true; data: ContactData } | { valid: false; errors: Record<string, string> } {
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: { _form: 'Некорректные данные' } };
  }

  const body = data as Record<string, unknown>;
  const errors: Record<string, string> = {};

  // Name — required, 1-100 chars
  const name = String(body.name ?? '').trim();
  if (!name) {
    errors.name = 'Имя обязательно для заполнения';
  } else if (name.length > 100) {
    errors.name = 'Имя не должно превышать 100 символов';
  }

  // Email — required, valid format
  const email = String(body.email ?? '').trim();
  if (!email) {
    errors.email = 'Email обязателен для заполнения';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Введите корректный email адрес';
  }

  // Phone — optional, validate format if provided
  const phone = String(body.phone ?? '').trim();
  if (phone && !/^\+?[\d\s\-()]{7,20}$/.test(phone)) {
    errors.phone = 'Введите корректный номер телефона';
  }

  // Comment — optional, max 1000 chars
  const comment = String(body.comment ?? '').trim();
  if (comment.length > 1000) {
    errors.comment = 'Комментарий не должен превышать 1000 символов';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      name,
      email,
      phone: phone || undefined,
      comment: comment || undefined,
    },
  };
}

// ---------------------------------------------------------------------------
// Email sending
// ---------------------------------------------------------------------------

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true, // SSL
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function ownerEmailHtml(data: ContactData): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a1a2e; padding: 24px 32px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; color: #fff; font-size: 20px;">📬 Новое сообщение с портфолио</h1>
      </div>
      <div style="padding: 32px; background: #fff; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="margin: 0 0 4px; font-size: 12px; color: #666; text-transform: uppercase;">Имя</p>
        <p style="margin: 0 0 20px; font-size: 16px; color: #1a1a2e; font-weight: 500;">${data.name}</p>

        <p style="margin: 0 0 4px; font-size: 12px; color: #666; text-transform: uppercase;">Email</p>
        <p style="margin: 0 0 20px; font-size: 16px;"><a href="mailto:${data.email}" style="color: #4a6cf7;">${data.email}</a></p>

        ${data.phone ? `
        <p style="margin: 0 0 4px; font-size: 12px; color: #666; text-transform: uppercase;">Телефон</p>
        <p style="margin: 0 0 20px; font-size: 16px;"><a href="tel:${data.phone}" style="color: #4a6cf7;">${data.phone}</a></p>
        ` : ''}

        ${data.comment ? `
        <p style="margin: 0 0 4px; font-size: 12px; color: #666; text-transform: uppercase;">Комментарий</p>
        <div style="padding: 16px; background: #f8f9fa; border-radius: 6px; border-left: 3px solid #4a6cf7;">
          <p style="margin: 0; font-size: 15px; color: #333; line-height: 1.6; white-space: pre-wrap;">${data.comment}</p>
        </div>
        ` : ''}
      </div>
    </div>
  `;
}

function userEmailHtml(data: ContactData, ownerName: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a1a2e; padding: 24px 32px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; color: #fff; font-size: 20px;">✉️ Сообщение получено</h1>
      </div>
      <div style="padding: 32px; background: #fff; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="margin: 0 0 16px; font-size: 16px; color: #333;">Здравствуйте, ${data.name}!</p>
        <p style="margin: 0 0 24px; font-size: 16px; color: #333; line-height: 1.6;">
          Спасибо за обращение! Я получил ваше сообщение и свяжусь с вами в ближайшее время.
        </p>

        <div style="padding: 20px; background: #f8f9fa; border-radius: 6px; border-left: 3px solid #4a6cf7;">
          <p style="margin: 0 0 8px; font-size: 13px; color: #666; font-weight: 600; text-transform: uppercase;">Копия вашего сообщения:</p>
          <p style="margin: 4px 0; font-size: 14px; color: #333;"><strong>Имя:</strong> ${data.name}</p>
          <p style="margin: 4px 0; font-size: 14px; color: #333;"><strong>Email:</strong> ${data.email}</p>
          ${data.phone ? `<p style="margin: 4px 0; font-size: 14px; color: #333;"><strong>Телефон:</strong> ${data.phone}</p>` : ''}
          ${data.comment ? `<p style="margin: 8px 0 0; font-size: 14px; color: #333;"><strong>Комментарий:</strong><br>${data.comment}</p>` : ''}
        </div>

        <p style="margin: 24px 0 0; font-size: 14px; color: #333; font-weight: 500;">${ownerName}</p>
        <p style="margin: 0; font-size: 12px; color: #999;">Fullstack-разработчик</p>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Validate input
  const result = validate(req.body);

  if (!result.valid) {
    return res.status(422).json({ success: false, errors: result.errors });
  }

  const { data } = result;
  const ownerEmail = process.env.OWNER_EMAIL!;
  const ownerName = process.env.OWNER_NAME || 'Vladislav Trubnikov';

  try {
    const transport = createTransport();

    // Send notification to owner
    await transport.sendMail({
      from: `"Портфолио" <${process.env.SMTP_USER}>`,
      to: ownerEmail,
      replyTo: data.email,
      subject: `Новое сообщение с портфолио от ${data.name}`,
      html: ownerEmailHtml(data),
    });

    // Send confirmation to user
    await transport.sendMail({
      from: `"${ownerName}" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: `Ваше сообщение получено — ${ownerName}`,
      html: userEmailHtml(data, ownerName),
    });

    return res.status(200).json({
      success: true,
      message: 'Сообщение отправлено! Я свяжусь с вами в ближайшее время.',
    });
  } catch (error) {
    console.error('Mail send error:', error);
    return res.status(500).json({
      success: false,
      error: 'Не удалось отправить сообщение. Попробуйте позже.',
    });
  }
}
