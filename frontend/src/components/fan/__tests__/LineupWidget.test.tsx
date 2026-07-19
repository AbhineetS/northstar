import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LineupWidget } from '../LineupWidget';

describe('LineupWidget', () => {
  it('renders without crashing', () => {
    const { container } = render(<LineupWidget homeTeam='Team A' awayTeam='Team B' />);
    expect(container).toBeInTheDocument();
  });
});
