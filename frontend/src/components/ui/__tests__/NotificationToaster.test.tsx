import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NotificationToaster } from '../NotificationToaster';

describe('NotificationToaster', () => {
  it('renders without crashing', () => {
    const { container } = render(<NotificationToaster profile='Fan' />);
    expect(container).toBeInTheDocument();
  });
});
