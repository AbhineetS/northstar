import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VolunteerTasks } from '../VolunteerTasks';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>
}));

describe('VolunteerTasks', () => {
  it('renders tasks and handles interactions', () => {
    render(<VolunteerTasks />);
    
    // Header
    expect(screen.getByText('Assigned Tasks')).toBeInTheDocument();
    
    // Initial task statuses
    expect(screen.getByText('Assist Fan Wheelchair Navigation')).toBeInTheDocument();
    
    // Accept a pending task
    const acceptBtns = screen.getAllByText('Accept Task');
    expect(acceptBtns.length).toBeGreaterThan(0);
    fireEvent.click(acceptBtns[0]);
    
    // Now the task should be In Progress and show "Mark Complete"
    // Check that there is one less Accept Task button or more Mark Complete buttons
    expect(screen.getAllByText('Mark Complete').length).toBeGreaterThan(1);
    
    // Complete a task
    const completeBtns = screen.getAllByText('Mark Complete');
    fireEvent.click(completeBtns[0]);
    
    // Wait for state update (sync in React testing library usually)
    expect(screen.getByText('Completed Today')).toBeInTheDocument();
  });
});
