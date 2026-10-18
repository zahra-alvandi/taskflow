import { useEffect } from "react";

/**
 * @param {string} page
 * @param {Function} setPage
 * @param {string|null} section
 * @param {Function|null} setSection
 */
export function useHistorySync(
  page,
  setPage,
  section = null,
  setSection = null,
) {
  useEffect(() => {
    window.history.pushState({ page, section }, "", "");

    const handlePopState = (event) => {
      const state = event.state;

      if (state) {
        if (state.page && state.page !== page) {
          setPage(state.page);
        }

        if (setSection && state.section !== section) {
          setSection(state.section ?? null);
        }
      } else {
        setPage("dashboard");
        if (setSection) setSection(null);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [page, section, setPage, setSection]);
}
