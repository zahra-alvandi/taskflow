import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "../../application/hooks/useOnlineStatus";

function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-[200] bg-[var(--warning)] text-white px-4 py-2.5 flex items-center justify-center gap-2 shadow-lg animate-fade-slide-sm">
      <WifiOff size={16} />
      <span className="text-sm font-medium">
        حالت آفلاین — تغییرات ذخیره می‌شن و بعداً sync می‌شن
      </span>
    </div>
  );
}

export default OfflineBanner;
