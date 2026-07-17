import { GeminiAIService } from "./GeminiAIService";
import { LiveMapService } from "./LiveMapService";
import { LiveMatchService } from "./LiveMatchService";
import { LiveWeatherService } from "./LiveWeatherService";
import { NotificationService } from "./NotificationService";

// Service Locator / Factory
// This centralizes the instantiation of our external integrations.
// If an environment variable is missing for an API key, the Live*Service 
// implementation will automatically and gracefully fallback to its Mock counterpart.
export const aiService = new GeminiAIService();
export const mapService = new LiveMapService();
export const matchService = new LiveMatchService();
export const weatherService = new LiveWeatherService();
export const notificationService = new NotificationService();
