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
      mobileUrl: null,
    },
    {
      id: "shadow",
      label: "سایه",
      desktopUrl: "/backgrounds/catShadow.jpg",
      mobileUrl: null,
    },
    {
      id: "Jepan",
      label: "ژاپن",
      desktopUrl: "/backgrounds/jepan.jpg",
      mobileUrl: null,
    },
    {
      id: "Lazy Cat",
      label: "پیشی تنبل",
      desktopUrl: "/backgrounds/lazyCat.jpg",
      mobileUrl: null,
    },
    {
      id: "White",
      label: "پیشی سفید",
      desktopUrl: "/backgrounds/white-cat.jpg",
      mobileUrl: null,
    },
  ];

  export function ThemeProvider({ children }) {
    const [darkMode, setDarkMode] = useState(() => {
      return localStorage.getItem("theme") === "dark";
    });

    const [background, setBackground] = useState(() => {
      return localStorage.getItem("whiskerly:background") || "default";
    });

    // Apply light/dark theme
    useEffect(() => {
      const root = document.documentElement;

      root.classList.toggle("dark", darkMode);
      localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    // Apply selected background
    useEffect(() => {
      localStorage.setItem("whiskerly:background", background);

      const root = document.documentElement;
      const selectedBackground = BACKGROUNDS.find(
        (item) => item.id === background,
      );

      const desktopUrl = selectedBackground?.desktopUrl;
      const mobileUrl = selectedBackground?.mobileUrl;

      if (desktopUrl) {
        root.style.setProperty("--bg-image", `url("${desktopUrl}")`);

        if (mobileUrl) {
          root.style.setProperty("--bg-image-mobile", `url("${mobileUrl}")`);
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
