import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FootballHub } from '../FootballHub';

describe('FootballHub', () => {
  it('renders without crashing', () => {
    const { container } = render(<FootballHub isOpen={true} onClose={() => {}} activeMatchId='123' />);
    expect(container).toBeInTheDocument();
  });
});
