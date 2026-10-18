import { useContext } from "react";
import { Check } from "lucide-react";
import { ThemeContext, BACKGROUNDS } from "../../context/ThemeContext";
import { useTranslation } from "../../../application/hooks/useTranslation";
import SettingsHeader from "./SettingsHeader";

function BackgroundSettingsPage({ onBack }) {
  const { t } = useTranslation();
  const { background, setBackground } = useContext(ThemeContext);

  return (
    <main className="flex-1 min-w-0 w-full h-full overflow-y-auto pb-32 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6 md:p-8">
        <SettingsHeader
          title={t("settings.background")}
          description={t("settings.backgroundHint")}
          onBack={onBack}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {BACKGROUNDS.map((bg) => {
            const isActive = background === bg.id;
            return (
              <button
                key={bg.id}
                onClick={() => setBackground(bg.id)}
                className={`group relative aspect-[4/3] rounded-2xl overflow-hidden transition-all active:scale-95 ${
                  isActive
                    ? "ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--app-bg)]"
                    : "hover:ring-2 hover:ring-[var(--primary)]/30 hover:ring-offset-2"
                }`}
              >
                {bg.url ? (
                  <img
                    src={bg.url}
                    alt={bg.label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--app-bg)] flex items-center justify-center">
                    <div className="w-8 h-8 rounded-lg bg-[var(--surface)] shadow-[var(--shadow-soft-small)]" />
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-xs font-medium text-white text-center truncate">
                    {bg.label}
                  </p>
                </div>

                {isActive && (
                  <div className="absolute top-2 end-2 w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-lg">
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default BackgroundSettingsPage;
