import { AIService } from "../../core/ports/AIService";
import {
  SYSTEM_PROMPT,
  buildAnalyzePrompt,
  buildEstimatePrompt,
  buildSubtaskPrompt,
  PLANNER_SYSTEM_PROMPT,
  buildPlanPrompt,
} from "./prompts";

export class OpenRouterAIService extends AIService {
  constructor({ apiKey, model = "openai/gpt-oss-20b:free" } = {}) {
    super();
    this.apiKey = apiKey;
    this.model = model;
    this.baseURL = "/api/openrouter/chat/completions";
  }

  /**
   * @private
   */
  async _call(messages, options = {}) {
    if (!this.apiKey) {
      throw new Error("OpenRouter API key is missing");
    }

    try {
      return await this._callOnce(messages, options);
    } catch (err) {
      if (
        err.message?.includes("Invalid JSON") ||
        err.message?.includes("Empty response")
      ) {
        console.warn("⚠️ Retrying with stricter JSON reminder...");

        const stricterMessages = [
          ...messages,
          {
            role: "user",
            content:
              "CRITICAL: You MUST output ONLY valid JSON. No explanations. Start with { and end with }. Do it now.",
          },
        ];

        return await this._callOnce(stricterMessages, options);
      }
      throw err;
    }
  }

  async _callOnce(messages, options = {}) {
    const response = await fetch(this.baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
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

    if (!content) throw new Error("Empty response from OpenRouter");

    let cleanContent = content;
    if (!cleanContent.trim().startsWith("{")) {
      const firstBrace = cleanContent.indexOf("{");
      if (firstBrace > 0) {
        cleanContent = cleanContent.slice(firstBrace);
      }
    }

    const parsed = this._tryParseJSON(content);
    if (parsed) return parsed;

    const extracted = this._extractJSON(content);
    if (extracted) return extracted;

    console.error("Failed to parse:", content);
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

  async planDay(context) {
    const messages = [
      { role: "system", content: PLANNER_SYSTEM_PROMPT },
      { role: "user", content: buildPlanPrompt(context) },
    ];

    return await this._call(messages, { maxTokens: 1500, temperature: 0.3 });
  }
}
