export class NotificationService {
  constructor() {
    this.swRegistration = null;
    this._initPromise = null;
  }

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

  async _getSWRegistration() {
    if (!("serviceWorker" in navigator)) return null;
    if (this.swRegistration) return this.swRegistration;
    if (this._initPromise) return this._initPromise;

    this._initPromise = (async () => {
      try {
        const reg = await navigator.serviceWorker.ready;
        this.swRegistration = reg;
        return reg;
      } catch (err) {
        console.warn("Service Worker not ready:", err);
        return null;
      }
    })();

    return this._initPromise;
  }

  /**
 
   * @param {string} title
   * @param {Object} options - { body, icon, tag, data, vibrate, requireInteraction, actions }
   */
  async send(title, options = {}) {
    if (!this.isGranted) {
      console.warn("Notification not granted");
      return false;
    }

    const defaultOptions = {
      icon: "/favicon/logo-icon.png",
      badge: "/favicon/logo-icon.png",
      dir: "auto",
      lang: "fa",
      ...options,
    };

    const reg = await this._getSWRegistration();
    if (reg) {
      try {
        await reg.showNotification(title, defaultOptions);
        return true;
      } catch (err) {
        console.warn("SW notification failed, falling back:", err);
      }
    }

    try {
      new Notification(title, defaultOptions);
      return true;
    } catch (err) {
      console.error("Notification failed:", err);
      return false;
    }
  }

  async notifyTask(task, type = "reminder") {
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
      renotify: true,
      data: { taskId: task.id, type },
      requireInteraction: type === "due" || type === "overdue",
      vibrate: [200, 100, 200],
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

  async clearTaskNotifications(taskId) {
    const reg = await this._getSWRegistration();
    if (!reg) return;
    try {
      const notifications = await reg.getNotifications({
        tag: `task-${taskId}`,
      });
      notifications.forEach((n) => n.close());
    } catch {}
  }
}

export const notificationService = new NotificationService();
