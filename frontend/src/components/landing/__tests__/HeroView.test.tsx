import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HeroView } from '../HeroView';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => <h2 {...props}>{children}</h2>,
  }
}));

describe('HeroView', () => {
  it('renders hero title and metrics', () => {
    const onStart = vi.fn();
    const mockIcon = () => <svg data-testid="mock-icon" />;
    
    render(
      <HeroView 
        onStart={onStart} 
        metrics={[{ label: 'Users', icon: mockIcon }]} 
      />
    );

    expect(screen.getByText('MASTER THE MATCHDAY.')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('calls onStart when button is clicked', () => {
    const onStart = vi.fn();
    render(<HeroView onStart={onStart} metrics={[]} />);
    
    fireEvent.click(screen.getByText("Let's Begin"));
    expect(onStart).toHaveBeenCalledTimes(1);
  });
});
