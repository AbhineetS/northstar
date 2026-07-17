
export interface IWeatherCondition {
  condition: "clear" | "clouds" | "rain" | "snow" | "extreme";
  temperatureC: number;
  description: string;
  rainProbability: number;
  windSpeedKmh: number;
  uvIndex: number;
  alerts: string[];
}

export interface IMatchDetails {
  id: string;
  homeTeam: string;
  homeTeamId: string;
  awayTeam: string;
  awayTeamId: string;
  kickoffTime: Date;
  venue: string;
  gate: string;
  section: string;
  seat: string;
}

export interface ITeamProfile {
  id: string;
  name: string;
  code: string;
  logo: string;
  coach: string;
  formation: string;
  recentForm: string[]; // e.g. ["W", "D", "W", "L", "W"]
}

export interface IPlayer {
  id: string;
  name: string;
  number: number;
  position: string;
  isStarting: boolean;
  rating?: number;
  stats?: {
    goals?: number;
    assists?: number;
    yellowCards?: number;
    redCards?: number;
  };
}

export interface IMatchEvent {
  minute: number;
  type: "Goal" | "Yellow Card" | "Red Card" | "Substitution" | "VAR";
  player: string;
  teamId: string;
  detail: string;
}

export interface ILiveMatchStats {
  id: string;
  minute: number;
  status: "Pre-Match" | "Live" | "Half-Time" | "Full-Time";
  homeScore: number;
  awayScore: number;
  homePossession: number;
  awayPossession: number;
  events: IMatchEvent[];
}

export interface IScheduleItem {
  id: string;
  date: Date;
  homeTeam: string;
  homeTeamId: string;
  awayTeam: string;
  awayTeamId: string;
  venue: string;
  status: string;
  homeScore?: number;
  awayScore?: number;
}

export interface IAIChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface IRouteOptimization {
  estimatedMinutes: number;
  recommendedTransport: string;
  crowdLevel: "low" | "medium" | "high";
  pathGeoJSON?: unknown;
}

export interface IWeatherService {
  getCurrentWeather(lat: number, lon: number): Promise<IWeatherCondition>;
}

export interface IMatchService {
  getMatchDetails(matchId: string): Promise<IMatchDetails>;
  getLiveMatch(matchId: string): Promise<ILiveMatchStats>;
  getTeamDetails(teamId: string): Promise<ITeamProfile>;
  getTeamSquad(teamId: string): Promise<IPlayer[]>;
  getTournamentSchedule(): Promise<IScheduleItem[]>;
  getTournamentTeams(): Promise<ITeamProfile[]>;
}

export interface IRecommendation {
  title: string;
  text: string;
  action: string | null;
}

export interface IOpsRecommendation {
  id: string;
  title: string;
  context: string;
  prediction: string;
  action: string;
  impact: string;
  priority: "critical" | "high" | "medium";
}

export interface IAIService {
  generateRecommendation(context: unknown): Promise<IRecommendation>;
  generateOpsRecommendations(context: unknown): Promise<IOpsRecommendation[]>;
  chat(messages: IAIChatMessage[], context?: unknown): Promise<string>;
}

export interface IMapService {
  getOptimizedRoute(origin: [number, number], destination: [number, number]): Promise<IRouteOptimization>;
}

export interface ILocation {
  id: string;
  type: "info" | "warning" | "emergency" | "success";
  title: string;
  message: string;
  timestamp: Date;
}

export interface INotification {
  id: string;
  type: "info" | "warning" | "emergency" | "success";
  title: string;
  message: string;
  timestamp: Date;
  targetProfile: "Fan" | "Organizer" | "Volunteer" | "Staff" | "All";
  actionLabel?: string;
  actionUrl?: string;
}

export interface INotificationService {
  subscribe(profile: string, callback: (notification: INotification) => void): () => void;
  broadcast(notification: Omit<INotification, "id" | "timestamp">): void;
}
