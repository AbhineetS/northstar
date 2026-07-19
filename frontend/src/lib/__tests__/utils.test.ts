import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn utility (lib/utils)', () => {
  it('merges class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('merges tailwind classes using tailwind-merge', () => {
    expect(cn('px-2 py-1', 'p-4')).toBe('p-4');
  });
});
