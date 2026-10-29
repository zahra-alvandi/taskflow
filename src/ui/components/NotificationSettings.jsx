import { useState } from "react";
import { Bell, Check, AlertCircle, Info } from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";
import { notificationService } from "../../infrastructure/notifications/NotificationService";

function NotificationSettings({ notif }) {
  const { t } = useTranslation();
  const [testSent, setTestSent] = useState(false);

  const isGranted = notif.isGranted;
  const isDenied = notif.permission === "denied";
  const isUnsupported = !notif.supported;

  const handleEnable = async () => {
    await notif.requestPermission();
  };

  const handleTest = () => {
    console.log("🧪 Test clicked");

    const result = notificationService.send("Whiskerly 🐱", {
      body: t("notif.testBody"),
      tag: "test-" + Date.now(),
    });

    console.log("🧪 Result:", result);

    if (result) {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    }
  };

  return (
    <section className="bg-[var(--surface)] rounded-3xl p-5 mt-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--primary-soft)] flex items-center justify-center">
            <Bell size={20} className="text-[var(--primary)]" />
          </div>
          <div>
            <h2 className="font-semibold text-[var(--text-primary)]">
              {t("notif.settingsTitle")}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {t("notif.settingsSubtitle")}
            </p>
          </div>
        </div>

        {isGranted && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[var(--success-soft)] text-[var(--success)]">
            <Check size={11} strokeWidth={3} />
            {t("notif.on")}
          </span>
        )}
      </div>

      {isUnsupported && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--warning-soft)]">
          <AlertCircle
            size={16}
            className="text-[var(--warning)] shrink-0 mt-0.5"
          />
          <p className="text-xs text-[var(--warning)]">
            {t("notif.unsupported")}
          </p>
        </div>
      )}

      {isDenied && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--danger-soft)]">
          <AlertCircle
            size={16}
            className="text-[var(--danger)] shrink-0 mt-0.5"
          />
          <div>
            <p className="text-xs font-medium text-[var(--danger)]">
              {t("notif.deniedTitle")}
            </p>
            <p className="text-[11px] text-[var(--danger)]/80 mt-1">
              {t("notif.deniedDesc")}
            </p>
          </div>
        </div>
      )}

      {!isUnsupported && !isGranted && !isDenied && (
        <button
          onClick={handleEnable}
          className="w-full py-3 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-[var(--on-solid)] font-medium flex items-center justify-center gap-2 shadow-[0_6px_14px_rgb(var(--primary-rgb)/0.3)] transition"
        >
          <Bell size={18} />
          {t("notif.enable")}
        </button>
      )}

      {isGranted && (
        <>
          <div className="flex items-center justify-between gap-4 py-3 border-t border-[var(--border)]/40">
            <div>
              <p className="font-medium text-sm text-[var(--text-primary)]">
                {t("notif.enabledLabel")}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {notif.enabled ? t("notif.onDesc") : t("notif.offDesc")}
              </p>
            </div>
            <button
              onClick={() => notif.toggleEnabled()}
              className={`relative w-12 h-7 rounded-full transition shrink-0 ${
                notif.enabled ? "bg-[var(--primary)]" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  notif.enabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="pt-3 border-t border-[var(--border)]/40">
            <button
              onClick={handleTest}
              disabled={!notif.enabled}
              className={`w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition ${
                testSent
                  ? "bg-[var(--success)] text-[var(--on-solid)]"
                  : "bg-[var(--app-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-[var(--shadow-inset)] disabled:opacity-40"
              }`}
            >
              {testSent ? (
                <>
                  <Check size={14} strokeWidth={3} />
                  {t("notif.testSent")}
                </>
              ) : (
                t("notif.test")
              )}
            </button>
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[var(--app-bg)] mt-3">
            <Info
              size={13}
              className="text-[var(--text-muted)] shrink-0 mt-0.5"
            />
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              {t("notif.iosHint")}
            </p>
          </div>
        </>
      )}
    </section>
  );
}

export default NotificationSettings;
