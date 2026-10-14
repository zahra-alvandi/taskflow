import { useToast } from "../../application/hooks/useToast";
import Toast from "./Toast";

function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-24 md:bottom-8 z-[400] inset-x-0 md:inset-x-auto md:start-8 flex flex-col-reverse items-center md:items-start gap-3 sm:gap-4 px-4 md:px-0 pointer-events-none">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onDismiss={() => dismissToast(toast.id)}
        />
      ))}
    </div>
  );
}

export default ToastContainer;
