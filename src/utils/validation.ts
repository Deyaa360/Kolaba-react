/**
 * Validation Utilities
 * Reusable validation functions for form inputs across the app
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email format
 * @param email - Email string to validate
 * @returns Validation result with error message if invalid
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim().length === 0) {
    return {
      isValid: false,
      error: 'Email is required',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return {
      isValid: false,
      error: 'Please enter a valid email address',
    };
  }

  return { isValid: true };
};

/**
 * Validate password strength
 * @param password - Password string to validate
 * @param options - Optional validation options
 * @returns Validation result with error message if invalid
 */
export const validatePassword = (
  password: string,
  options: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumber?: boolean;
    requireSpecialChar?: boolean;
  } = {}
): ValidationResult => {
  const {
    minLength = 8,
    requireUppercase = false,
    requireLowercase = false,
    requireNumber = false,
    requireSpecialChar = false,
  } = options;

  if (!password || password.length === 0) {
    return {
      isValid: false,
      error: 'Password is required',
    };
  }

  if (password.length < minLength) {
    return {
      isValid: false,
      error: `Password must be at least ${minLength} characters`,
    };
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter',
    };
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one lowercase letter',
    };
  }

  if (requireNumber && !/\d/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one number',
    };
  }

  if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one special character',
    };
  }

  return { isValid: true };
};

/**
 * Validate password confirmation matches
 * @param password - Original password
 * @param confirmPassword - Password confirmation
 * @returns Validation result
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Passwords do not match',
    };
  }

  return { isValid: true };
};

/**
 * Validate display name
 * @param name - Display name to validate
 * @param options - Optional validation options
 * @returns Validation result
 */
export const validateDisplayName = (
  name: string,
  options: { minLength?: number; maxLength?: number } = {}
): ValidationResult => {
  const { minLength = 2, maxLength = 50 } = options;

  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      error: 'Display name is required',
    };
  }

  if (name.trim().length < minLength) {
    return {
      isValid: false,
      error: `Display name must be at least ${minLength} characters`,
    };
  }

  if (name.trim().length > maxLength) {
    return {
      isValid: false,
      error: `Display name must be less than ${maxLength} characters`,
    };
  }

  return { isValid: true };
};

/**
 * Validate URL format
 * @param url - URL string to validate
 * @param optional - Whether the URL is optional (can be empty)
 * @returns Validation result
 */
export const validateUrl = (url: string, optional: boolean = false): ValidationResult => {
  if (!url || url.trim().length === 0) {
    if (optional) {
      return { isValid: true };
    }
    return {
      isValid: false,
      error: 'URL is required',
    };
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return {
      isValid: false,
      error: 'Please enter a valid URL (e.g., https://example.com)',
    };
  }
};

/**
 * Validate phone number (basic validation)
 * @param phone - Phone number to validate
 * @param optional - Whether the phone is optional
 * @returns Validation result
 */
export const validatePhone = (phone: string, optional: boolean = false): ValidationResult => {
  if (!phone || phone.trim().length === 0) {
    if (optional) {
      return { isValid: true };
    }
    return {
      isValid: false,
      error: 'Phone number is required',
    };
  }

  // Basic validation: numbers, spaces, dashes, parentheses, plus sign
  const phoneRegex = /^[\d\s\-\(\)\+]+$/;
  if (!phoneRegex.test(phone)) {
    return {
      isValid: false,
      error: 'Please enter a valid phone number',
    };
  }

  // Check if it has at least 10 digits
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10) {
    return {
      isValid: false,
      error: 'Phone number must contain at least 10 digits',
    };
  }

  return { isValid: true };
};

/**
 * Validate required field (generic)
 * @param value - Value to validate
 * @param fieldName - Name of the field for error message
 * @returns Validation result
 */
export const validateRequired = (value: any, fieldName: string = 'This field'): ValidationResult => {
  if (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim().length === 0)
  ) {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  return { isValid: true };
};

/**
 * Validate Instagram handle format
 * @param handle - Instagram handle (with or without @)
 * @param optional - Whether the handle is optional
 * @returns Validation result
 */
export const validateInstagramHandle = (
  handle: string,
  optional: boolean = false
): ValidationResult => {
  if (!handle || handle.trim().length === 0) {
    if (optional) {
      return { isValid: true };
    }
    return {
      isValid: false,
      error: 'Instagram handle is required',
    };
  }

  // Remove @ if present
  const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle;

  // Instagram username rules: alphanumeric, periods, underscores, 1-30 chars
  const instagramRegex = /^[a-zA-Z0-9._]{1,30}$/;
  if (!instagramRegex.test(cleanHandle)) {
    return {
      isValid: false,
      error: 'Please enter a valid Instagram handle (letters, numbers, periods, underscores)',
    };
  }

  return { isValid: true };
};
