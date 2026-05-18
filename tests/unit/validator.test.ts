import { describe, it, expect } from 'vitest';
import { validateField, validateForm, VALIDATION_RULES } from '../../src/scripts/validator';
import type { FormData } from '../../src/scripts/validator';

describe('validator.ts', () => {
  describe('validateField', () => {
    it('returns error for empty name', () => {
      expect(validateField('name', '')).toBe('Имя обязательно для заполнения');
    });

    it('returns error for whitespace-only name', () => {
      expect(validateField('name', '   ')).toBe('Имя обязательно для заполнения');
    });

    it('returns null for valid name', () => {
      expect(validateField('name', 'Vladislav')).toBeNull();
    });

    it('returns error for name exceeding 100 characters', () => {
      const longName = 'a'.repeat(101);
      expect(validateField('name', longName)).toBe('Имя не должно превышать 100 символов');
    });

    it('returns error for empty email', () => {
      expect(validateField('email', '')).toBe('Email обязателен для заполнения');
    });

    it('returns error for invalid email format', () => {
      expect(validateField('email', 'not-an-email')).toBe('Введите корректный email адрес');
    });

    it('returns null for valid email', () => {
      expect(validateField('email', 'user@example.com')).toBeNull();
    });

    it('returns null for empty phone (optional field)', () => {
      expect(validateField('phone', '')).toBeNull();
    });

    it('returns error for invalid phone format', () => {
      expect(validateField('phone', 'abc')).toBe('Введите корректный номер телефона');
    });

    it('returns null for valid phone', () => {
      expect(validateField('phone', '+7 (999) 123-45-67')).toBeNull();
    });

    it('returns null for empty comment (optional field)', () => {
      expect(validateField('comment', '')).toBeNull();
    });

    it('returns error for comment exceeding 1000 characters', () => {
      const longComment = 'a'.repeat(1001);
      expect(validateField('comment', longComment)).toBe('Комментарий не должен превышать 1000 символов');
    });
  });

  describe('validateForm', () => {
    it('returns valid result for correct form data', () => {
      const data: FormData = {
        name: 'Vladislav',
        phone: '+7 999 123 4567',
        email: 'vlad@example.com',
        comment: 'Hello!',
      };
      const result = validateForm(data);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('returns all errors for completely invalid form', () => {
      const data: FormData = {
        name: '',
        phone: 'invalid',
        email: '',
        comment: 'a'.repeat(1001),
      };
      const result = validateForm(data);
      expect(result.valid).toBe(false);
      expect(result.errors.name).toBe('Имя обязательно для заполнения');
      expect(result.errors.email).toBe('Email обязателен для заполнения');
      expect(result.errors.phone).toBe('Введите корректный номер телефона');
      expect(result.errors.comment).toBe('Комментарий не должен превышать 1000 символов');
    });

    it('validates all fields simultaneously', () => {
      const data: FormData = {
        name: '',
        phone: '',
        email: 'bad',
        comment: '',
      };
      const result = validateForm(data);
      expect(result.valid).toBe(false);
      expect(Object.keys(result.errors)).toHaveLength(2); // name + email
    });
  });

  describe('VALIDATION_RULES', () => {
    it('defines rules for all form fields', () => {
      expect(VALIDATION_RULES).toHaveProperty('name');
      expect(VALIDATION_RULES).toHaveProperty('phone');
      expect(VALIDATION_RULES).toHaveProperty('email');
      expect(VALIDATION_RULES).toHaveProperty('comment');
    });
  });
});
