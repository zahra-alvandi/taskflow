import { LocalStorageAdapter } from "../infrastructure/storage/LocalStorageAdapter";
import { LocalTaskRepository } from "../infrastructure/repositories/LocalTaskRepository";
import { NullAIService } from "../infrastructure/ai/NullAIService";
import { GroqAIService } from "../infrastructure/ai/GroqAIService";
import { OpenRouterAIService } from "../infrastructure/ai/OpenRouterAIService";
import { GeminiAIService } from "../infrastructure/ai/GeminiAIService";
import { LocalPlanRepository } from "../infrastructure/repositories/LocalPlanRepository";

const storage = new LocalStorageAdapter("taskflow");

export const taskRepository = new LocalTaskRepository(storage);
export const planRepository = new LocalPlanRepository(storage);

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
