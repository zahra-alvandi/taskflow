import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const BACKGROUNDS = [
  {
    id: "default",
    label: "پیش‌فرض",
    desktopUrl: null,
    mobileUrl: null,
  },
  {
    id: "cat",
    label: "پیشی",
    desktopUrl: "/backgrounds/cat.jpg",
    mobileUrl: "/backgrounds/shelfCat-mobile.jpg",
  },
  {
    id: "shadow",
    label: "سایه",
    desktopUrl: "/backgrounds/catShadow.jpg",
    mobileUrl: "/backgrounds/catTail-mobile.jpg",
  },
  {
    id: "rainy",
    label: "بارونی",
    desktopUrl: "/backgrounds/jepan.jpg",
    mobileUrl: "/backgrounds/rainCat-mobile.jpg",
  },
  {
    id: "lazycat",
    label: "پیشی تنبل",
    desktopUrl: "/backgrounds/lazyCat.jpg",
    mobileUrl: "/backgrounds/nightCat-mobile.jpg",
  },
  {
    id: "white",
    label: "پیشی سفید",
    desktopUrl: "/backgrounds/catt.jpg",
    mobileUrl: "/backgrounds/white-cat-mobile.jpg",
  },
  {
    id: "star",
    label: "پیشی و ستاره",
    desktopUrl: "/backgrounds/catt.jpg",
    mobileUrl: "/backgrounds/starCat-mobile.jpg",
  },
];

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [background, setBackground] = useState(() => {
    return localStorage.getItem("whiskerly:background") || "default";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("whiskerly:background", background);

    const root = document.documentElement;
    const selectedBg = BACKGROUNDS.find((item) => item.id === background);

    if (selectedBg && (selectedBg.desktopUrl || selectedBg.mobileUrl)) {
      if (selectedBg.desktopUrl) {
        root.style.setProperty("--bg-image", `url("${selectedBg.desktopUrl}")`);
      }

      if (selectedBg.mobileUrl) {
        root.style.setProperty(
          "--bg-image-mobile",
          `url("${selectedBg.mobileUrl}")`,
        );
      } else {
        root.style.removeProperty("--bg-image-mobile");
      }

      root.classList.add("has-background");
    } else {
      root.style.removeProperty("--bg-image");
      root.style.removeProperty("--bg-image-mobile");
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
