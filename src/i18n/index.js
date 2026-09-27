import fa from "./fa";
import en from "./en";

const dictionaries = { fa, en };

let currentLang = "fa"; 

export function setLang(lang) {
  if (!dictionaries[lang]) return;
  currentLang = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
  window.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
}

export function getLang() {
  return currentLang;
}

export function t(path) {
  const keys = path.split(".");
  let value = dictionaries[currentLang];

  for (const key of keys) {
    if (value == null) return path;
    value = value[key];
  }

  return value ?? path;
}

export function isRTL() {
  return currentLang === "fa";
}
