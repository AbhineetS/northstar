import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StaffTasks } from '../StaffTasks';
import { useTelemetryStore } from '@/store/useTelemetryStore';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>
}));

const INITIAL_STAFF_TASKS = [
  { id: 'wo1', type: 'Cleaning', title: 'Large beverage spill', description: 'Large beverage spill', location: 'Section 104 Concourse', priority: 'High' as const, status: 'Pending' as const, timeReported: '4m ago', assigneeRole: 'Staff' as const },
  { id: 'wo2', type: 'Maintenance', title: 'Turnstile 4 offline', description: 'Turnstile 4 offline', location: 'Gate A Entry', priority: 'High' as const, status: 'In Progress' as const, timeReported: '12m ago', assigneeRole: 'Staff' as const },
];

describe('StaffTasks', () => {
  beforeEach(() => {
    useTelemetryStore.setState({ staffTasks: INITIAL_STAFF_TASKS });
  });

  it('renders the header "Work Orders"', () => {
    render(<StaffTasks />);
    expect(screen.getByRole('heading', { name: /work orders/i })).toBeInTheDocument();
  });

  it('renders Facility Ops Queue label', () => {
    render(<StaffTasks />);
    expect(screen.getByText(/Facility Ops Queue/i)).toBeInTheDocument();
  });

  it('renders initial staff tasks from the store', () => {
    render(<StaffTasks />);
    expect(screen.getByText('Large beverage spill')).toBeInTheDocument();
    expect(screen.getByText('Turnstile 4 offline')).toBeInTheDocument();
  });

  it('shows active task count', () => {
    render(<StaffTasks />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders filter buttons with correct aria attributes', () => {
    render(<StaffTasks />);
    const allBtn = screen.getByRole('button', { name: /^all$/i });
    expect(allBtn).toBeInTheDocument();
    expect(allBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('filters to pending tasks only', () => {
    render(<StaffTasks />);
    fireEvent.click(screen.getByRole('button', { name: /^pending$/i }));
    expect(screen.getByText('Large beverage spill')).toBeInTheDocument();
    expect(screen.queryByText('Turnstile 4 offline')).not.toBeInTheDocument();
  });

  it('filters to in-progress tasks only', () => {
    render(<StaffTasks />);
    fireEvent.click(screen.getByRole('button', { name: /^in progress$/i }));
    expect(screen.queryByText('Large beverage spill')).not.toBeInTheDocument();
    expect(screen.getByText('Turnstile 4 offline')).toBeInTheDocument();
  });

  it('shows "Accept Order" button for pending tasks', () => {
    render(<StaffTasks />);
    const acceptBtn = screen.getByRole('button', { name: /accept work order: large beverage spill/i });
    expect(acceptBtn).toBeInTheDocument();
  });

  it('shows "Mark Complete" button for in-progress tasks', () => {
    render(<StaffTasks />);
    const completeBtn = screen.getByRole('button', { name: /complete work order: turnstile 4 offline/i });
    expect(completeBtn).toBeInTheDocument();
  });

  it('accepts a pending order', () => {
    render(<StaffTasks />);
    const acceptBtn = screen.getByRole('button', { name: /accept work order: large beverage spill/i });
    fireEvent.click(acceptBtn);
    // Now it should show a "Mark Complete" for that task
    expect(screen.getByRole('button', { name: /complete work order: large beverage spill/i })).toBeInTheDocument();
  });

  it('completes an in-progress order and shows "Completed History"', () => {
    render(<StaffTasks />);
    const completeBtn = screen.getByRole('button', { name: /complete work order: turnstile 4 offline/i });
    fireEvent.click(completeBtn);
    expect(screen.getByText(/Completed History/i)).toBeInTheDocument();
  });

  it('renders navigate button with aria-label for each task', () => {
    render(<StaffTasks />);
    expect(screen.getByRole('button', { name: /navigate to: section 104 concourse/i })).toBeInTheDocument();
  });

  it('renders task location', () => {
    render(<StaffTasks />);
    expect(screen.getByText('Section 104 Concourse')).toBeInTheDocument();
  });
});
