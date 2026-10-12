/**
 * Notification Service
 */

class NotificationService {
  get isSupported() {
    return typeof window !== "undefined" && "Notification" in window;
  }

  get permission() {
    if (!this.isSupported) return "unsupported";
    return Notification.permission;
  }

  get isGranted() {
    return this.permission === "granted";
  }

  async requestPermission() {
    if (!this.isSupported) return "unsupported";
    try {
      const result = await Notification.requestPermission();
      return result;
    } catch (err) {
      console.error("Failed to request permission:", err);
      return "denied";
    }
  }

  send(title, options = {}) {
    if (!this.isGranted) {
      console.warn("Notification permission not granted");
      return false;
    }

    try {
      new Notification(title, {
        icon: "/favicon/logo-icon.png",
        badge: "/favicon/logo-icon.png",
        ...options,
      });
      return true;
    } catch (err) {
      console.error("Failed to send notification:", err);
      return false;
    }
  }

  notifyTask(task, type = "reminder") {
    const messages = {
      reminder: {
        title: `⏰ ${task.title}`,
        body: this._getReminderBody(task),
      },
      due: {
        title: `🔥 ${task.title}`,
        body: "وقتشه! الان انجامش بده",
      },
      overdue: {
        title: `⚠️ ${task.title}`,
        body: "از ددلاین گذشته!",
      },
    };

    const msg = messages[type] ?? messages.reminder;
    return this.send(msg.title, {
      body: msg.body,
      tag: `task-${task.id}`,
    });
  }

  _getReminderBody(task) {
    if (!task.dueTime) return "ددلاین نزدیکه";
    const [h, m] = task.dueTime.split(":");
    const dueAt = new Date();
    dueAt.setHours(Number(h), Number(m), 0, 0);
    const diffMin = Math.round((dueAt - new Date()) / 1000 / 60);

    if (diffMin <= 1) return "همین الان ددلاین داری";
    if (diffMin < 60) return `تا ${diffMin} دقیقه‌ی دیگه ددلاین داری`;
    const hours = Math.round(diffMin / 60);
    return `تا ${hours} ساعت دیگه ددلاین داری`;
  }
}

export const notificationService = new NotificationService();
