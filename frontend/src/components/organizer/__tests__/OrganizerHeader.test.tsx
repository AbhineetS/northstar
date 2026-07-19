import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OrganizerHeader } from '../OrganizerHeader';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => <div {...props}>{children}</div>,
    nav: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => <nav {...props}>{children}</nav>,
    button: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => <button {...props}>{children}</button>,
    span: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  useSpring: vi.fn(() => ({})),
  useTransform: vi.fn(() => ({})),
  useReducedMotion: vi.fn(() => false),
  useMotionValue: vi.fn(() => ({ set: vi.fn(), get: vi.fn() })),

}));

describe('OrganizerHeader', () => {
  it('renders header elements correctly', () => {
    render(<OrganizerHeader />);
    
    expect(screen.getByText('Back to Hub')).toBeInTheDocument();
    expect(screen.getByText(/Tournament/)).toBeInTheDocument();
    expect(screen.getByText(/Command/)).toBeInTheDocument();
    expect(screen.getByText('Venue Status')).toBeInTheDocument();
    expect(screen.getByText('NOMINAL')).toBeInTheDocument();
    expect(screen.getByText('Next Match')).toBeInTheDocument();
    expect(screen.getByText('15:00')).toBeInTheDocument();
  });
});
