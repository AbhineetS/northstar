import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AICommandPanel } from '../AICommandPanel';

describe('AICommandPanel', () => {
  const mockRecommendations = [
    {
      id: '1',
      title: 'Deploy Medical Staff',
      context: 'Medical incident in Section 102',
      prediction: 'Condition will worsen if unattended',
      action: 'Dispatch Alpha Team',
      impact: 'Incident resolved in 5 mins',
      priority: 'critical' as const,
    },
    {
      id: '2',
      title: 'Redirect Crowd',
      context: 'Congestion at Gate B',
      prediction: 'Wait times exceeding 15 mins',
      action: 'Open overflow Gate C',
      impact: 'Wait times reduced to 5 mins',
      priority: 'high' as const,
    }
  ];

  it('renders empty state when no recommendations are provided', () => {
    render(<AICommandPanel recommendations={[]} onDismiss={() => {}} />);
    expect(screen.getByText('Systems Nominal')).toBeInTheDocument();
  });

  it('renders recommendations correctly', () => {
    render(<AICommandPanel recommendations={mockRecommendations} onDismiss={() => {}} />);
    expect(screen.getByText('Deploy Medical Staff')).toBeInTheDocument();
    expect(screen.getByText('Redirect Crowd')).toBeInTheDocument();
    expect(screen.getByText('Medical incident in Section 102')).toBeInTheDocument();
  });

  it('calls onDismiss when Execute is clicked', () => {
    const handleDismiss = vi.fn();
    render(<AICommandPanel recommendations={mockRecommendations} onDismiss={handleDismiss} />);
    
    // Grab all execute buttons
    const executeButtons = screen.getAllByRole('button', { name: /Execute action for/i });
    fireEvent.click(executeButtons[0]);
    
    expect(handleDismiss).toHaveBeenCalledWith('1');
  });

  it('calls onDismiss when Dismiss is clicked', () => {
    const handleDismiss = vi.fn();
    render(<AICommandPanel recommendations={mockRecommendations} onDismiss={handleDismiss} />);
    
    // Grab all dismiss buttons
    const dismissButtons = screen.getAllByRole('button', { name: /Dismiss recommendation for/i });
    fireEvent.click(dismissButtons[1]);
    
    expect(handleDismiss).toHaveBeenCalledWith('2');
  });
});
