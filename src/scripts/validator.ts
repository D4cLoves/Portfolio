/**
 * Form Validation Module
 *
 * Pure validation logic for the contact form with no DOM dependencies.
 * All functions are side-effect free and operate solely on input data,
 * making them easy to test in isolation.
 */

/**
 * Defines a validation rule for a single form field.
 * Each property is optional — only specified constraints are checked.
 */
export interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
}

/**
 * Result of validating the entire form.
 * `valid` is true only when all fields pass validation.
 * `errors` maps field names to their corresponding error messages.
 */
export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

/**
 * Represents the contact form data structure.
 * All fields are strings — empty string indicates no input.
 */
export interface FormData {
  name: string;
  phone: string;
  email: string;
  comment: string;
}

/**
 * Validation rules for each form field.
 *
 * - name: required, 1–100 characters
 * - phone: optional, must match international phone pattern if provided
 * - email: required, must match basic email format
 * - comment: optional, max 1000 characters
 */
export const VALIDATION_RULES: Record<keyof FormData, ValidationRule> = {
  name: { required: true, minLength: 1, maxLength: 100 },
  phone: { required: false, pattern: /^\+?[\d\s\-()]{7,20}$/ },
  email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  comment: { required: false, maxLength: 1000 },
};

/**
 * Error messages in Russian for each validation failure scenario.
 */
const ERROR_MESSAGES: Record<string, string> = {
  nameRequired: 'Имя обязательно для заполнения',
  nameTooLong: 'Имя не должно превышать 100 символов',
  emailRequired: 'Email обязателен для заполнения',
  emailInvalid: 'Введите корректный email адрес',
  phoneInvalid: 'Введите корректный номер телефона',
  commentTooLong: 'Комментарий не должен превышать 1000 символов',
};

/**
 * Validates a single form field against its corresponding rule.
 *
 * Returns an error message string if validation fails, or null if the field is valid.
 * This is a pure function — no side effects, no DOM access.
 *
 * @param field - The field name (key of FormData)
 * @param value - The current value of the field
 * @returns Error message or null
 */
export function validateField(field: keyof FormData, value: string): string | null {
  const rule = VALIDATION_RULES[field];
  const trimmedValue = value.trim();

  // Check required constraint — empty or whitespace-only fails
  if (rule.required && trimmedValue.length === 0) {
    if (field === 'name') return ERROR_MESSAGES.nameRequired;
    if (field === 'email') return ERROR_MESSAGES.emailRequired;
  }

  // Check maxLength constraint
  if (rule.maxLength !== undefined && value.length > rule.maxLength) {
    if (field === 'name') return ERROR_MESSAGES.nameTooLong;
    if (field === 'comment') return ERROR_MESSAGES.commentTooLong;
  }

  // Check pattern constraint — only validate non-empty values for optional fields
  if (rule.pattern && trimmedValue.length > 0) {
    if (!rule.pattern.test(value)) {
      if (field === 'email') return ERROR_MESSAGES.emailInvalid;
      if (field === 'phone') return ERROR_MESSAGES.phoneInvalid;
    }
  }

  return null;
}

/**
 * Validates the entire form data object.
 *
 * Runs validation on every field and collects all errors simultaneously.
 * Returns a ValidationResult indicating overall validity and per-field errors.
 * This is a pure function — no side effects, no DOM access.
 *
 * @param data - The complete form data to validate
 * @returns ValidationResult with validity flag and error map
 */
export function validateForm(data: FormData): ValidationResult {
  const errors: Record<string, string> = {};

  // Validate each field independently to report all errors at once
  for (const field of Object.keys(VALIDATION_RULES) as Array<keyof FormData>) {
    const error = validateField(field, data[field]);
    if (error !== null) {
      errors[field] = error;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
