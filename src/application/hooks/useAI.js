import { useMemo, useState, useCallback } from "react";
import { createAIService } from "../../core/container";
import { useAISettings } from "./useAISettings";

export function useAI() {
  const { settings, isConfigured } = useAISettings();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const service = useMemo(() => createAIService(settings), [settings]);

  const _run = useCallback(
    async (fn, ...args) => {
      if (!isConfigured) return null;

      setLoading(true);
      setError(null);
      try {
        const result = await fn(...args);
        return result;
      } catch (err) {
        console.error("AI error:", err);
        setError(err.message ?? "AI request failed");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isConfigured],
  );

  const analyzeTask = useCallback(
    (task, context) => _run(service.analyzeTask.bind(service), task, context),
    [service, _run],
  );

  const estimateTask = useCallback(
    (task) => _run(service.estimateTask.bind(service), task),
    [service, _run],
  );

  const suggestSubtasks = useCallback(
    (task) => _run(service.suggestSubtasks.bind(service), task),
    [service, _run],
  );

  return {
    isAvailable: isConfigured,
    isConfigured,
    loading,
    error,
    service,
    analyzeTask,
    estimateTask,
    suggestSubtasks,
  };
}
