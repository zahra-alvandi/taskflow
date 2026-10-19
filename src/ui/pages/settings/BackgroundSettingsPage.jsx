import { useContext, useState } from "react";
import { Check, Monitor, Smartphone } from "lucide-react";
import { ThemeContext, BACKGROUNDS } from "../../context/ThemeContext";
import { useTranslation } from "../../../application/hooks/useTranslation";
import SettingsHeader from "./SettingsHeader";

function BackgroundSettingsPage({ onBack }) {
  const { t } = useTranslation();
  const { background, setBackground } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("desktop");

  return (
    <main className="flex-1 min-w-0 w-full h-full overflow-y-auto pb-32 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6 md:p-8">
        <SettingsHeader
          title={t("settings.background")}
          description={t("settings.backgroundHint")}
          onBack={onBack}
        />

        {/* Tab Switcher */}
        <div className="flex gap-2 p-1 mb-6 rounded-2xl bg-[var(--app-bg)] shadow-[var(--shadow-inset)]">
          <button
            onClick={() => setActiveTab("desktop")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === "desktop"
                ? "bg-[var(--surface)] text-[var(--primary)] shadow-[var(--shadow-soft-small)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Monitor size={16} />
            {t("settings.desktop")}
          </button>
          <button
            onClick={() => setActiveTab("mobile")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === "mobile"
                ? "bg-[var(--surface)] text-[var(--primary)] shadow-[var(--shadow-soft-small)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Smartphone size={16} />
            {t("settings.mobile")}
          </button>
        </div>

        {/* Content based on tab */}
        {activeTab === "desktop" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {BACKGROUNDS.map((bg) => {
              const isActive = background === bg.id;
              return (
                <button
                  key={bg.id}
                  onClick={() => setBackground(bg.id)}
                  className={`group relative overflow-hidden rounded-2xl transition-all active:scale-95 bg-[var(--app-bg)] ${
                    isActive
                      ? "ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--app-bg)]"
                      : "hover:ring-2 hover:ring-[var(--primary)]/30 hover:ring-offset-2"
                  }`}
                  style={{ height: "120px" }} 
                >
                  {bg.desktopUrl ? (
                    <img
                      src={bg.desktopUrl}
                      alt={bg.label}
                      className="absolute inset-0 w-full h-full object-cover z-10"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center z-10">
                      <div className="w-8 h-8 rounded-lg bg-[var(--surface)] shadow-[var(--shadow-soft-small)]" />
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-6 z-20">
                    <p className="text-xs font-medium text-white text-center truncate">
                      {bg.label}
                    </p>
                  </div>

                  {isActive && (
                    <div className="absolute top-2 end-2 w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-lg z-30">
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
            {BACKGROUNDS.map((bg) => {
              const isActive = background === bg.id;
              return (
                <button
                  key={bg.id}
                  onClick={() => setBackground(bg.id)}
                  className={`group relative overflow-hidden rounded-xl transition-all active:scale-95 bg-[var(--app-bg)] ${
                    isActive
                      ? "ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--app-bg)]"
                      : "hover:ring-2 hover:ring-[var(--primary)]/30 hover:ring-offset-2"
                  }`}
                  style={{ height: "180px" }} // 👈 ارتفاع ثابت برای موبایل
                >
                  {bg.mobileUrl ? (
                    <img
                      src={bg.mobileUrl}
                      alt={bg.label}
                      className="absolute inset-0 w-full h-full object-cover z-10"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-1 z-10">
                      <div className="w-6 h-6 rounded-lg bg-[var(--surface)] shadow-[var(--shadow-soft-small)] mb-1" />
                      <span className="text-[8px] text-[var(--text-muted)] text-center leading-tight">
                        {t("settings.noMobileImage")}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-1 pt-4 z-20">
                    <p className="text-[9px] font-medium text-white text-center truncate">
                      {bg.label}
                    </p>
                  </div>

                  {isActive && (
                    <div className="absolute top-1 end-1 w-4 h-4 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-md z-30">
                      <Check size={10} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default BackgroundSettingsPage;
