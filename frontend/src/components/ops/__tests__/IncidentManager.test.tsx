import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { IncidentManager } from '../IncidentManager';

describe('IncidentManager', () => {
  it('renders without crashing', () => {
    const { container } = render(<IncidentManager />);
    expect(container).toBeInTheDocument();
  });
});
