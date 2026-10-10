import { LocalStorageAdapter } from "../infrastructure/storage/LocalStorageAdapter";
import { LocalTaskRepository } from "../infrastructure/repositories/LocalTaskRepository";
import { LocalPlanRepository } from "../infrastructure/repositories/LocalPlanRepository";
import { LocalNoteRepository } from "../infrastructure/repositories/LocalNoteRepository";
import { LocalUserRepository } from "../infrastructure/repositories/LocalUserRepository";
import { NullAIService } from "../infrastructure/ai/NullAIService";
import { OpenRouterAIService } from "../infrastructure/ai/OpenRouterAIService";
import { GeminiAIService } from "../infrastructure/ai/GeminiAIService";
import { GroqAIService } from "../infrastructure/ai/GroqAIService";

/* ================================
   Storage
================================ */
export const storage = new LocalStorageAdapter("whiskerly");

/* ================================
   Repositories
================================ */
export const taskRepository = new LocalTaskRepository(storage);
export const planRepository = new LocalPlanRepository(storage);
export const noteRepository = new LocalNoteRepository(storage);
export const userRepository = new LocalUserRepository(storage);

/* ================================
   AI Service Factory
================================ */
export function createAIService(settings) {
  if (!settings?.enabled || !settings?.apiKey) {
    return new NullAIService();
  }

  if (settings.provider === "groq") {
    return new GroqAIService({
      apiKey: settings.apiKey,
      model: settings.model,
    });
  }

  if (settings.provider === "openrouter") {
    return new OpenRouterAIService({
      apiKey: settings.apiKey,
      model: settings.model,
    });
  }

  if (settings.provider === "gemini") {
    return new GeminiAIService({
      apiKey: settings.apiKey,
      model: settings.model,
    });
  }

  return new NullAIService();
}
