import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from '../Input';

describe('Input', () => {
  it('renders without crashing', () => {
    const { container } = render(<Input />);
    expect(container).toBeInTheDocument();
  });
});
