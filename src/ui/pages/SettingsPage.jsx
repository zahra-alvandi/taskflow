import { useState, useEffect } from "react";
import {
  Palette,
  Image,
  Globe,
  Bell,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "../../application/hooks/useTranslation";
import AppearanceSettingsPage from "./settings/AppearanceSettingsPage";
import BackgroundSettingsPage from "./settings/BackgroundSettingsPage";
import LanguageSettingsPage from "./settings/LanguageSettingsPage";
import NotificationSettingsPage from "./settings/NotificationSettingsPage";
import AISettingsPage from "./settings/AISettingsPage";

function SettingsPage({ lang, onChangeLang, notif }) {
  const { t } = useTranslation();
  const [section, setSection] = useState(null);

  useEffect(() => {
    if (section) {
      window.history.pushState({ page: "settings", section }, "", "");
    }
  }, [section]);

  useEffect(() => {
    const handlePopState = (event) => {
      const state = event.state;
      if (state?.page === "settings") {
        setSection(state.section ?? null);
      } else {
        setSection(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleBack = () => {
    window.history.back();
  };

  const sections = [
    {
      id: "appearance",
      title: t("settings.appearance"),
      description: t("settings.appearanceDesc"),
      icon: <Palette size={20} />,
      color: "primary",
    },
    {
      id: "background",
      title: t("settings.background"),
      description: t("settings.backgroundDesc"),
      icon: <Image size={20} />,
      color: "accent",
    },
    {
      id: "language",
      title: t("settings.language"),
      description: t("settings.languageDesc"),
      icon: <Globe size={20} />,
      color: "success",
    },
    {
      id: "notifications",
      title: t("notif.settingsTitle"),
      description: t("notif.settingsSubtitle"),
      icon: <Bell size={20} />,
      color: "warning",
    },
    {
      id: "ai",
      title: t("ai.title"),
      description: t("ai.subtitle"),
      icon: <Sparkles size={20} />,
      color: "primary",
    },
  ];

  const colorStyles = {
    primary: "bg-[var(--primary-soft)] text-[var(--primary)]",
    accent: "bg-[var(--accent-soft)] text-[var(--accent)]",
    success: "bg-[var(--success-soft)] text-[var(--success)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
  };

  //  Sub-pages
  if (section) {
    return (
      <div key={section} className="flex-1 flex flex-col h-full animate-page">
        {section === "appearance" && (
          <AppearanceSettingsPage onBack={handleBack} />
        )}
        {section === "background" && (
          <BackgroundSettingsPage onBack={handleBack} />
        )}
        {section === "language" && (
          <LanguageSettingsPage
            lang={lang}
            onChangeLang={onChangeLang}
            onBack={handleBack}
          />
        )}
        {section === "notifications" && (
          <NotificationSettingsPage notif={notif} onBack={handleBack} />
        )}
        {section === "ai" && <AISettingsPage onBack={handleBack} />}
      </div>
    );
  }

  // ── Hub ──
  return (
    <div key="hub" className="flex-1 flex flex-col h-full animate-page">
      <main className="flex-1 min-w-0 w-full h-full overflow-y-auto pb-32 md:pb-8">
        <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6 md:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            {t("settings.title")}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            {t("settings.subtitle")}
          </p>

          <div className="mt-8 space-y-2">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className="group w-full flex items-center gap-4 p-4 rounded-2xl bg-[var(--surface)] shadow-[var(--shadow-soft-small)] hover:shadow-[var(--shadow-soft)] hover:-translate-y-0.5 active:scale-[0.98] transition-all"
              >
                <div
                  className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center ${colorStyles[s.color]}`}
                >
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0 text-start">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {s.title}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {s.description}
                  </p>
                </div>
                <ChevronRight
                  size={18}
                  className="text-[var(--text-muted)] group-hover:text-[var(--primary)] rtl:rotate-180 transition shrink-0"
                />
              </button>
            ))}
          </div>

          <p className="text-xs text-[var(--text-muted)] text-center mt-8">
            {t("app.name")} · v0.0.0
          </p>
        </div>
      </main>
    </div>
  );
}

export default SettingsPage;
