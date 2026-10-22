import { useCallback, useEffect, useRef, useState } from "react";
import { notificationService } from "../../infrastructure/notifications/NotificationService";

const REMINDER_MINUTES = 15;

export function useNotifications(tasks) {
  const [permission, setPermission] = useState(notificationService.permission);
  const [enabled, setEnabled] = useState(
    () => localStorage.getItem("whiskerly:notif-enabled") === "true",
  );
  const notifiedRef = useRef(new Set());

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

  // Check deadlines
  useEffect(() => {
    if (!enabled || permission !== "granted") return;

    const checkReminders = () => {
      const now = new Date();

      tasks.forEach((task) => {
        if (task.completed) return;
        if (!task.dueDate || !task.dueTime) return;

        const dueAt = new Date(`${task.dueDate}T${task.dueTime}:00`);
        const diffMin = (dueAt - now) / 1000 / 60;

        if (diffMin > 0 && diffMin <= REMINDER_MINUTES) {
          const key = `${task.id}-reminder`;
          if (!notifiedRef.current.has(key)) {
            notifiedRef.current.add(key);
            notificationService.notifyTask(task, "reminder");
          }
        }

        if (diffMin <= -30 && diffMin > -180) {
          const key = `${task.id}-due`;
          if (!notifiedRef.current.has(key)) {
            notifiedRef.current.add(key);
            notificationService.notifyTask(task, "due");
          }
        }

        if (diffMin <= -30) {
          const key = `${task.id}-overdue`;
          if (!notifiedRef.current.has(key)) {
            notifiedRef.current.add(key);
            notificationService.notifyTask(task, "overdue");
          }
        }
      });
    };

    checkReminders();
    const interval = setInterval(checkReminders, 30 * 1000);
    return () => clearInterval(interval);
  }, [tasks, enabled, permission]);

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
