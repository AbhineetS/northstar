import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAIEngine } from '../useAIEngine';
import { useTelemetryStore } from '../useTelemetryStore';

global.fetch = vi.fn();

describe('useAIEngine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useTelemetryStore.setState({ totalAttendance: 42500 }); // 50% density
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('handles successful AI decision fetch', async () => {
    const mockDecision = { recommended_action: 'Test action' };
    (global.fetch as import("vitest").Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDecision
    });

    const { result } = renderHook(() => useAIEngine());
    expect(result.current.isLoading).toBe(false);

    let decision;
    await act(async () => {
      const promise = result.current.getDecision('test intent');
      decision = await promise;
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8000/api/v1/ai/decision?intent=test%20intent',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"crowd_density":50')
      })
    );
    expect(decision).toEqual(mockDecision);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles failed AI decision fetch', async () => {
    (global.fetch as import("vitest").Mock).mockResolvedValueOnce({
      ok: false,
    });

    const { result } = renderHook(() => useAIEngine());

    let decision;
    await act(async () => {
      decision = await result.current.getDecision('test intent');
    });

    expect(decision).toBeNull();
    expect(result.current.error).toBe('Failed to fetch AI decision');
    expect(result.current.isLoading).toBe(false);
  });

  it('handles network error/timeout', async () => {
    (global.fetch as import("vitest").Mock).mockRejectedValueOnce(Object.assign(new Error('AbortError'), { name: 'AbortError' }));

    const { result } = renderHook(() => useAIEngine());

    await act(async () => {
      await result.current.getDecision('test intent');
    });

    expect(result.current.error).toBe('AI Engine timed out. Please try again.');
  });
});
