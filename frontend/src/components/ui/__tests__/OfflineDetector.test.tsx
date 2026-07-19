import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OfflineDetector } from '../OfflineDetector';

describe('OfflineDetector', () => {
  it('renders without crashing', () => {
    const { container } = render(<OfflineDetector />);
    expect(container).toBeInTheDocument();
  });
});
