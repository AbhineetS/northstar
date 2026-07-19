import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PredictiveAnalyticsWidget } from '../PredictiveAnalyticsWidget';

describe('PredictiveAnalyticsWidget', () => {
  it('renders without crashing', () => {
    const { container } = render(<PredictiveAnalyticsWidget />);
    expect(container).toBeInTheDocument();
  });
});
