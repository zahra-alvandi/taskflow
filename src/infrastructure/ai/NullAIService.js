import { AIService } from "../../core/ports/AIService";

export class NullAIService extends AIService {
  async analyzeTask() {
    return {
      priority: null,
      tags: [],
      estimatedMinutes: null,
      subtasks: [],
      reasoning: null,
    };
  }

  async estimateTask() {
    return { estimatedMinutes: null, reasoning: null };
  }

  async suggestSubtasks() {
    return { subtasks: [] };
  }

  async parseNaturalLanguage(text) {
    return { title: text, tags: [], priority: null, dueDate: null };
  }

  async suggestPriority() {
    return { priority: null, confidence: 0 };
  }

  async suggestTags() {
    return { tags: [], confidence: 0 };
  }
  async planDay() {
    return { summary: "", blocks: [], skipped: [] };
  }
}
