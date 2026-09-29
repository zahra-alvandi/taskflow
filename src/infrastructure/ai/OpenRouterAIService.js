import { AIService } from "../../core/ports/AIService";
import {
  SYSTEM_PROMPT,
  buildAnalyzePrompt,
  buildEstimatePrompt,
  buildSubtaskPrompt,
} from "./prompts";

export class OpenRouterAIService extends AIService {
  constructor({
    apiKey,
    model = "qwen/qwen3-next-80b-a3b-instruct:free",
  } = {}) {
    super();
    this.apiKey = apiKey;
    this.model = model;
    this.baseURL = "https://openrouter.ai/api/v1/chat/completions";
  }

  /**
   * @private
   */
  async _call(messages, options = {}) {
    if (!this.apiKey) {
      throw new Error("OpenRouter API key is missing");
    }

    const response = await fetch(this.baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "TaskFlow",
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: options.temperature ?? 0.1,
        max_tokens: options.maxTokens ?? 800,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenRouter API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty response from OpenRouter");
    }

    const parsed = this._tryParseJSON(content);
    if (parsed) return parsed;

    const extracted = this._extractJSON(content);
    if (extracted) return extracted;

    console.error("Failed to parse OpenRouter response:", content);
    throw new Error("Invalid JSON from OpenRouter");
  }

  /**
   * @private
   */
  _tryParseJSON(text) {
    try {
      const result = JSON.parse(text);
      if (result && typeof result === "object") {
        return result;
      }
    } catch {
      // ignore
    }
    return null;
  }

  /**
  
   * @private
   */
  _extractJSON(text) {
    if (!text || typeof text !== "string") return null;

    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      return null;
    }

    const jsonStr = text.slice(firstBrace, lastBrace + 1);

    try {
      const result = JSON.parse(jsonStr);
      if (result && typeof result === "object") {
        return result;
      }
    } catch {
      // ignore
    }

    return null;
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
