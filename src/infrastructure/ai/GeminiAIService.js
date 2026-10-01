import { AIService } from "../../core/ports/AIService";
import {
  SYSTEM_PROMPT,
  buildAnalyzePrompt,
  buildEstimatePrompt,
  buildSubtaskPrompt,
  PLANNER_SYSTEM_PROMPT,
  buildPlanPrompt,
} from "./prompts";

const MODEL_FALLBACKS = [
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.5-flash-lite",
];

export class GeminiAIService extends AIService {
  constructor({ apiKey, model = "gemini-3.8-flash" } = {}) {
    super();
    this.apiKey = apiKey;
    this.model = model;
    this.baseURL = "/api/gemini";
  }

  async _callWithRetry(systemPrompt, userPrompt, options = {}) {
    const models = [
      this.model,
      ...MODEL_FALLBACKS.filter((m) => m !== this.model),
    ];

    let lastError = null;

    for (const model of models) {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const result = await this._callOnce(
            model,
            systemPrompt,
            userPrompt,
            options,
          );
          return result;
        } catch (err) {
          lastError = err;

          if (
            !err.message?.includes("503") &&
            !err.message?.includes("UNAVAILABLE")
          ) {
            throw err;
          }

          const delay = 1000 * Math.pow(2, attempt); // 1s, 2s, 4s
          console.warn(
            `⚠️ ${model} overloaded (attempt ${attempt + 1}/3). Retrying in ${delay}ms...`,
          );
          await new Promise((r) => setTimeout(r, delay));
        }
      }

      console.warn(`🔄 Switching from ${model} to next fallback model...`);
    }

    throw lastError ?? new Error("All Gemini models are unavailable");
  }

  async _callOnce(model, systemPrompt, userPrompt, options = {}) {
    if (!this.apiKey) {
      throw new Error("Gemini API key is missing");
    }

    const url = `${this.baseURL}/v1beta/models/${model}:generateContent?key=${this.apiKey}`;

    const body = {
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      generationConfig: {
        temperature: options.temperature ?? 0.2,
        maxOutputTokens: options.maxTokens ?? 800,
        responseMimeType: "application/json",
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error("Empty response from Gemini");
    }

    return this._parseJSON(content);
  }

  _parseJSON(text) {
    try {
      return JSON.parse(text);
    } catch {}

    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    if (first !== -1 && last > first) {
      try {
        return JSON.parse(text.slice(first, last + 1));
      } catch {}
    }

    console.error("Failed to parse Gemini response:", text);
    throw new Error("Invalid JSON from Gemini");
  }

  async analyzeTask(task, context = {}) {
    return await this._callWithRetry(
      SYSTEM_PROMPT,
      buildAnalyzePrompt(task, context),
    );
  }

  async estimateTask(task) {
    return await this._callWithRetry(SYSTEM_PROMPT, buildEstimatePrompt(task));
  }

  async suggestSubtasks(task) {
    return await this._callWithRetry(SYSTEM_PROMPT, buildSubtaskPrompt(task));
  }

  async planDay(context) {
    return await this._callWithRetry(
      PLANNER_SYSTEM_PROMPT,
      buildPlanPrompt(context),
      { maxTokens: 2000, temperature: 0.3 },
    );
  }

  async parseNaturalLanguage(text) {
    return await this.analyzeTask({ title: text });
  }

  async suggestPriority(task) {
    const r = await this.analyzeTask(task);
    return { priority: r.priority, confidence: 0.8 };
  }

  async suggestTags(task) {
    const r = await this.analyzeTask(task);
    return { tags: r.tags ?? [], confidence: 0.8 };
  }
}
