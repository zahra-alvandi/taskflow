import { useCallback, useEffect, useRef, useState } from "react";
import { notificationService } from "../../infrastructure/notification/NotificationService";

const REMINDER_MINUTES = 15;

export function useNotifications(tasks) {
  const [permission, setPermission] = useState(notificationService.permission);
  const [enabled, setEnabled] = useState(
    () => localStorage.getItem("whiskerly:notif-enabled") === "true",
  );
  const notifiedRef = useRef(new Set());

  // Sync permission state
  useEffect(() => {
    const interval = setInterval(() => {
      if (notificationService.permission !== permission) {
        setPermission(notificationService.permission);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [permission]);

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

  const notifyTask = useCallback(async (task, type) => {
    return notificationService.notifyTask(task, type);
  }, []);

  useEffect(() => {
    if (!enabled || permission !== "granted") return;

    const checkReminders = () => {
      const now = new Date();

      tasks.forEach((task) => {
        if (task.completed) return;

        if (!task.dueDate || !task.dueTime) {
          if (task.dueDate) {
            const due = new Date(task.dueDate);
            due.setHours(0, 0, 0, 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (due.getTime() === today.getTime()) {
              const key = `${task.id}-today`;
              if (!notifiedRef.current.has(key)) {
                const nowHour = now.getHours();

                if (nowHour >= 7 && nowHour <= 10) {
                  notifiedRef.current.add(key);
                  notificationService.notifyTask(task, "reminder");
                }
              }
            }
          }
          return;
        }

        const dueAt = new Date(`${task.dueDate}T${task.dueTime}:00`);
        const diffMin = (dueAt - now) / 1000 / 60;

        if (diffMin > 0 && diffMin <= REMINDER_MINUTES) {
          const key = `${task.id}-reminder`;
          if (!notifiedRef.current.has(key)) {
            notifiedRef.current.add(key);
            notificationService.notifyTask(task, "reminder");
          }
        }

        if (diffMin <= 0 && diffMin > -5) {
          const key = `${task.id}-due`;
          if (!notifiedRef.current.has(key)) {
            notifiedRef.current.add(key);
            notificationService.notifyTask(task, "due");
          }
        }

        if (diffMin <= -5 && diffMin > -60) {
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

  useEffect(() => {
    const taskIds = new Set(tasks.map((t) => t.id));
    notifiedRef.current.forEach((key) => {
      const taskId = key.split("-")[0];
      if (!taskIds.has(taskId)) {
        notifiedRef.current.delete(key);
      }
    });
  }, [tasks]);

  return {
    permission,
    enabled,
    supported: notificationService.isSupported,
    isGranted: permission === "granted",
    requestPermission,
    toggleEnabled,
    send,
    notifyTask,
  };
}
