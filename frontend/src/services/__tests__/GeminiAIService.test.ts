import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeminiAIService } from '../GeminiAIService';
import { useApiStore } from '../../store/useApiStore';

// Mock the global fetch
global.fetch = vi.fn();

describe('GeminiAIService', () => {
  let service: GeminiAIService;

  beforeEach(() => {
    service = new GeminiAIService();
    vi.clearAllMocks();
    useApiStore.setState({ activeRequests: 0, errors: {} });
  });

  describe('generateRecommendation', () => {
    it('handles successful API response', async () => {
      const mockResponse = { id: 'rec1', title: 'Test', description: 'Test desc', priority: 'high', type: 'crowd', actionable: true };
      (global.fetch as import("vitest").Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.generateRecommendation({});
      
      expect(global.fetch).toHaveBeenCalledWith('/api/ai/recommendation', expect.any(Object));
      expect(result).toEqual(mockResponse);
      expect(useApiStore.getState().activeRequests).toBe(0);
    });

    it('handles API error response', async () => {
      (global.fetch as import("vitest").Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(service.generateRecommendation({})).rejects.toThrow('API error: 500');
      expect(useApiStore.getState().activeRequests).toBe(0);
      expect(useApiStore.getState().errors['Gemini']).toBe('Failed to generate recommendation');
    });
  });

  describe('generateOpsRecommendations', () => {
    it('handles successful API response', async () => {
      const mockResponse = [{ id: '1', title: 'Test Rec' }];
      (global.fetch as import("vitest").Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await service.generateOpsRecommendations({});
      
      expect(global.fetch).toHaveBeenCalledWith('/api/ai/ops-recommendations', expect.any(Object));
      expect(result).toEqual(mockResponse);
    });

    it('handles API error response', async () => {
      (global.fetch as import("vitest").Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      await expect(service.generateOpsRecommendations({})).rejects.toThrow('API error: 400');
      expect(useApiStore.getState().errors['Gemini']).toBe('Failed to generate ops recommendations');
    });
  });

  describe('chat', () => {
    it('handles successful stream response', async () => {
      const mockStreamData = new TextEncoder().encode('Hello World');
      const mockReader = {
        read: vi.fn()
          .mockResolvedValueOnce({ done: false, value: mockStreamData })
          .mockResolvedValueOnce({ done: true, value: undefined }),
      };

      (global.fetch as import("vitest").Mock).mockResolvedValueOnce({
        ok: true,
        body: {
          getReader: () => mockReader,
        },
      });

      const result = await service.chat([{ role: 'user', content: 'Hi' }]);
      expect(result).toBe('Hello World');
    });

    it('handles API error', async () => {
      (global.fetch as import("vitest").Mock).mockResolvedValueOnce({
        ok: false,
        status: 502,
      });

      await expect(service.chat([])).rejects.toThrow('API error: 502');
      expect(useApiStore.getState().errors['Gemini']).toBe('Failed to respond to chat');
    });
  });
});
