import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VolunteerTasks } from '../VolunteerTasks';
import { useTelemetryStore } from '@/store/useTelemetryStore';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>
}));

describe('VolunteerTasks', () => {
  beforeEach(() => {
    // Reset telemetry store to initial state before each test
    useTelemetryStore.setState({
      staffTasks: [
        { id: 't1', title: 'Assist Fan Wheelchair Navigation', description: 'Assist Fan Wheelchair Navigation', location: 'Gate A - Section 102', priority: 'High', status: 'Pending', timeAssigned: '2m ago', aiSuggested: true, assigneeRole: 'Volunteer' },
        { id: 't2', title: 'Spill Cleanup Assistance', description: 'Spill Cleanup Assistance', location: 'Concourse East - Food Court', priority: 'Medium', status: 'Pending', timeAssigned: '15m ago', assigneeRole: 'Volunteer' },
      ],
    });
  });

  it('renders the header with "Assigned Tasks"', () => {
    render(<VolunteerTasks />);
    expect(screen.getByRole('heading', { name: 'Assigned Tasks' })).toBeInTheDocument();
  });

  it('renders initial volunteer tasks from the store', () => {
    render(<VolunteerTasks />);
    expect(screen.getByText('Assist Fan Wheelchair Navigation')).toBeInTheDocument();
    expect(screen.getByText('Spill Cleanup Assistance')).toBeInTheDocument();
  });

  it('displays Accept Task button for pending tasks', () => {
    render(<VolunteerTasks />);
    const acceptBtns = screen.getAllByRole('button', { name: /accept task/i });
    expect(acceptBtns.length).toBeGreaterThanOrEqual(1);
  });

  it('shows AI prioritization banner', () => {
    render(<VolunteerTasks />);
    expect(screen.getByText(/AI Prioritization Active/i)).toBeInTheDocument();
  });

  it('accepts a pending task and transitions to In Progress', () => {
    render(<VolunteerTasks />);

    const acceptBtns = screen.getAllByRole('button', { name: /accept task/i });
    fireEvent.click(acceptBtns[0]);

    // After accepting, the button changes from "Accept Task" to "Complete task: ..."
    // Check that the complete task button now appears (aria-label starts with "Complete task:")
    expect(screen.getAllByRole('button', { name: /complete task:/i }).length).toBeGreaterThanOrEqual(1);
  });

  it('completes an in-progress task and shows "Completed Today"', () => {
    // Pre-set one task as In Progress with full location
    useTelemetryStore.setState({
      staffTasks: [
        { id: 't1', title: 'Assist Fan Wheelchair Navigation', description: 'Assist', location: 'Gate A - Section 102', priority: 'High', status: 'In Progress', timeAssigned: '2m ago', assigneeRole: 'Volunteer' },
      ],
    });

    render(<VolunteerTasks />);

    const completeBtns = screen.getAllByRole('button', { name: /complete task/i });
    fireEvent.click(completeBtns[0]);

    expect(screen.getByText('Completed Today')).toBeInTheDocument();
  });

  it('renders navigate button for each active task', () => {
    render(<VolunteerTasks />);
    const navBtns = screen.getAllByRole('button', { name: /navigate/i });
    expect(navBtns.length).toBeGreaterThanOrEqual(1);
  });

  it('shows active task count', () => {
    render(<VolunteerTasks />);
    // 2 volunteer tasks pending = active count should be "2"
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders location info for tasks', () => {
    render(<VolunteerTasks />);
    expect(screen.getByText('Gate A - Section 102')).toBeInTheDocument();
  });

  it('shows completed tasks section when tasks are completed', () => {
    useTelemetryStore.setState({
      staffTasks: [
        { id: 't3', title: 'Completed Task', description: 'Done', location: 'Zone C', priority: 'Routine', status: 'Completed', timeAssigned: '1h ago', assigneeRole: 'Volunteer' },
      ],
    });
    render(<VolunteerTasks />);
    expect(screen.getByText('Completed Today')).toBeInTheDocument();
    expect(screen.getByText('1 Tasks')).toBeInTheDocument();
  });
});
