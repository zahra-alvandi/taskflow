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
      return await Notification.requestPermission();
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

  /**
   * @param {object} task
   * @param {"reminder"|"due"|"overdue"} type
   * @param {(key: string) => string} [t]  translation function
   * @param {{minutesUntil?: number}} [ctx]
   */
  notifyTask(task, type = "reminder", t, ctx = {}) {
    const translate = typeof t === "function" ? t : (k) => k;

    const title = translate(`notif.title.${type}`).replace(
      "{title}",
      task.title,
    );
    let body = translate(`notif.body.${type}`).replace("{title}", task.title);

    if (ctx.minutesUntil != null) {
      body = body.replace("{minutes}", ctx.minutesUntil);
    }

    return this.send(title, { body, tag: `task-${task.id}` });
  }
}

export const notificationService = new NotificationService();
