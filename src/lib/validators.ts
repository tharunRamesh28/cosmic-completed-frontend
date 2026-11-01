export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.step', '.stp', '.zip', '.gbr', '.gerber', '.dwg', '.png'] as const;
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^[+]?[0-9\s().-]{7,25}$/;

/**
 * Validates and sanitizes text inputs
 */
export function sanitizeText(input: string | null | undefined, maxLength = 250): string {
  if (!input) return '';
  // Trim and strip dangerous control characters
  return input.trim().replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, '').slice(0, maxLength);
}

/**
 * Validates email format and bounds
 */
export function validateEmail(email: string): ValidationResult {
  const sanitized = email.trim();
  if (!sanitized) {
    return { isValid: false, error: 'Email address is required.' };
  }
  if (sanitized.length > 254) {
    return { isValid: false, error: 'Email address exceeds maximum length.' };
  }
  if (sanitized.includes('..')) {
    return { isValid: false, error: 'Please provide a valid email address.' };
  }
  if (!EMAIL_REGEX.test(sanitized)) {
    return { isValid: false, error: 'Please provide a valid email address.' };
  }
  return { isValid: true };
}

/**
 * Validates optional phone number
 */
export function validatePhone(phone: string | null | undefined): ValidationResult {
  if (!phone || !phone.trim()) {
    return { isValid: true }; // optional
  }
  const cleanPhone = phone.trim();
  if (cleanPhone.length > 30) {
    return { isValid: false, error: 'Phone number exceeds maximum length.' };
  }
  if (!PHONE_REGEX.test(cleanPhone)) {
    return { isValid: false, error: 'Please enter a valid telephone number format.' };
  }
  return { isValid: true };
}

/**
 * Validates uploaded file size and extension
 */
export function validateFile(file: File): ValidationResult {
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: `File "${file.name}" exceeds the 50MB maximum size limit.` };
  }

  const ext = ('.' + (file.name.split('.').pop() || '')).toLowerCase();
  const isAllowedExt = (ALLOWED_FILE_EXTENSIONS as readonly string[]).includes(ext);

  if (!isAllowedExt) {
    return {
      isValid: false,
      error: `File "${file.name}" has an unsupported format. Allowed formats: ${ALLOWED_FILE_EXTENSIONS.join(', ')}`,
    };
  }

  // Prevent path traversal in file names
  if (file.name.includes('/') || file.name.includes('\\') || file.name.includes('..')) {
    return { isValid: false, error: `File name "${file.name}" contains invalid path characters.` };
  }

  return { isValid: true };
}

/**
 * Client-side rate-limit / spam prevention checker
 */
export function checkSubmissionRateLimit(storageKey = 'cc_submission_ts', cooldownMs = 10000): { allowed: boolean; waitSec: number } {
  try {
    const lastTimeStr = localStorage.getItem(storageKey);
    if (!lastTimeStr) return { allowed: true, waitSec: 0 };
    const diff = Date.now() - parseInt(lastTimeStr, 10);
    if (diff < cooldownMs) {
      return { allowed: false, waitSec: Math.ceil((cooldownMs - diff) / 1000) };
    }
  } catch {
    // If local storage is disabled, allow proceeding
  }
  return { allowed: true, waitSec: 0 };
}

export function recordSubmissionTimestamp(storageKey = 'cc_submission_ts'): void {
  try {
    localStorage.setItem(storageKey, Date.now().toString());
  } catch {
    // ignore
  }
}
