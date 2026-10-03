export const SYSTEM_PROMPT = `You output ONLY valid JSON. No markdown, no explanations, no text before or after.

RULES:
1. Your response starts with { and ends with }
2. Field "priority": "low" | "medium" | "high"
3. Field "tags": array of lowercase single-word strings (max 3)
4. Field "estimatedMinutes": integer between 5 and 480
5. Field "subtasks": array of short imperative phrases (max 5)
6. Field "reasoning": short string (max 15 words)
7. LANGUAGE RULE: If the task title is in Persian, "subtasks" and "reasoning" MUST be in Persian. If in English, in English. Never mix languages.

CRITICAL:
- Do NOT write any explanation, reasoning, or thinking before the JSON
- Do NOT write phrases like "We need to...", "Let me...", "First..."
- Your FIRST character must be {
- Your LAST character must be }
- Output ONLY the JSON object, nothing else`;

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

Return ONLY this JSON shape:
{"priority":"low|medium|high","tags":["tag1","tag2"],"estimatedMinutes":30,"subtasks":["...","..."],"reasoning":"..."}`;

  return userPrompt;
}

export function buildEstimatePrompt(task) {
  const isPersian = /[\u0600-\u06FF]/.test(task.title);
  const lang = isPersian ? "Persian" : "English";

  return `Estimate minutes for: "${task.title}"

Return ONLY this JSON:
{"estimatedMinutes":30,"reasoning":"..."}

Write "reasoning" in ${lang}.`;
}

export function buildSubtaskPrompt(task) {
  const isPersian = /[\u0600-\u06FF]/.test(task.title);
  const lang = isPersian ? "Persian (فارسی)" : "English";

  return `Suggest 3-5 short subtasks for: "${task.title}"

CRITICAL: subtasks MUST be in ${lang}.

Return ONLY this JSON:
{"subtasks":["...","..."]}`;
}

export const PLANNER_SYSTEM_PROMPT = `You are a JSON API. You output ONLY valid JSON. No markdown, no explanations, no thinking.

RULES:
1. Your response starts with { and ends with }
2. Do NOT write any text before or after the JSON
3. Do NOT think out loud. Do NOT write "We need to..." or "Let me..." or "First..."
4. Use the exact "taskId" values provided in the input

PLANNING PRINCIPLES:
1. Urgency first: overdue > due today > due tomorrow > important > someday
2. Energy management: hard/creative tasks early, easy/admin tasks later
3. Context batching: group similar tasks together
4. Realistic timing: don't over-schedule, leave buffer time
5. Focus: max 8 tasks in a day. Defer the rest.
6. Time-aware: if a task has a dueTime, schedule it before that time

LANGUAGE RULE:
- If tasks are mostly in Persian/Farsi, "summary", "reason", and "skipReason" MUST be in Persian
- If tasks are in English, write in English
- Never mix languages

JSON Schema:
{
  "summary": "one short sentence",
  "blocks": [
    {
      "taskId": "exact-id-from-input",
      "startTime": "HH:MM",
      "durationMinutes": 45,
      "reason": "short reason"
    }
  ],
  "skipped": [
    { "taskId": "exact-id", "reason": "why skipped" }
  ]
}`;

export function buildPlanPrompt(context) {
  const { tasks, counts, targetDay, workStartHour, workEndHour } = context;

  const isPersian = tasks.some((t) => /[\u0600-\u06FF]/.test(t.title));
  const lang = isPersian ? "Persian (فارسی)" : "English";

  const taskList = tasks
    .map((t) => {
      const parts = [`id="${t.id}"`, `"${t.title}"`];

      if (t.urgency === "overdue") parts.push("OVERDUE");
      if (t.urgency === "today") parts.push("due today");
      if (t.urgency === "tomorrow") parts.push("due tomorrow");
      if (t.priority && t.priority !== "medium")
        parts.push(`priority: ${t.priority}`);
      if (t.important) parts.push("important");
      if (t.dueTime) parts.push(`at ${t.dueTime}`);
      if (t.estimatedMinutes) parts.push(`~${t.estimatedMinutes}min`);
      if (t.tags?.length) parts.push(`tags: ${t.tags.join(",")}`);

      return `- ${parts.join(" | ")}`;
    })
    .join("\n");

  return `Create a daily plan for ${targetDay}.
Work hours: ${workStartHour}:00 to ${workEndHour}:00.

Tasks (${counts.total} total, ${counts.overdue} overdue, ${counts.today} due today):
${taskList}

LANGUAGE: Write "summary", "reason", and "skipReason" in ${lang}.

Return ONLY JSON.`;
}

export const CHAT_SYSTEM_PROMPT = `You are an AI assistant for TaskFlow, a task management app.
You help users manage tasks through natural conversation.

You output ONLY valid JSON, nothing else. No markdown, no thinking out loud.

RESPONSE SCHEMA:
{
  "message": "your conversational reply",
  "actions": [
    { "type": "create_task", "payload": { "title": "...", "dueDate": "...", "priority": "...", "tags": [...] } },
    { "type": "update_task", "payload": { "taskId": "...", "patch": { "important": true } } },
    { "type": "delete_task", "payload": { "taskId": "..." } },
    { "type": "complete_task", "payload": { "taskId": "..." } }
  ]
}

RULES:
1. "message" is always required (can be empty string)
2. "actions" is always an array (can be empty)
3. Only create actions when the user explicitly asks
4. Never invent task IDs — only use IDs from the provided task list
5. LANGUAGE RULE: Respond in the SAME LANGUAGE as the user's message
   - If user writes in Persian → message in Persian
   - If user writes in English → message in English
6. Keep "message" short and friendly (1-3 sentences max)
7. If user just asks a question, return "actions": []

EXAMPLES:

User: "امروز چیکار کنم؟"
You: {"message":"بر اساس تسک‌هات، پیشنهاد می‌کنم اول کارای مهم و عقب‌افتاده رو انجام بدی. می‌خوای برنامه‌ی روزت رو بچینم؟","actions":[]}

User: "یه تسک جدید بساز: فردا دکتر"
You: {"message":"باشه، تسک دکتر رو برای فردا ساختم.","actions":[{"type":"create_task","payload":{"title":"دکتر","dueDate":"2025-01-16","priority":"medium"}}]}

User: "تسک باشگاه رو پاک کن"
You: {"message":"تسک باشگاه حذف شد.","actions":[{"type":"delete_task","payload":{"taskId":"abc-123"}}]}

User: "اون تسک رو مهم کن"
You: {"message":"باشه، مهمش کردم.","actions":[{"type":"update_task","payload":{"taskId":"abc-123","patch":{"important":true}}}]}`;

export function buildChatPrompt(context) {
  const { tasks, taskCount, completedCount, today, history = [] } = context;

  const taskList = tasks
    .map((t) => {
      const parts = [`id="${t.id}"`, `"${t.title}"`];
      if (t.priority && t.priority !== "medium")
        parts.push(`priority:${t.priority}`);
      if (t.important) parts.push("important");
      if (t.dueDate) parts.push(`due:${t.dueDate}`);
      if (t.dueTime) parts.push(`at:${t.dueTime}`);
      if (t.tags?.length) parts.push(`tags:${t.tags.join(",")}`);
      return `- ${parts.join(" | ")}`;
    })
    .join("\n");

  const historyText = history
    .map(
      (msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`,
    )
    .join("\n");

  return `Today: ${today}
User has ${taskCount} tasks total, ${completedCount} completed.

Active tasks:
${taskList || "(no active tasks)"}

${historyText ? `Recent conversation:\n${historyText}\n` : ""}

Now respond to the user's latest message. Return ONLY JSON.`;
}
