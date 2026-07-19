import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StaffTasks } from '../StaffTasks';

describe('StaffTasks', () => {
  it('renders without crashing', () => {
    const { container } = render(<StaffTasks />);
    expect(container).toBeInTheDocument();
  });
});
