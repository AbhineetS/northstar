import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CinematicLoader } from '../CinematicLoader';

describe('CinematicLoader', () => {
  it('renders without crashing', () => {
    const { container } = render(<CinematicLoader />);
    expect(container).toBeInTheDocument();
  });
});
