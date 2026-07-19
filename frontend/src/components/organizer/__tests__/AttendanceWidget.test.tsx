import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AttendanceWidget } from '../AttendanceWidget';

// Mock recharts because it uses ResizeObserver and complex DOM measurements
vi.mock('recharts', () => {
  const MockComponent = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
  return {
    ResponsiveContainer: MockComponent,
    AreaChart: MockComponent,
    Area: MockComponent,
  };
});

describe('AttendanceWidget', () => {
  it('renders total attendance and chart', () => {
    render(<AttendanceWidget totalAttendance={85000} />);
    
    expect(screen.getByText('Total Attendance')).toBeInTheDocument();
    expect(screen.getByText('+12% vs expected')).toBeInTheDocument();
    expect(screen.getByText('85,000')).toBeInTheDocument(); // assuming value is formatted renders the number as text
  });
});
