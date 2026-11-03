import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const BACKGROUNDS = [
  {
    id: "default",
    label: "default",
    desktopUrl: null,
    mobileUrl: null,
  },
  {
    id: "toothless",
    label: "Toothless",
    desktopUrl: "/backgrounds/dragon.jpg",
    mobileUrl: "/backgrounds/toothless-mobile.jpg",
  },
  {
    id: "batman",
    label: "Batman",
    desktopUrl: "/backgrounds/batman.jpg",
    mobileUrl: "/backgrounds/batman-mobile.jpg",
  },
  {
    id: "cat",
    label: "Cat",
    desktopUrl: "/backgrounds/cat.jpg",
    mobileUrl: "/backgrounds/cat-mobile.jpg",
  },
  {
    id: "spiderman",
    label: "Spiderman",
    desktopUrl: "/backgrounds/spiderman.jpg",
    mobileUrl: "/backgrounds/spiderman-mobile.jpg",
  },
  {
    id: "bmw",
    label: "BMW",
    desktopUrl: "/backgrounds/bmw.jpg",
    mobileUrl: "/backgrounds/bmw-mobile.jpg",
  },
  {
    id: "code",
    label: "Code",
    desktopUrl: "/backgrounds/code.jpg",
    mobileUrl: "/backgrounds/code-mobile.jpg",
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
