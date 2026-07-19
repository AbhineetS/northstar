import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LiveMatchService } from '../LiveMatchService';
import { useApiStore } from '../../store/useApiStore';

global.fetch = vi.fn();

describe('LiveMatchService', () => {
  let service: LiveMatchService;

  beforeEach(() => {
    service = new LiveMatchService();
    vi.clearAllMocks();
    useApiStore.setState({ activeRequests: 0, errors: {} });
  });

  describe('getMatchDetails', () => {
    it('returns match details on success', async () => {
      const mockApiData = {
        events: [{
          idEvent: '123',
          strHomeTeam: 'Home',
          idHomeTeam: 'h1',
          strAwayTeam: 'Away',
          idAwayTeam: 'a1',
          dateEvent: '2026-07-19',
          strTime: '15:00:00',
          strVenue: 'Test Stadium',
        }],
      };
      (global.fetch as import("vitest").Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiData,
      });

      const result = await service.getMatchDetails('123');
      expect(result.id).toBe('123');
      expect(result.homeTeam).toBe('Home');
      expect(result.venue).toBe('Test Stadium');
    });

    it('returns fallback details on API error', async () => {
      (global.fetch as import("vitest").Mock).mockRejectedValueOnce(new Error('Network error'));
      const result = await service.getMatchDetails('123');
      expect(result.id).toBe('123');
      expect(result.homeTeam).toBe('Argentina'); // Fallback data
    });
  });

  describe('getLiveMatch', () => {
    it('returns live stats with Full-Time status', async () => {
      const mockApiData = {
        events: [{
          idEvent: '123',
          strStatus: 'FT',
          intHomeScore: '2',
          intAwayScore: '1',
        }],
      };
      (global.fetch as import("vitest").Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiData,
      });

      const result = await service.getLiveMatch('123');
      expect(result.status).toBe('Full-Time');
      expect(result.minute).toBe(90);
      expect(result.homeScore).toBe(2);
    });

    it('returns live stats with Live status', async () => {
      const mockApiData = {
        events: [{
          idEvent: '123',
          strStatus: 'In Progress',
          intHomeScore: '1',
          intAwayScore: '1',
        }],
      };
      (global.fetch as import("vitest").Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiData,
      });

      const result = await service.getLiveMatch('123');
      expect(result.status).toBe('Live');
      expect(result.minute).toBe(45);
    });
  });

  describe('getTeamDetails', () => {
    it('returns team details on success', async () => {
      const mockData = {
        teams: [{
          idTeam: 't1',
          strTeam: 'FC Test',
          strTeamShort: 'FCT',
          strBadge: 'badge.png',
          strManager: 'Manager',
        }],
      };
      (global.fetch as import("vitest").Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await service.getTeamDetails('t1');
      expect(result.id).toBe('t1');
      expect(result.code).toBe('FCT');
      expect(result.coach).toBe('Manager');
    });
  });

  describe('getTeamSquad', () => {
    it('returns players list', async () => {
      const mockData = {
        player: [{
          idPlayer: 'p1',
          strPlayer: 'Player 1',
          strPosition: 'Forward',
          strNumber: '10',
        }],
      };
      (global.fetch as import("vitest").Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await service.getTeamSquad('t1');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('p1');
      expect(result[0].number).toBe(10);
      expect(result[0].position).toBe('Forward');
    });
  });

  describe('getTournamentSchedule', () => {
    it('aggregates schedule correctly', async () => {
      const mockToday = {
        events: [{
          idEvent: 'e1',
          dateEvent: '2026-07-19',
          strTime: '15:00:00',
          strHomeTeam: 'Home',
          strAwayTeam: 'Away',
          strStatus: 'Match Finished',
        }],
      };
      const mockWc = {
        events: [{
          idEvent: 'e2', // different event
          dateEvent: '2026-07-20',
          strTime: '18:00:00',
          strHomeTeam: 'Team C',
          strAwayTeam: 'Team D',
          strStatus: 'Not Started',
        }],
      };

      (global.fetch as import("vitest").Mock).mockImplementation((url: string) => {
        if (url.includes('eventsday')) return Promise.resolve({ ok: true, json: async () => mockToday });
        if (url.includes('eventsseason')) return Promise.resolve({ ok: true, json: async () => mockWc });
      });

      const result = await service.getTournamentSchedule();
      expect(result).toHaveLength(2);
      // It should be sorted by date
      expect(result[0].id).toBe('e1');
      expect(result[0].status).toBe('Completed');
      expect(result[1].id).toBe('e2');
      expect(result[1].status).toBe('Upcoming');
    });
  });
});
