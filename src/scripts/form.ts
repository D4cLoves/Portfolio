/**
 * Form Orchestrator Module
 *
 * Connects DOM events to validation and notification modules.
 * Handles the complete form submission lifecycle:
 * - Extracts field values from the DOM
 * - Validates input via the validator module
 * - Displays errors via the notification module
 * - Manages loading/success/error states during submission
 *
 * Validates: Requirements 6.5, 7.1, 7.2, 7.3, 7.4, 7.5
 */

import { validateForm, type FormData } from './validator';
import { showFieldError, clearFieldErrors, setFormState } from './notification';

/**
 * Configuration for the form orchestrator.
 */
export interface FormConfig {
  formSelector: string;
  apiEndpoint: string; // placeholder URL for future backend
}

/**
 * Extracts form field values from the DOM by their element IDs.
 *
 * @returns FormData object with current field values
 */
function extractFormData(): FormData {
  const name = (document.getElementById('name') as HTMLInputElement | null)?.value ?? '';
  const phone = (document.getElementById('phone') as HTMLInputElement | null)?.value ?? '';
  const email = (document.getElementById('email') as HTMLInputElement | null)?.value ?? '';
  const comment = (document.getElementById('comment') as HTMLTextAreaElement | null)?.value ?? '';

  return { name, phone, email, comment };
}

/**
 * Attaches input event listeners to form fields to clear individual
 * field errors when the user starts typing.
 *
 * @param form - The form element containing the input fields
 */
function attachInputListeners(form: HTMLFormElement): void {
  const fieldIds: Array<keyof FormData> = ['name', 'phone', 'email', 'comment'];

  for (const fieldId of fieldIds) {
    const input = form.querySelector(`#${fieldId}`);
    if (!input) continue;

    input.addEventListener('input', () => {
      // Remove error styling from this specific input
      input.classList.remove('contact__input--error');

      // Clear the error message for this field
      const fieldContainer = input.closest('.contact__field');
      if (fieldContainer) {
        const errorSpan = fieldContainer.querySelector('.contact__error');
        if (errorSpan) {
          errorSpan.textContent = '';
        }
      }
    });
  }
}

/**
 * Handles the form submission process.
 *
 * Validates input, displays errors if invalid, or submits to the API
 * endpoint and manages loading/success/error states.
 *
 * @param config - Form configuration with API endpoint
 */
async function handleSubmit(config: FormConfig): Promise<void> {
  // Clear any previous field errors
  clearFieldErrors();

  // Extract current field values
  const data = extractFormData();

  // Validate all fields
  const result = validateForm(data);

  // If validation fails, show errors for each invalid field and stop
  if (!result.valid) {
    for (const [field, message] of Object.entries(result.errors)) {
      showFieldError(field, message);
    }
    return;
  }

  // Validation passed — begin submission flow
  setFormState('loading');

  try {
    const response = await fetch(config.apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setFormState('success', 'Сообщение отправлено! Я свяжусь с вами в ближайшее время.');
    } else {
      setFormState('error', 'Не удалось отправить сообщение. Попробуйте позже.');
    }
  } catch {
    // Network error (no connection, DNS failure, etc.)
    setFormState('error', 'Ошибка сети. Проверьте подключение и попробуйте снова.');
  }
}

/**
 * Initializes the form orchestrator.
 *
 * Finds the form element, attaches the submit event listener,
 * and sets up per-field input listeners for clearing errors on typing.
 *
 * @param config - Configuration with form selector and API endpoint
 */
export function initForm(config: FormConfig): void {
  const form = document.querySelector(config.formSelector) as HTMLFormElement | null;
  if (!form) return;

  // Attach input listeners to clear errors on typing
  attachInputListeners(form);

  // Attach submit handler
  form.addEventListener('submit', (event: Event) => {
    event.preventDefault();
    handleSubmit(config);
  });
}
