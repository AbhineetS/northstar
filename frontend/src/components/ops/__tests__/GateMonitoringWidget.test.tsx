import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GateMonitoringWidget } from '../GateMonitoringWidget';

describe('GateMonitoringWidget', () => {
  it('renders without crashing', () => {
    const { container } = render(<GateMonitoringWidget />);
    expect(container).toBeInTheDocument();
  });
});
