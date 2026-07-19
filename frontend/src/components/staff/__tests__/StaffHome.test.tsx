import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StaffHome } from '../StaffHome';

describe('StaffHome', () => {
  it('renders without crashing', () => {
    const { container } = render(<StaffHome />);
    expect(container).toBeInTheDocument();
  });
});
