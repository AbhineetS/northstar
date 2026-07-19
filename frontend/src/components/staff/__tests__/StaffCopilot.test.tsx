import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StaffCopilot } from '../StaffCopilot';

describe('StaffCopilot', () => {
  it('renders without crashing', () => {
    const { container } = render(<StaffCopilot />);
    expect(container).toBeInTheDocument();
  });
});
