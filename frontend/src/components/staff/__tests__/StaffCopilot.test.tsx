/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { StaffCopilot } from '../StaffCopilot';
import { aiService } from '@/services';

vi.mock('@/services', () => ({
  aiService: {
    chat: vi.fn(),
    generateOpsRecommendations: vi.fn(),
  },
}));

vi.mock('@/store/useAppStore', () => ({
  useAppStore: {
    getState: vi.fn(() => ({
      weather: { data: {} },
      match: { data: {} },
      location: {},
    })),
  },
}));

vi.mock('@/store/useTelemetryStore', () => ({
  useTelemetryStore: {
    getState: vi.fn(() => ({
      incidents: [],
      transportHubs: [],
    })),
  },
}));

describe('StaffCopilot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<StaffCopilot />);
    expect(screen.getByText('AI Copilot')).toBeInTheDocument();
  });

  it('handles rendering recommendations', async () => {
    (aiService.generateOpsRecommendations as any).mockResolvedValue([
      { id: '1', priority: 'critical', title: 'Test Command', action: 'Execute' }
    ]);
    render(<StaffCopilot />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Command')).toBeInTheDocument();
    });
  });

  it('handles completing a command', async () => {
    (aiService.generateOpsRecommendations as any).mockResolvedValue([
      { id: '1', priority: 'critical', title: 'Test Command', action: 'Execute' }
    ]);
    render(<StaffCopilot />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Command')).toBeInTheDocument();
    });
    
    const executeButton = screen.getByText('Execute');
    act(() => {
      fireEvent.click(executeButton);
    });

    await waitFor(() => {
      expect(screen.queryByText('Test Command')).not.toBeInTheDocument();
    });
  });
});
