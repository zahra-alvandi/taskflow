import { AIService } from "../../core/ports/AIService";
import {
  SYSTEM_PROMPT,
  buildAnalyzePrompt,
  buildEstimatePrompt,
  buildSubtaskPrompt,
} from "./prompts";

export class GroqAIService extends AIService {
  constructor({ apiKey, model = "llama-3.3-70b-versatile" } = {}) {
    super();
    this.apiKey = apiKey;
    this.model = model;
    this.baseURL = "https://api.groq.com/openai/v1/chat/completions";
  }

  /**
  
   * @private
   */
  async _call(messages, options = {}) {
    if (!this.apiKey) {
      throw new Error("Groq API key is missing");
    }

    const response = await fetch(this.baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: options.temperature ?? 0.3,
        max_tokens: options.maxTokens ?? 500,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty response from Groq");
    }

    try {
      return JSON.parse(content);
    } catch (err) {
      console.error("Failed to parse Groq response:", content);
      throw new Error("Invalid JSON from Groq");
    }
  }

  async analyzeTask(task, context = {}) {
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildAnalyzePrompt(task, context) },
    ];

    return await this._call(messages);
  }

  async estimateTask(task) {
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildEstimatePrompt(task) },
    ];

    return await this._call(messages);
  }

  async suggestSubtasks(task) {
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildSubtaskPrompt(task) },
    ];

    return await this._call(messages);
  }

  async parseNaturalLanguage(text) {
    return await this.analyzeTask({ title: text });
  }

  async suggestPriority(task) {
    const result = await this.analyzeTask(task);
    return { priority: result.priority, confidence: 0.8 };
  }

  async suggestTags(task) {
    const result = await this.analyzeTask(task);
    return { tags: result.tags ?? [], confidence: 0.8 };
  }
}
