import { useState, useEffect } from "react";
import { Check, Save } from "lucide-react";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { useAISettings } from "../../../application/hooks/useAISettings";
import AISettingsContent from "../../components/AISettingsContent";
import SettingsHeader from "./SettingsHeader";

function AISettingsPage({ onBack }) {
  const { t } = useTranslation();
  const { settings, updateSettings, clearSettings } = useAISettings();

  const [draftSettings, setDraftSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  // Detect changes
  useEffect(() => {
    const changed = JSON.stringify(draftSettings) !== JSON.stringify(settings);
    setHasChanges(changed);
  }, [draftSettings, settings]);

  const handleSave = () => {
    updateSettings(draftSettings);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  const handleBack = () => {
    if (hasChanges) {
      const confirmLeave = confirm(
        t("settings.unsavedChanges") || "تغییرات ذخیره نشده. خارج بشم؟",
      );
      if (!confirmLeave) return;
    }
    onBack();
  };

  return (
    <main className="flex-1 min-w-0 w-full h-full overflow-y-auto pb-32 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6 md:p-8">
        <SettingsHeader
          title={t("ai.title")}
          description={t("ai.subtitle")}
          onBack={handleBack}
          action={
            hasChanges && (
              <button
                onClick={handleSave}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  savedFlash
                    ? "bg-[var(--success)] text-[var(--on-solid)]"
                    : "bg-[var(--primary)] text-[var(--on-solid)] shadow-[0_4px_10px_rgb(var(--primary-rgb)/0.3)] hover:bg-[var(--primary-hover)]"
                }`}
              >
                {savedFlash ? (
                  <>
                    <Check size={13} strokeWidth={3} />
                    {t("ai.saved")}
                  </>
                ) : (
                  <>
                    <Save size={13} />
                    {t("actions.save")}
                  </>
                )}
              </button>
            )
          }
        />

        <AISettingsContent
          draft={draftSettings}
          onChange={setDraftSettings}
          onClear={clearSettings}
        />
      </div>
    </main>
  );
}

export default AISettingsPage;
