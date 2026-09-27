import { useEffect, useState } from "react";
import { t as translate, getLang } from "../../i18n";


export function useTranslation() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const handler = () => setTick((x) => x + 1);
    window.addEventListener("langchange", handler);
    return () => window.removeEventListener("langchange", handler);
  }, []);

  return {
    t: translate,
    lang: getLang(),
  };
}
