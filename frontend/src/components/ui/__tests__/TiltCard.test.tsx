import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TiltCard } from '../TiltCard';

describe('TiltCard', () => {
  it('renders without crashing', () => {
    const { container } = render(<TiltCard><div>Test</div></TiltCard>);
    expect(container).toBeInTheDocument();
  });
});
