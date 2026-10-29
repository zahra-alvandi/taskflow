import { useEffect, useRef } from "react";
import { STORAGE_ERROR_EVENT } from "../../infrastructure/storage/LocalStorageAdapter";
import { useToast } from "./useToast";
import { useTranslation } from "./useTranslation";

/**
 * Shows a toast whenever the storage layer reports a problem
 * (failed save, full storage, corrupted or invalid data).
 */
export function useStorageErrors() {
  const { showToast } = useToast();
  const { t } = useTranslation();
  const lastShown = useRef({});

  useEffect(() => {
    const handler = (event) => {
      const code = event.detail?.code ?? "write_failed";

      // avoid spamming the same message
      const now = Date.now();
      if (now - (lastShown.current[code] ?? 0) < 4000) return;
      lastShown.current[code] = now;

      showToast({
        tone: "danger",
        title: t(`storage.${code}`),
        description: t("storage.hint"),
        duration: 9000,
      });
    };

    window.addEventListener(STORAGE_ERROR_EVENT, handler);
    return () => window.removeEventListener(STORAGE_ERROR_EVENT, handler);
  }, [showToast, t]);
}
