import { describe, it, expect, beforeEach } from 'vitest';
import { showFieldError, clearFieldErrors, setFormState } from '../../src/scripts/notification';

/**
 * Sets up a minimal DOM structure matching the contact form HTML.
 */
function setupDOM(): void {
  document.body.innerHTML = `
    <form class="contact__form">
      <div class="contact__field">
        <label for="name" class="contact__label">Имя</label>
        <input type="text" id="name" class="contact__input" />
        <span class="contact__error"></span>
      </div>
      <div class="contact__field">
        <label for="phone" class="contact__label">Телефон</label>
        <input type="tel" id="phone" class="contact__input" />
        <span class="contact__error"></span>
      </div>
      <div class="contact__field">
        <label for="email" class="contact__label">Email</label>
        <input type="email" id="email" class="contact__input" />
        <span class="contact__error"></span>
      </div>
      <div class="contact__field">
        <label for="comment" class="contact__label">Комментарий</label>
        <textarea id="comment" class="contact__input contact__textarea"></textarea>
        <span class="contact__error"></span>
      </div>
      <button type="submit" class="contact__submit">Отправить сообщение</button>
    </form>
    <div class="contact__notification" role="alert"></div>
  `;
}

describe('notification.ts', () => {
  beforeEach(() => {
    setupDOM();
  });

  describe('showFieldError', () => {
    it('adds error class to the input', () => {
      showFieldError('name', 'Имя обязательно');
      const input = document.getElementById('name')!;
      expect(input.classList.contains('contact__input--error')).toBe(true);
    });

    it('sets error message in the sibling error span', () => {
      showFieldError('email', 'Введите корректный email');
      const field = document.getElementById('email')!.closest('.contact__field')!;
      const errorSpan = field.querySelector('.contact__error')!;
      expect(errorSpan.textContent).toBe('Введите корректный email');
    });

    it('does nothing for a non-existent field', () => {
      // Should not throw
      showFieldError('nonexistent', 'Error');
    });

    it('can show errors on multiple fields', () => {
      showFieldError('name', 'Error 1');
      showFieldError('email', 'Error 2');

      const nameInput = document.getElementById('name')!;
      const emailInput = document.getElementById('email')!;
      expect(nameInput.classList.contains('contact__input--error')).toBe(true);
      expect(emailInput.classList.contains('contact__input--error')).toBe(true);
    });
  });

  describe('clearFieldErrors', () => {
    it('removes error class from all inputs', () => {
      showFieldError('name', 'Error');
      showFieldError('email', 'Error');
      clearFieldErrors();

      const nameInput = document.getElementById('name')!;
      const emailInput = document.getElementById('email')!;
      expect(nameInput.classList.contains('contact__input--error')).toBe(false);
      expect(emailInput.classList.contains('contact__input--error')).toBe(false);
    });

    it('clears all error span text content', () => {
      showFieldError('name', 'Error 1');
      showFieldError('phone', 'Error 2');
      clearFieldErrors();

      const errorSpans = document.querySelectorAll('.contact__error');
      errorSpans.forEach((span) => {
        expect(span.textContent).toBe('');
      });
    });

    it('does nothing when no errors are present', () => {
      // Should not throw
      clearFieldErrors();
    });
  });

  describe('setFormState', () => {
    it('idle: enables button and clears notification', () => {
      setFormState('loading');
      setFormState('idle');

      const button = document.querySelector('.contact__submit') as HTMLButtonElement;
      const notification = document.querySelector('.contact__notification')!;

      expect(button.disabled).toBe(false);
      expect(notification.textContent).toBe('');
      expect(notification.classList.contains('contact__notification--success')).toBe(false);
      expect(notification.classList.contains('contact__notification--error')).toBe(false);
    });

    it('loading: disables button and shows loading text', () => {
      setFormState('loading');

      const button = document.querySelector('.contact__submit') as HTMLButtonElement;
      const notification = document.querySelector('.contact__notification')!;

      expect(button.disabled).toBe(true);
      expect(button.classList.contains('contact__submit--loading')).toBe(true);
      expect(notification.textContent).toBe('Отправка...');
    });

    it('success: enables button and shows success message', () => {
      setFormState('success', 'Сообщение отправлено!');

      const button = document.querySelector('.contact__submit') as HTMLButtonElement;
      const notification = document.querySelector('.contact__notification')!;

      expect(button.disabled).toBe(false);
      expect(notification.textContent).toBe('Сообщение отправлено!');
      expect(notification.classList.contains('contact__notification--success')).toBe(true);
    });

    it('success: uses default message when none provided', () => {
      setFormState('success');

      const notification = document.querySelector('.contact__notification')!;
      expect(notification.textContent).toBe('Сообщение отправлено!');
    });

    it('error: enables button and shows error message', () => {
      setFormState('error', 'Ошибка сети');

      const button = document.querySelector('.contact__submit') as HTMLButtonElement;
      const notification = document.querySelector('.contact__notification')!;

      expect(button.disabled).toBe(false);
      expect(notification.textContent).toBe('Ошибка сети');
      expect(notification.classList.contains('contact__notification--error')).toBe(true);
    });

    it('error: uses default message when none provided', () => {
      setFormState('error');

      const notification = document.querySelector('.contact__notification')!;
      expect(notification.textContent).toBe('Произошла ошибка. Попробуйте ещё раз.');
    });

    it('loading removes previous success/error classes', () => {
      setFormState('success', 'Done');
      setFormState('loading');

      const notification = document.querySelector('.contact__notification')!;
      expect(notification.classList.contains('contact__notification--success')).toBe(false);
      expect(notification.classList.contains('contact__notification--error')).toBe(false);
    });

    it('transitions from loading to error correctly', () => {
      setFormState('loading');
      setFormState('error', 'Failed');

      const button = document.querySelector('.contact__submit') as HTMLButtonElement;
      const notification = document.querySelector('.contact__notification')!;

      expect(button.disabled).toBe(false);
      expect(button.classList.contains('contact__submit--loading')).toBe(false);
      expect(notification.textContent).toBe('Failed');
      expect(notification.classList.contains('contact__notification--error')).toBe(true);
    });
  });
});
