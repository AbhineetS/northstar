import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MatchdayAssistantWidget } from '../MatchdayAssistantWidget';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>
}));

vi.mock('@/components/ui/MagneticButton', () => ({
  MagneticButton: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => <button {...props}>{children}</button>,
}));

// Use vi.fn() inline — do not reference variables before hoisting
vi.mock('@/services', () => ({
  aiService: {
    chat: vi.fn().mockResolvedValue('Test AI response'),
  },
}));

vi.mock('@/store/useAppStore', () => ({
  useAppStore: {
    getState: vi.fn().mockReturnValue({
      weather: { data: null },
      match: { data: null },
      location: null,
    }),
  },
}));

vi.mock('@/store/useTelemetryStore', () => ({
  useTelemetryStore: {
    getState: vi.fn().mockReturnValue({
      incidents: [],
      transportHubs: [],
    }),
  },
}));

describe('MatchdayAssistantWidget', () => {
  it('renders without crashing', () => {
    const { container } = render(<MatchdayAssistantWidget />);
    expect(container).toBeInTheDocument();
  });

  it('renders the AI assistant title', () => {
    render(<MatchdayAssistantWidget />);
    expect(screen.getByText(/matchday assistant/i)).toBeInTheDocument();
  });

  it('renders the message input field', () => {
    render(<MatchdayAssistantWidget />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('renders the send button', () => {
    render(<MatchdayAssistantWidget />);
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('types in the message input', () => {
    render(<MatchdayAssistantWidget />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Which gate is fastest?' } });
    expect(input.value).toBe('Which gate is fastest?');
  });

  it('submits a message and shows user message', async () => {
    render(<MatchdayAssistantWidget />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'What time is kick off?' } });
    fireEvent.submit(input.closest('form')!);
    await waitFor(() => {
      expect(screen.getByText('What time is kick off?')).toBeInTheDocument();
    });
  });

  it('renders with a recommendation prop', () => {
    const recommendation = { title: 'Leave Now', text: 'Gate A is clear', action: 'Navigate' };
    render(<MatchdayAssistantWidget recommendation={recommendation} />);
    expect(screen.getByText(/Leave Now/i)).toBeInTheDocument();
  });

  it('does not submit empty messages', async () => {
    const { aiService } = await import('@/services');
    (aiService.chat as ReturnType<typeof vi.fn>).mockClear();
    render(<MatchdayAssistantWidget />);
    const input = screen.getByRole('textbox');
    fireEvent.submit(input.closest('form')!);
    await new Promise(r => setTimeout(r, 50));
    expect(aiService.chat).not.toHaveBeenCalled();
  });
});
