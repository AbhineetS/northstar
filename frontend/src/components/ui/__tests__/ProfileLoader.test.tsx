import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProfileLoader, PersonaDetails } from '../ProfileLoader';

describe('ProfileLoader', () => {
  it('renders without crashing', () => {
    const MOCK_PERSONA: PersonaDetails = {
      id: 'test',
      title: 'Test Profile',
      description: 'Test Description',
      color: 'bg-blue-500',
      href: '/test',
      icon: () => null,
      loadingSteps: ['Step 1', 'Step 2']
    };
    const { container } = render(<ProfileLoader persona={MOCK_PERSONA} onComplete={vi.fn()} />);
    expect(container).toBeInTheDocument();
  });
});
