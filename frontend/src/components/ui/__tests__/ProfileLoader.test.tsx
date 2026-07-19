import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProfileLoader } from '../ProfileLoader';

describe('ProfileLoader', () => {
  it('renders without crashing', () => {
    const mockPersona = { id: 'test', title: 'Test', color: 'bg-red-500', href: '/', loadingSteps: ['Step 1'] };
    const { container } = render(<ProfileLoader persona={mockPersona} onComplete={vi.fn()} />);
    expect(container).toBeInTheDocument();
  });
});

