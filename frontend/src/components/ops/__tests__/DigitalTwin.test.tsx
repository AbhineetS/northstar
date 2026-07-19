import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DigitalTwin } from '../DigitalTwin';

describe('DigitalTwin', () => {
  it('renders without crashing', () => {
    const { container } = render(<DigitalTwin />);
    expect(container).toBeInTheDocument();
  });
});
