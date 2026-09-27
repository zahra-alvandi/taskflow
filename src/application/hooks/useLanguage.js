import { useEffect, useState } from "react";
import { getLang, setLang } from "../../i18n";

export function useLanguage() {
  const [lang, setLangState] = useState(getLang());

  useEffect(() => {
    const handler = (e) => setLangState(e.detail);
    window.addEventListener("langchange", handler);

    setLang(lang);
    return () => window.removeEventListener("langchange", handler);
  }, []); // eslint-disable-line

  const changeLang = (next) => {
    setLang(next);
  };

  return { lang, changeLang };
}
