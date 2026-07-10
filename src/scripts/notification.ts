/**
 * Notification Handler Module
 *
 * Manages UI feedback states for the contact form:
 * - Inline field error display/clearing
 * - Form-level state management (idle, loading, success, error)
 * - Submit button enable/disable based on state
 *
 * Validates: Requirements 7.1, 7.2, 7.3, 7.4
 */

/**
 * Possible states for the form notification area.
 */
export type NotificationState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Configuration for the notification handler.
 */
export interface NotificationConfig {
  formSelector: string;
  messageSelector: string;
  submitButtonSelector: string;
}

/** Default selectors matching the contact form HTML structure */
const DEFAULT_CONFIG: NotificationConfig = {
  formSelector: '.contact__form',
  messageSelector: '#contact-status',
  submitButtonSelector: '.contact__submit-btn',
};

/** CSS classes used for state management */
const CSS_CLASSES = {
  inputError: 'contact__input--error',
  submitLoading: 'contact__submit--loading',
  notificationSuccess: 'contact__status--success',
  notificationError: 'contact__status--error',
} as const;

/**
 * Displays an inline error message below the specified input field.
 *
 * Finds the input by its id attribute, locates the sibling `.contact__error` span,
 * sets its text content to the error message, and adds the error class to the input.
 *
 * @param field - The id of the input element (e.g., 'name', 'email')
 * @param message - The error message to display
 */
export function showFieldError(field: string, message: string): void {
  const input = document.getElementById(field);
  if (!input) return;

  // Add error styling to the input
  input.classList.add(CSS_CLASSES.inputError);

  // Find the sibling error span within the same .contact__field container
  const fieldContainer = input.closest('.contact__field');
  if (!fieldContainer) return;

  const errorSpan = fieldContainer.querySelector('.contact__error');
  if (errorSpan) {
    errorSpan.textContent = message;
  }
}

/**
 * Removes all inline error messages and error styling from the form.
 *
 * Clears all `.contact__error` span text content and removes
 * the `.contact__input--error` class from all inputs.
 */
export function clearFieldErrors(): void {
  // Remove error class from all inputs
  const errorInputs = document.querySelectorAll(`.${CSS_CLASSES.inputError}`);
  errorInputs.forEach((input) => {
    input.classList.remove(CSS_CLASSES.inputError);
  });

  // Clear all error message spans
  const errorSpans = document.querySelectorAll('.contact__error');
  errorSpans.forEach((span) => {
    span.textContent = '';
  });
}

/**
 * Sets the overall form state and updates the UI accordingly.
 *
 * - `idle`: Enables submit button, clears notification area
 * - `loading`: Disables submit button, shows loading indicator text
 * - `success`: Enables submit button, shows success message
 * - `error`: Enables submit button, shows error message
 *
 * @param state - The desired form state
 * @param message - Optional message to display (used for success/error states)
 */
export function setFormState(state: NotificationState, message?: string): void {
  const submitButton = document.querySelector(
    DEFAULT_CONFIG.submitButtonSelector
  ) as HTMLButtonElement | null;
  const notification = document.querySelector(
    DEFAULT_CONFIG.messageSelector
  ) as HTMLElement | null;

  if (!submitButton || !notification) return;

  // Clear previous notification classes
  notification.classList.remove(
    CSS_CLASSES.notificationSuccess,
    CSS_CLASSES.notificationError
  );

  // Remove loading class from button
  submitButton.classList.remove(CSS_CLASSES.submitLoading);

  switch (state) {
    case 'idle':
      submitButton.disabled = false;
      notification.textContent = '';
      break;

    case 'loading':
      submitButton.disabled = true;
      submitButton.classList.add(CSS_CLASSES.submitLoading);
      notification.textContent = 'Отправка...';
      break;

    case 'success':
      submitButton.disabled = false;
      notification.textContent = message || 'Сообщение отправлено!';
      notification.classList.add(CSS_CLASSES.notificationSuccess);
      break;

    case 'error':
      submitButton.disabled = false;
      notification.textContent = message || 'Произошла ошибка. Попробуйте ещё раз.';
      notification.classList.add(CSS_CLASSES.notificationError);
      break;
  }
}
