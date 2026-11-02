import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "../../application/hooks/useOnlineStatus";
import { useTranslation } from "../../application/hooks/useTranslation";

function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const { t } = useTranslation();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-0 inset-x-0 z-[200] bg-[var(--warning)] text-[var(--on-solid)] px-4 py-2.5 flex items-center justify-center gap-2 shadow-lg animate-fade-slide-sm"
    >
      <WifiOff size={16} />
      <span className="text-sm font-medium">{t("offline.banner")}</span>
    </div>
  );
}

export default OfflineBanner;
