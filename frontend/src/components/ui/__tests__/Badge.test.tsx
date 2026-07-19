import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders without crashing', () => {
    const { container } = render(<Badge />);
    expect(container).toBeInTheDocument();
  });
});
