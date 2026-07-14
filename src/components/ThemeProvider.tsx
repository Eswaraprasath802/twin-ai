"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

export type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

const THEME_STORAGE_KEY = "twin-ai-theme";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const listeners = new Set<() => void>();

let currentTheme: ThemeMode = "light";

function readSystemTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
  } catch {
    // Ignore storage failures and fall back to the system preference.
  }

  return readSystemTheme();
}

function resolveThemeSnapshot(): ThemeMode {
  if (typeof document !== "undefined") {
    const theme = document.documentElement.dataset.theme;
    if (theme === "light" || theme === "dark") {
      currentTheme = theme;
      return currentTheme;
    }
  }

  currentTheme = readStoredTheme();
  return currentTheme;
}

function applyTheme(theme: ThemeMode) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore persistence failures.
  }
}

function setTheme(theme: ThemeMode) {
  currentTheme = theme;
  applyTheme(theme);
  listeners.forEach(listener => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return resolveThemeSnapshot();
}

function getServerSnapshot() {
  return "light" as ThemeMode;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
