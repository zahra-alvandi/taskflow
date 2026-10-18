import { useTranslation } from "../../../application/hooks/useTranslation";
import NotificationSettings from "../../../ui/components/NotificationSettings";
import SettingsHeader from "./SettingsHeader";

function NotificationSettingsPage({ notif, onBack }) {
  const { t } = useTranslation();

  return (
    <main className="flex-1 min-w-0 w-full h-full overflow-y-auto pb-32 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6 md:p-8">
        <SettingsHeader
          title={t("notif.settingsTitle")}
          description={t("notif.settingsSubtitle")}
          onBack={onBack}
        />

        <NotificationSettings notif={notif} />
      </div>
    </main>
  );
}

export default NotificationSettingsPage;
