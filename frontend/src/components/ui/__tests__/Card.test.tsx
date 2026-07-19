import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from '../Card';

describe('Card', () => {
  it('renders without crashing', () => {
    const { container } = render(<Card />);
    expect(container).toBeInTheDocument();
  });
});
