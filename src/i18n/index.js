import fa from "./fa";
import en from "./en";

const dictionaries = { fa, en };

const LANG_KEY = "whiskerly:lang";
let currentLang = "fa";
try {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved && dictionaries[saved]) currentLang = saved;
} catch {}

export function setLang(lang) {
  if (!dictionaries[lang]) return;
  currentLang = lang;
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {}
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

if (typeof document !== "undefined") {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "fa" ? "rtl" : "ltr";
}
