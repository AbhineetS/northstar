import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VolunteerCopilot } from '../VolunteerCopilot';

describe('VolunteerCopilot', () => {
  it('renders correctly', () => {
    render(<VolunteerCopilot />);
    expect(screen.getByText('AI Copilot')).toBeInTheDocument();
  });
});
