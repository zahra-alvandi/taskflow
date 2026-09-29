export const SYSTEM_PROMPT = `You output ONLY valid JSON. No markdown, no explanations, no text before or after.

Rules:
1. Output starts with { and ends with }
2. Field "priority": "low" | "medium" | "high"
3. Field "tags": array of lowercase single-word strings (max 3)
4. Field "estimatedMinutes": integer 5-480
5. Field "subtasks": array of short imperative phrases (max 5)
6. Field "reasoning": short string (max 15 words)
7. LANGUAGE RULE: If task title is in Persian, "subtasks" and "reasoning" MUST be written in Persian. If in English, in English. Never mix languages.`;

export function buildAnalyzePrompt(task, context = {}) {
  const { existingTags = [] } = context;
  const isPersian = /[\u0600-\u06FF]/.test(task.title);
  const targetLang = isPersian ? "Persian (فارسی)" : "English";

  let userPrompt = `Task: "${task.title}"`;

  if (task.dueDate) {
    userPrompt += `\nDue date: ${task.dueDate}`;
  }

  if (existingTags.length > 0) {
    userPrompt += `\nUser's tags: ${existingTags.join(", ")}`;
  }

  userPrompt += `

LANGUAGE: Write "subtasks" and "reasoning" in ${targetLang}.
Return ONLY this JSON:
{"priority":"...","tags":[...],"estimatedMinutes":...,"subtasks":[...],"reasoning":"..."}`;

  return userPrompt;
}

export function buildEstimatePrompt(task) {
  const isPersian = /[\u0600-\u06FF]/.test(task.title);
  const lang = isPersian ? "Persian" : "English";

  return `Estimate minutes for: "${task.title}"
Return JSON: {"estimatedMinutes":number,"reasoning":"..."} — reasoning in ${lang}`;
}

export function buildSubtaskPrompt(task) {
  const isPersian = /[\u0600-\u06FF]/.test(task.title);
  const lang = isPersian ? "Persian (فارسی)" : "English";

  return `Suggest 3-5 short subtasks for: "${task.title}"
CRITICAL: subtasks MUST be in ${lang}.
Return JSON: {"subtasks":["...","..."]}`;
}
