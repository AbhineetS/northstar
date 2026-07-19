/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMatchDetails, ILiveMatchStats, ITeamProfile, IPlayer, IScheduleItem, IMatchService } from "./interfaces";
import { useApiStore } from "../store/useApiStore";

export class LiveMatchService implements IMatchService {
  private cache: Record<string, { data: unknown; timestamp: number }> = {};
  private CACHE_TTL = 60000; // 60 seconds
  private BASE_URL = "https://www.thesportsdb.com/api/v1/json/3";

  private async fetchApi(endpoint: string, cacheKey?: string): Promise<any> {
    if (cacheKey && this.cache[cacheKey] && Date.now() - this.cache[cacheKey].timestamp < this.CACHE_TTL) {
      return this.cache[cacheKey].data;
    }

    useApiStore.getState().startRequest();
    try {
      const response = await fetch(`${this.BASE_URL}${endpoint}`);

      if (!response.ok) {
        throw new Error(`TheSportsDB error: ${response.statusText}`);
      }

      const data = await response.json();
      useApiStore.getState().endRequest();

      if (cacheKey) {
        this.cache[cacheKey] = { data, timestamp: Date.now() };
      }
      return data;
    } catch (e) {
      console.error("MatchService API Error:", e);
      useApiStore.getState().setError("Football", "Failed to fetch match data");
      useApiStore.getState().endRequest();
      throw e;
    }
  }

  async getMatchDetails(matchId: string): Promise<IMatchDetails> {
    try {
      const data = await this.fetchApi(`/lookupevent.php?id=${matchId}`);
      if (Array.isArray(data.events) && data.events.length > 0) {
        const event = data.events[0];
        return {
          id: event.idEvent,
          homeTeam: event.strHomeTeam,
          homeTeamId: event.idHomeTeam,
          awayTeam: event.strAwayTeam,
          awayTeamId: event.idAwayTeam,
          kickoffTime: new Date(`${event.dateEvent}T${event.strTime}`),
          venue: event.strVenue || "Stadium",
          gate: "Gate D",
          section: "143",
          seat: "Row 12, Seat 4"
        };
      }
    } catch (e) {
      console.warn("API Error, falling back to mock match details", e);
    }
    
    // Fallback if data.events is null or API fails
    return {
      id: matchId,
      homeTeam: "USA", homeTeamId: "usa",
      awayTeam: "England", awayTeamId: "eng",
      kickoffTime: new Date(Date.now() + 1000 * 60 * 60 * 24), // tomorrow
      venue: "MetLife Stadium", gate: "Gate D", section: "143", seat: "Row 12, Seat 4",
    };
  }

  async getLiveMatch(matchId: string): Promise<ILiveMatchStats> {
    try {
      const data = await this.fetchApi(`/lookupevent.php?id=${matchId}`); 
      if (Array.isArray(data.events) && data.events.length > 0) {
        const event = data.events[0];
        const statusRaw = event.strStatus;
        let status: "Pre-Match" | "Live" | "Half-Time" | "Full-Time" = "Pre-Match";
        
        if (statusRaw === "Match Finished" || statusRaw === "FT") status = "Full-Time";
        else if (statusRaw === "HT") status = "Half-Time";
        else if (statusRaw && statusRaw !== "NS" && statusRaw !== "Not Started") status = "Live";

        return {
          id: event.idEvent,
          minute: status === "Live" ? 45 : (status === "Full-Time" ? 90 : 0),
          status,
          homeScore: parseInt(event.intHomeScore) || 0,
          awayScore: parseInt(event.intAwayScore) || 0,
          homePossession: 50,
          awayPossession: 50,
          events: [], 
        };
      }
    } catch (e) {
      console.warn("API Error, falling back to mock live match stats", e);
    }
    
    // Fallback if data.events is null or API fails
    return {
      id: matchId, minute: 45, status: "Live",
      homeScore: 1, awayScore: 1, homePossession: 55, awayPossession: 45,
      events: [{ minute: 12, type: "Goal", player: "Christian Pulisic", teamId: "usa", detail: "" }]
    };
  }

  async getTeamDetails(teamId: string): Promise<ITeamProfile> {
    try {
      const data = await this.fetchApi(`/lookupteam.php?id=${teamId}`, `team-${teamId}`);
      if (data.teams && data.teams.length > 0) {
        const team = data.teams[0];
        return {
          id: team.idTeam,
          name: team.strTeam,
          code: team.strTeamShort || team.strTeam.substring(0, 3).toUpperCase(),
          logo: team.strBadge || team.strTeamBadge,
          coach: team.strManager || "Head Coach",
          formation: "4-3-3",
          recentForm: ["W", "D", "W", "L", "W"],
        };
      }
    } catch (e) {
      console.warn("Falling back to mock team details", e);
      return { id: teamId, name: "Team Name", code: "TMN", logo: "", coach: "Coach", formation: "4-3-3", recentForm: ["W", "W", "W"] };
    }
    throw new Error("Team not found");
  }

  async getTeamSquad(teamId: string): Promise<IPlayer[]> {
    const data = await this.fetchApi(`/lookup_all_players.php?id=${teamId}`, `squad-${teamId}`);
    if (data.player && data.player.length > 0) {
      return data.player.map((p: { idPlayer: string; strPlayer: string; strPosition: string; strCutout: string; strNumber?: string }) => ({
        id: p.idPlayer,
        name: p.strPlayer,
        number: parseInt(p.strNumber || "") || Math.floor(Math.random() * 99) + 1,
        position: p.strPosition || "Unknown",
        isStarting: false, // Free tier fallback
        rating: Math.floor(Math.random() * (95 - 75 + 1)) + 75, // Free tier fallback for visual UI
      }));
    }
    return [];
  }

  async getTournamentSchedule(): Promise<IScheduleItem[]> {
    const today = new Date().toISOString().split("T")[0];
    const scheduleItems: IScheduleItem[] = [];

    try {
      // 1. Fetch today's matches
      const todayData = await this.fetchApi(`/eventsday.php?d=${today}&s=Soccer`, `schedule-today-${today}`);
      
      // 2. Fetch FIFA World Cup (League 4429) season 2026 matches
      const wcData = await this.fetchApi(`/eventsseason.php?id=4429&s=2026`, `schedule-wc-2026`);

      const rawEvents = [];
      if (todayData.events) rawEvents.push(...todayData.events.slice(0, 10)); // Take top 10 today
      if (wcData.events) rawEvents.push(...wcData.events.slice(0, 10)); // Take top 10 World Cup

      // Filter duplicates
      const seen = new Set();
      for (const event of rawEvents) {
        if (!seen.has(event.idEvent)) {
          seen.add(event.idEvent);
          const statusRaw = event.strStatus;
          let status = "Upcoming";
          if (statusRaw === "Match Finished" || statusRaw === "FT") status = "Completed";
          else if (statusRaw && statusRaw !== "NS" && statusRaw !== "Not Started") status = "Live";

          scheduleItems.push({
            id: event.idEvent,
            date: new Date(`${event.dateEvent}T${event.strTime}`),
            homeTeam: event.strHomeTeam,
            homeTeamId: event.idHomeTeam,
            awayTeam: event.strAwayTeam,
            awayTeamId: event.idAwayTeam,
            venue: event.strVenue || "Stadium",
            status,
            homeScore: parseInt(event.intHomeScore) || 0,
            awayScore: parseInt(event.intAwayScore) || 0,
          });
        }
      }
      
      // Sort by date ascending
      scheduleItems.sort((a, b) => a.date.getTime() - b.date.getTime());
      
      return scheduleItems;
    } catch (err) {
      console.error("Failed to aggregate schedule:", err);
      return scheduleItems;
    }
  }

  async getTournamentTeams(): Promise<ITeamProfile[]> {
    const data = await this.fetchApi(`/search_all_teams.php?l=FIFA%20World%20Cup`, `teams-wc`);
    if (data.teams) {
      return data.teams.map((team: { idTeam: string; strTeam: string; strTeamBadge: string; strManager: string; strTeamShort?: string; strBadge?: string }) => ({
        id: team.idTeam,
        name: team.strTeam,
        code: team.strTeamShort || team.strTeam.substring(0, 3).toUpperCase(),
        logo: team.strBadge || team.strTeamBadge,
        coach: team.strManager || "Head Coach",
        formation: "4-3-3",
        recentForm: ["W", "D", "W", "L", "W"]
      }));
    }
    return [];
  }
}
