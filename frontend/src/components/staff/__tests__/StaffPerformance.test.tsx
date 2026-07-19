import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StaffPerformance } from '../StaffPerformance';

describe('StaffPerformance', () => {
  it('renders without crashing', () => {
    const { container } = render(<StaffPerformance />);
    expect(container).toBeInTheDocument();
  });
});
