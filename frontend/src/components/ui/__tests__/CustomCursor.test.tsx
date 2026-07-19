import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CustomCursor } from '../CustomCursor';

describe('CustomCursor', () => {
  it('renders without crashing', () => {
    const { container } = render(<CustomCursor />);
    expect(container).toBeInTheDocument();
  });
});
