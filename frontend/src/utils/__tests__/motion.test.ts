import { describe, it, expect } from 'vitest';
import { spring, springFast, fadeIn, slideUp, staggerContainer, pulseStatus } from '../motion';

describe('motion variants', () => {
  it('spring exports have correct types and properties', () => {
    expect(spring.type).toBe('spring');
    expect(spring.stiffness).toBe(100);
    expect(springFast.stiffness).toBe(200);
  });

  it('fadeIn contains hidden, visible, and exit states', () => {
    expect(fadeIn).toHaveProperty('hidden');
    expect(fadeIn).toHaveProperty('visible');
    expect(fadeIn).toHaveProperty('exit');
    
    // Check specific properties
    if (typeof fadeIn.hidden === 'object' && fadeIn.hidden !== null) {
      expect(fadeIn.hidden).toHaveProperty('opacity', 0);
    }
  });

  it('slideUp contains correct y translations', () => {
    if (typeof slideUp.hidden === 'object' && slideUp.hidden !== null) {
      expect(slideUp.hidden).toHaveProperty('y', 20);
    }
    if (typeof slideUp.visible === 'object' && slideUp.visible !== null) {
      expect(slideUp.visible).toHaveProperty('y', 0);
    }
  });

  it('staggerContainer contains staggerChildren property', () => {
    if (typeof staggerContainer.visible === 'object' && staggerContainer.visible !== null) {
      expect(staggerContainer.visible).toHaveProperty('transition');
      
      expect(staggerContainer.visible.transition).toHaveProperty('staggerChildren', 0.05);
    }
  });

  it('pulseStatus loops indefinitely', () => {
    if (typeof pulseStatus.active === 'object' && pulseStatus.active !== null) {
      expect(pulseStatus.active).toHaveProperty('transition');
      
      expect(pulseStatus.active.transition).toHaveProperty('repeat', Infinity);
    }
  });
});
