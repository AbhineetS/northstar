import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StadiumOverviewWidget } from '../StadiumOverviewWidget';

describe('StadiumOverviewWidget', () => {
  it('renders without crashing', () => {
    const { container } = render(<StadiumOverviewWidget />);
    expect(container).toBeInTheDocument();
  });
});
