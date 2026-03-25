"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  themeMode: ThemeMode;
  isDarkMode: boolean;
  toggleThemeMode: () => void;
};

const APP_THEME_STORAGE_KEY = "app-theme-mode";

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [hasLoadedPreference, setHasLoadedPreference] = useState(false);

  useEffect(() => {
    try {
      const savedThemeMode = window.localStorage.getItem(APP_THEME_STORAGE_KEY);
      if (savedThemeMode === "dark" || savedThemeMode === "light") {
        setThemeMode(savedThemeMode);
      }
    } finally {
      setHasLoadedPreference(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedPreference) {
      return;
    }

    window.localStorage.setItem(APP_THEME_STORAGE_KEY, themeMode);

    const rootElement = document.documentElement;

    rootElement.classList.remove("app-theme-light", "app-theme-dark");

    const themeClassName = themeMode === "dark" ? "app-theme-dark" : "app-theme-light";
    rootElement.classList.add(themeClassName);
  }, [hasLoadedPreference, themeMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      themeMode,
      isDarkMode: themeMode === "dark",
      toggleThemeMode: () => setThemeMode((currentMode) => (currentMode === "dark" ? "light" : "dark")),
    }),
    [themeMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme deve ser usado dentro de ThemeProvider.");
  }

  return context;
}
