import { describe, it, expect } from 'vitest';
import { cn, formatNumber, clamp } from '../utils';

describe('cn utility (lib/utils)', () => {
  it('merges class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('merges tailwind classes using tailwind-merge', () => {
    expect(cn('px-2 py-1', 'p-4')).toBe('p-4');
  });

  it('handles conditional classes', () => {
    const isActive = true;
    expect(cn('base', isActive && 'active')).toBe('base active');
  });

  it('handles falsy conditionals', () => {
    const isActive = false;
    expect(cn('base', isActive && 'active')).toBe('base');
  });

  it('handles empty inputs', () => {
    expect(cn()).toBe('');
  });

  it('handles undefined and null', () => {
    expect(cn('base', undefined, null)).toBe('base');
  });
});

describe('formatNumber utility', () => {
  it('formats numbers with commas', () => {
    expect(formatNumber(1200000)).toBe('1,200,000');
  });

  it('formats small numbers correctly', () => {
    expect(formatNumber(42)).toBe('42');
  });

  it('formats zero correctly', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('accepts custom locale', () => {
    // de-DE uses period as thousands separator
    const result = formatNumber(1000, 'de-DE');
    expect(result).toContain('1');
    expect(result).toContain('000');
  });
});

describe('clamp utility', () => {
  it('returns value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('clamps to minimum', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('clamps to maximum', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('handles equal min and max', () => {
    expect(clamp(5, 5, 5)).toBe(5);
  });

  it('handles negative ranges', () => {
    expect(clamp(-20, -10, -1)).toBe(-10);
  });
});

describe('rateLimit (lib/rate-limit)', () => {
  // Dynamically import to avoid any module-level issues
  it('allows requests within limit', async () => {
    const { rateLimit } = await import('../rate-limit');
    const mockReq = {
      headers: { get: () => '1.2.3.4' },
    } as unknown as Parameters<typeof rateLimit>[0];
    const result = rateLimit(mockReq, { limit: 5, windowMs: 10000 });
    expect(result.success).toBe(true);
    expect(result.limit).toBe(5);
  });

  it('returns correct remaining count', async () => {
    const { rateLimit } = await import('../rate-limit');
    const mockReq = {
      headers: { get: () => '10.0.0.1' },
    } as unknown as Parameters<typeof rateLimit>[0];
    const r1 = rateLimit(mockReq, { limit: 3, windowMs: 60000 });
    expect(r1.remaining).toBeLessThanOrEqual(3);
  });

  it('has a valid reset timestamp', async () => {
    const { rateLimit } = await import('../rate-limit');
    const mockReq = {
      headers: { get: () => '192.168.0.1' },
    } as unknown as Parameters<typeof rateLimit>[0];
    const result = rateLimit(mockReq, { limit: 5, windowMs: 5000 });
    expect(result.reset).toBeGreaterThan(Date.now());
  });
});
