import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PageTransition } from '../PageTransition';

describe('PageTransition', () => {
  it('renders without crashing', () => {
    const { container } = render(<PageTransition><div>Test</div></PageTransition>);
    expect(container).toBeInTheDocument();
  });
});
