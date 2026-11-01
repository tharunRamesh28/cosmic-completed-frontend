import { describe, it } from 'node:test';
import assert from 'node:assert';
import { VALUE_PROPOSITIONS, ENGINEERING_DISCIPLINES } from '../src/data/heroData.ts';
import {
  validateEmail,
  validatePhone,
  validateFile,
  sanitizeText,
  checkSubmissionRateLimit,
} from '../src/lib/validators.ts';

// Mock localStorage if in Node environment
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (key: string) => store.get(key) || null,
    setItem: (key: string, val: string) => { store.set(key, val); },
    removeItem: (key: string) => { store.delete(key); },
    clear: () => { store.clear(); },
    key: (idx: number) => Array.from(store.keys())[idx] || null,
    length: 0,
  } as Storage;
}

describe('Phase 1 & 2: Project Data & Catalog Integrity', () => {
  it('Robotics must be included in engineering disciplines', () => {
    assert.ok(ENGINEERING_DISCIPLINES.includes('Robotics'));
  });

  it('Value propositions must have 4 principles with complete copy', () => {
    assert.strictEqual(VALUE_PROPOSITIONS.length, 4);
    VALUE_PROPOSITIONS.forEach((vp) => {
      assert.ok(vp.num);
      assert.ok(vp.title);
      assert.ok(vp.description);
    });
  });
});

describe('Phase 3, 6 & 7: Input Validation, Rate Limits & Payloads', () => {
  it('should reject email injection and malformed formats', () => {
    assert.strictEqual(validateEmail('').isValid, false);
    assert.strictEqual(validateEmail('test@').isValid, false);
    assert.strictEqual(validateEmail('@domain.com').isValid, false);
    assert.strictEqual(validateEmail('user@domain..com').isValid, false);
    assert.strictEqual(validateEmail('a'.repeat(250) + '@domain.com').isValid, false);
    assert.strictEqual(validateEmail('legit.engineer@cosmiccircuit.com').isValid, true);
  });

  it('should sanitize script tags and unicode control sequences', () => {
    const malicious = '<script>document.location="evil.com"</script>\u0000\u0007Hello';
    const clean = sanitizeText(malicious, 100);
    assert.strictEqual(clean.includes('\u0000'), false);
    assert.strictEqual(clean.includes('\u0007'), false);
    assert.strictEqual(clean.length <= 100, true);
  });

  it('should reject traversal attacks and disallowed file formats', () => {
    const traversal = { name: '../../boot.ini', size: 1000 } as File;
    assert.strictEqual(validateFile(traversal).isValid, false);

    const executable = { name: 'firmware.bin.exe', size: 1000 } as File;
    assert.strictEqual(validateFile(executable).isValid, false);

    const validStep = { name: 'enclosure_rev2.step', size: 5 * 1024 * 1024 } as File;
    assert.strictEqual(validateFile(validStep).isValid, true);

    const validGerber = { name: 'pcb_gerber.zip', size: 10 * 1024 * 1024 } as File;
    assert.strictEqual(validateFile(validGerber).isValid, true);
  });

  it('rate limiter should throttle rapid repeat actions', () => {
    const key = 'test_rate_limiter_' + Date.now();
    const firstAttempt = checkSubmissionRateLimit(key, 5000);
    assert.strictEqual(firstAttempt.allowed, true);

    localStorage.setItem(key, Date.now().toString());
    const secondAttempt = checkSubmissionRateLimit(key, 5000);
    assert.strictEqual(secondAttempt.allowed, false);
    assert.ok(secondAttempt.waitSec > 0);
  });
});
