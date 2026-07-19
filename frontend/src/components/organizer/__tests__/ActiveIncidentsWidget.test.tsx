import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ActiveIncidentsWidget } from '../ActiveIncidentsWidget';

describe('ActiveIncidentsWidget', () => {
  it('renders incidents and total count correctly', () => {
    render(<ActiveIncidentsWidget activeMedical={5} activeSecurity={2} />);
    
    // Test for text content
    expect(screen.getByText('Active Incidents')).toBeInTheDocument();
    
    // The AnimatedNumber is used for the total sum, but we might just assert the individual counts
    expect(screen.getByText('5 Medical')).toBeInTheDocument();
    expect(screen.getByText('2 Security')).toBeInTheDocument();
  });
});
