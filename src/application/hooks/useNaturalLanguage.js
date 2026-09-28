import { useMemo } from "react";
import { parseNaturalLanguage } from "../../core/services/nlParser";

export function useNaturalLanguage(input) {
  const parsed = useMemo(() => parseNaturalLanguage(input), [input]);

  return {
    ...parsed,

    hasPreview: parsed.hasAnyMatch,
  };
}
