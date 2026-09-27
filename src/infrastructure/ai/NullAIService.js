import { AIService } from "../../core/ports/AIService";

export class NullAIService extends AIService {
  async parseNaturalLanguage(text) {
    return { title: text, tags: [], priority: null, dueDate: null };
  }

  async estimateTask() {
    return { estimatedMinutes: null, confidence: 0 };
  }

  async suggestPriority() {
    return { priority: null, confidence: 0 };
  }

  async suggestTags() {
    return { tags: [], confidence: 0 };
  }
}
