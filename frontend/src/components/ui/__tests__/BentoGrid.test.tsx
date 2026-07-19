import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BentoGrid } from '../BentoGrid';

describe('BentoGrid', () => {
  it('renders without crashing', () => {
    const { container } = render(<BentoGrid><div>Test</div></BentoGrid>);
    expect(container).toBeInTheDocument();
  });
});
