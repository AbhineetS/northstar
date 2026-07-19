import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AnimatedNumber } from '../AnimatedNumber';

describe('AnimatedNumber', () => {
  it('renders without crashing', () => {
    const { container } = render(<AnimatedNumber value={100} />);
    expect(container).toBeInTheDocument();
  });
});
