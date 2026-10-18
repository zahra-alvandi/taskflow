import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const BACKGROUNDS = [
  { id: "default", label: "پیش‌فرض", url: null },
  { id: "cat", label: "پیشی", url: "/backgrounds/cat.jpg" },
  { id: "shadow", label: "سایه", url: "/backgrounds/catShadow.jpg" },
  { id: "Jepan", label: "ژاپن", url: "/backgrounds/jepan.jpg" },
  { id: "Lazy Cat", label: "پیشی تنبل", url: "/backgrounds/lazyCat.jpg" },
  { id: "White", label: "پیشی سفید", url: "/backgrounds/white-cat.jpg" },
];

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [background, setBackground] = useState(() => {
    return localStorage.getItem("whiskerly:background") || "default";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("whiskerly:background", background);

    const bg = BACKGROUNDS.find((b) => b.id === background);
    const root = document.documentElement;

    if (bg?.url) {
      root.style.setProperty("--bg-image", `url(${bg.url})`);
      root.classList.add("has-background");
    } else {
      root.style.removeProperty("--bg-image");
      root.classList.remove("has-background");
    }
  }, [background]);

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        setDarkMode,
        background,
        setBackground,
        backgrounds: BACKGROUNDS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
