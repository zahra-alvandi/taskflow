import { useCallback, useEffect, useRef, useState } from "react";
import { notificationService } from "../../infrastructure/notifications/NotificationService";
import { useTranslation } from "./useTranslation";

const REMINDER_MINUTES = 15;
const DUE_WINDOW_MINUTES = 180;

export function useNotifications(tasks) {
  const { t } = useTranslation();
  const [permission, setPermission] = useState(notificationService.permission);
  const [enabled, setEnabled] = useState(
    () => localStorage.getItem("whiskerly:notif-enabled") === "true",
  );
  const notifiedRef = useRef(new Set());

  useEffect(() => {
    const sync = () => setPermission(notificationService.permission);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("focus", sync);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  const requestPermission = useCallback(async () => {
    const result = await notificationService.requestPermission();
    setPermission(result);
    if (result === "granted") {
      setEnabled(true);
      localStorage.setItem("whiskerly:notif-enabled", "true");
    }
    return result;
  }, []);

  const toggleEnabled = useCallback(
    (value) => {
      const next = value ?? !enabled;
      setEnabled(next);
      localStorage.setItem("whiskerly:notif-enabled", String(next));
    },
    [enabled],
  );

  const send = useCallback(async (title, options) => {
    return notificationService.send(title, options);
  }, []);

  useEffect(() => {
    if (!enabled || permission !== "granted") return;

    const checkReminders = () => {
      const now = new Date();

      tasks.forEach((task) => {
        if (task.completed) return;
        if (!task.dueDate || !task.dueTime) return;

        const dueAt = new Date(`${task.dueDate}T${task.dueTime}:00`);
        const diffMin = (dueAt - now) / 60_000;

        if (diffMin > 0 && diffMin <= REMINDER_MINUTES) {
          const key = `${task.id}-reminder`;
          if (!notifiedRef.current.has(key)) {
            notifiedRef.current.add(key);
            notificationService.notifyTask(task, "reminder", t, {
              minutesUntil: Math.max(1, Math.round(diffMin)),
            });
          }
          return;
        }

        if (diffMin <= -30) {
          // Mutual exclusion: pick exactly one type based on age.
          const type = diffMin <= -DUE_WINDOW_MINUTES ? "overdue" : "due";
          const key = `${task.id}-${type}`;
          if (!notifiedRef.current.has(key)) {
            notifiedRef.current.add(key);
            notificationService.notifyTask(task, type, t);
          }
        }
      });
    };

    checkReminders();
    const interval = setInterval(checkReminders, 30 * 1000);
    return () => clearInterval(interval);
  }, [tasks, enabled, permission, t]);

  return {
    permission,
    enabled,
    supported: notificationService.isSupported,
    isGranted: permission === "granted",
    requestPermission,
    toggleEnabled,
    send,
  };
}
