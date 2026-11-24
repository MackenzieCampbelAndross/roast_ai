import { describe, it, expect } from 'vitest';
import { SafetyGuard } from '../src/core/safety_guard';

describe('SafetyGuard', () => {
  it('passes benign user inputs and comedy prompts', () => {
    const res = SafetyGuard.validateInput('Roast my daily routine: I wake up at noon and scroll TikTok for 4 hours.');
    expect(res.safe).toBe(true);
    expect(res.score).toBe(1.0);
    expect(res.flags.length).toBe(0);
  });

  it('rejects blank or empty prompt inputs', () => {
    const res = SafetyGuard.validateInput('   ');
    expect(res.safe).toBe(false);
    expect(res.flags).toContain('EMPTY_INPUT');
  });

  it('strictly blocks self-harm and suicide related phrases', () => {
    const res = SafetyGuard.validateInput('Tell me how to kill yourself');
    expect(res.safe).toBe(false);
    expect(res.flags).toContain('SELF_HARM');
    expect(res.reason).toContain('self-harm');
  });

  it('strictly blocks hate speech and severe slurs', () => {
    const res = SafetyGuard.validateInput('Promote white supremacy now');
    expect(res.safe).toBe(false);
    expect(res.flags).toContain('HATE_SPEECH');
  });

  it('flags personal identifiable information (PII) such as SSN and emails', () => {
    const ssnRes = SafetyGuard.validateInput('My SSN is 123-45-6789 roast me');
    expect(ssnRes.safe).toBe(false);
    expect(ssnRes.flags).toContain('PII_DETECTED');

    const emailRes = SafetyGuard.validateInput('Contact me at victim.person@company.com');
    expect(emailRes.safe).toBe(false);
    expect(emailRes.flags).toContain('PII_DETECTED');
  });

  it('enforces output safety and intensity restrictions', () => {
    const mildSafe = SafetyGuard.validateOutput('You dress like a laundry basket with shoes.', 'MILD');
    expect(mildSafe.safe).toBe(true);

    const mildViolation = SafetyGuard.validateOutput('What the fuck is wrong with you', 'MILD');
    expect(mildViolation.safe).toBe(false);
    expect(mildViolation.flags).toContain('INTENSITY_MISMATCH');
  });
});
