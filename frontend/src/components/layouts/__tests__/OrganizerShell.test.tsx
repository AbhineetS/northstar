import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OrganizerShell } from '../OrganizerShell';

describe('OrganizerShell', () => {
  it('renders children and default overview route', () => {
    render(
      <OrganizerShell>
        <div data-testid="child">Child Content</div>
      </OrganizerShell>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('PULSE')).toBeInTheDocument();
    expect(screen.getByText('OS')).toBeInTheDocument();
    expect(screen.getByText('Global Overview')).toBeInTheDocument();
    expect(screen.getByText('Crowd Intel')).toBeInTheDocument();
    expect(screen.getByText('overview')).toBeInTheDocument(); // Title is capitalized automatically by css or code? `activeRoute.replace("-", " ")` -> 'overview'
  });

  it('renders active route', () => {
    render(
      <OrganizerShell activeRoute="crowd">
        <div data-testid="child">Child Content</div>
      </OrganizerShell>
    );

    expect(screen.getByText('crowd')).toBeInTheDocument();
  });
});
