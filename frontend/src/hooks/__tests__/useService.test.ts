import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useService } from '../useService';

describe('useService hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('initializes with loading state', async () => {
    const mockServiceCall = vi.fn(() => new Promise(resolve => setTimeout(() => resolve('data'), 100)));
    
    const { result } = renderHook(() => useService(mockServiceCall));
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    
    await act(async () => {
      vi.advanceTimersByTime(100);
    });
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe('data');
  });

  it('handles successful resolution', async () => {
    const mockServiceCall = vi.fn().mockResolvedValue('success data');
    const { result } = renderHook(() => useService(mockServiceCall));
    
    await act(async () => {
      await Promise.resolve(); // wait for useEffect microtasks
    });
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe('success data');
    expect(result.current.isEmpty).toBe(false);
  });

  it('handles empty state correctly', async () => {
    const mockServiceCall = vi.fn().mockResolvedValue([]);
    const { result } = renderHook(() => useService(mockServiceCall));
    
    await act(async () => {
      await Promise.resolve();
    });
    
    expect(result.current.isEmpty).toBe(true);
    expect(result.current.data).toEqual([]);
  });

  it('handles errors', async () => {
    const mockError = new Error('Service failed');
    const mockServiceCall = vi.fn().mockRejectedValue(mockError);
    const { result } = renderHook(() => useService(mockServiceCall));
    
    await act(async () => {
      await Promise.resolve();
    });
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(mockError);
    expect(result.current.data).toBeNull();
  });

  it('handles timeouts', async () => {
    // Service call that takes too long (e.g. 10000ms)
    const mockServiceCall = vi.fn(() => new Promise(resolve => setTimeout(resolve, 10000)));
    const { result } = renderHook(() => useService(mockServiceCall));
    
    await act(async () => {
      // Advance by 8000ms, which is the timeout threshold in useService
      vi.advanceTimersByTime(8000);
      await Promise.resolve();
    });
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toMatch(/Connection timed out/);
  });

  it('retry function works', async () => {
    let callCount = 0;
    const mockServiceCall = vi.fn(async () => {
      callCount++;
      if (callCount === 1) throw new Error('First call fails');
      return 'Success on retry';
    });
    
    const { result } = renderHook(() => useService(mockServiceCall));
    
    await act(async () => {
      await Promise.resolve();
    });
    
    expect(result.current.error).toBeTruthy();
    
    await act(async () => {
      await result.current.retry();
    });
    
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBe('Success on retry');
  });
});
