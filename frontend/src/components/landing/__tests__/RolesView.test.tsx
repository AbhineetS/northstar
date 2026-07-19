import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RolesView } from '../RolesView';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => <button {...props}>{children}</button>,
    span: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => <span {...props}>{children}</span>,
    h2: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => <h2 {...props}>{children}</h2>,
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>
}));

vi.mock('@/components/ui/AnimatedNumber', () => ({
  AnimatedNumber: ({ value }: unknown) => <span>{value}</span>
}));

describe('RolesView', () => {
  const mockPersonas = [
    {
      id: 'fan',
      title: 'Fan',
      description: 'Desc',
      metric: 100,
      metricLabel: 'fans',
      icon: () => <svg data-testid="fan-icon" />,
      color: 'bg-red-500'
    },
    {
      id: 'staff',
      title: 'Staff',
      description: 'Staff Desc',
      metric: 2500000,
      metricLabel: 'staff',
      icon: () => <svg data-testid="staff-icon" />,
      color: 'bg-blue-500'
    }
  ];

  it('renders personas and handles back click', () => {
    const onBack = vi.fn();
    const onSelectPersona = vi.fn();

    render(
      <RolesView 
        personas={mockPersonas}
        onBack={onBack}
        onSelectPersona={onSelectPersona}
      />
    );

    expect(screen.getByText('Fan')).toBeInTheDocument();
    expect(screen.getByText('Staff')).toBeInTheDocument();

    fireEvent.click(screen.getByText('← Back to Hub'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('handles persona selection', () => {
    const onSelectPersona = vi.fn();

    render(
      <RolesView 
        personas={mockPersonas}
        onBack={vi.fn()}
        onSelectPersona={onSelectPersona}
      />
    );

    fireEvent.click(screen.getByText('Fan'));
    expect(onSelectPersona).toHaveBeenCalledWith(mockPersonas[0]);
  });

  it('formats large numbers correctly after animation', () => {
    vi.useFakeTimers();
    
    render(
      <RolesView 
        personas={mockPersonas}
        onBack={vi.fn()}
        onSelectPersona={vi.fn()}
      />
    );

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.getByText('2.5')).toBeInTheDocument();
    expect(screen.getByText('M')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();

    vi.useRealTimers();
  });
});
