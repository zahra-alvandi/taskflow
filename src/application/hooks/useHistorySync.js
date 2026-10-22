import { useEffect, useRef } from "react";

export function useHistorySync(page, setPage) {
  const fromPopState = useRef(false);
  const initialized = useRef(false);

  useEffect(() => {
    const onPop = (event) => {
      fromPopState.current = true;
      setPage(event.state?.page ?? "dashboard");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [setPage]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      window.history.replaceState({ page }, "");
      return;
    }
    if (fromPopState.current) {
      fromPopState.current = false;
      return;
    }
    if (window.history.state?.page !== page) {
      window.history.pushState({ page }, "");
    }
  }, [page]);
}
