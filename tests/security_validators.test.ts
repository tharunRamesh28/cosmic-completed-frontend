import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  validateEmail,
  validatePhone,
  validateFile,
  sanitizeText,
  checkSubmissionRateLimit,
} from '../src/lib/validators.ts';

describe('Security Input Validation & Sanitization Tests', () => {
  it('should validate valid email addresses', () => {
    assert.strictEqual(validateEmail('client@cosmiccircuit.com').isValid, true);
    assert.strictEqual(validateEmail('user.name+tag@sub.domain.org').isValid, true);
  });

  it('should reject malformed or attacking email addresses', () => {
    assert.strictEqual(validateEmail('plainaddress').isValid, false);
    assert.strictEqual(validateEmail('user@domain').isValid, false);
    assert.strictEqual(validateEmail('<script>alert(1)</script>@test.com').isValid, false);
    assert.strictEqual(validateEmail('').isValid, false);
  });

  it('should sanitize dangerous text and strip control characters', () => {
    const raw = 'Cosmic Hardware \u0000\u001F <script>alert("xss")</script>';
    const sanitized = sanitizeText(raw, 50);
    assert.strictEqual(sanitized.includes('\u0000'), false);
    assert.strictEqual(sanitized.includes('\u001F'), false);
    assert.strictEqual(sanitized.length <= 50, true);
  });

  it('should validate allowed engineering file extensions', () => {
    const validFile = { name: 'circuit_board.step', size: 1024 * 1024 } as File;
    assert.strictEqual(validateFile(validFile).isValid, true);

    const zipFile = { name: 'gerber_files.zip', size: 2 * 1024 * 1024 } as File;
    assert.strictEqual(validateFile(zipFile).isValid, true);
  });

  it('should reject unauthorized file extensions and oversized files', () => {
    const dangerousExe = { name: 'trojan.exe', size: 500 } as File;
    assert.strictEqual(validateFile(dangerousExe).isValid, false);

    const dangerousSvg = { name: 'exploit.svg', size: 500 } as File;
    assert.strictEqual(validateFile(dangerousSvg).isValid, false);

    const oversized = { name: 'huge_cad.step', size: 60 * 1024 * 1024 } as File;
    assert.strictEqual(validateFile(oversized).isValid, false);

    const traversalFile = { name: '../../../etc/passwd.png', size: 100 } as File;
    assert.strictEqual(validateFile(traversalFile).isValid, false);
  });

  it('should enforce telephone number bounds', () => {
    assert.strictEqual(validatePhone('+1 (555) 019-2834').isValid, true);
    assert.strictEqual(validatePhone('+91 9876543210').isValid, true);
    assert.strictEqual(validatePhone('abc-invalid-phone').isValid, false);
  });
});
