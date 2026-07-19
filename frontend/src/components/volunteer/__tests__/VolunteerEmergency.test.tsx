import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VolunteerEmergency } from '../VolunteerEmergency';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>
}));

describe('VolunteerEmergency', () => {
  it('opens and closes emergency actions', () => {
    render(<VolunteerEmergency />);
    
    // Initially not open
    expect(screen.queryByText('Emergency Actions')).not.toBeInTheDocument();
    
    // Find the FAB button (has PlusCircle)
    const fabButton = screen.getAllByRole('button')[0]; // first button might be fab
    fireEvent.click(fabButton);
    
    // Now open
    expect(screen.getByText('Emergency Actions')).toBeInTheDocument();
    expect(screen.getByText('Medical Team')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByText('Request Supervisor')).toBeInTheDocument();
    
    // Close it
    const closeBtn = screen.getByText('Request Supervisor');
    fireEvent.click(closeBtn);
    
    // Not open again
    expect(screen.queryByText('Emergency Actions')).not.toBeInTheDocument();
  });
});
