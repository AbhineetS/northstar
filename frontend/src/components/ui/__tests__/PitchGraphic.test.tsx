import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PitchGraphic } from '../PitchGraphic';

describe('PitchGraphic', () => {
  it('renders without crashing', () => {
    const { container } = render(<PitchGraphic />);
    expect(container).toBeInTheDocument();
  });
});
