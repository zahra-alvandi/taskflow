import { useCallback, useEffect, useRef, useState } from "react";

export function useNotifications(tasks) {
  const [permission, setPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "default",
  );
  const notifiedRef = useRef(new Set());

  const requestPermission = useCallback(async () => {
    if (typeof Notification === "undefined") return "denied";
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const send = useCallback((title, options = {}) => {
    if (typeof Notification === "undefined") return;
    if (Notification.permission !== "granted") return;

    try {
      new Notification(title, {
        icon: "/pwa-192x192.png",
        badge: "/pwa-192x192.png",
        ...options,
      });
    } catch (err) {
      console.warn("Notification failed:", err);
    }
  }, []);

  useEffect(() => {
    if (permission !== "granted") return;

    const checkReminders = () => {
      const now = new Date();

      tasks.forEach((task) => {
        if (task.completed || !task.dueDate || !task.dueTime) return;

        const dueAt = new Date(`${task.dueDate}T${task.dueTime}:00`);
        const diffMinutes = (dueAt - now) / 1000 / 60;

        if (diffMinutes > 0 && diffMinutes <= 15) {
          const key = `${task.id}-15min`;
          if (!notifiedRef.current.has(key)) {
            notifiedRef.current.add(key);
            send(task.title, {
              body: `تا ۱۵ دقیقه‌ی دیگه ددلاین داری`,
              tag: task.id,
            });
          }
        }

        if (diffMinutes <= 0 && diffMinutes > -5) {
          const key = `${task.id}-due`;
          if (!notifiedRef.current.has(key)) {
            notifiedRef.current.add(key);
            send(`⏰ ${task.title}`, {
              body: "وقتشه!",
              tag: task.id,
            });
          }
        }
      });
    };

    checkReminders();
    const interval = setInterval(checkReminders, 60 * 1000);

    return () => clearInterval(interval);
  }, [tasks, permission, send]);

  return {
    permission,
    supported: typeof Notification !== "undefined",
    requestPermission,
    send,
  };
}
