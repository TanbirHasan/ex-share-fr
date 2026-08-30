"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "system";
export const THEME_STORAGE_KEY = "eh-theme";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
});

function systemPrefersDark() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

function apply(theme: Theme): "light" | "dark" {
  const dark = theme === "dark" || (theme === "system" && systemPrefersDark());
  const el = document.documentElement;
  el.classList.toggle("dark", dark);
  el.style.colorScheme = dark ? "dark" : "light";
  return dark ? "dark" : "light";
}

function readStored(): Theme {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    // ignore
  }
  return "system";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Hydrate from storage on mount (the inline <ThemeScript> already set the class).
  useEffect(() => {
    const stored = readStored();
    setThemeState(stored);
    setResolvedTheme(apply(stored));
  }, []);

  // React to OS changes (while on "system") and other tabs.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onMedia = () => {
      if (readStored() === "system") setResolvedTheme(apply("system"));
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key !== THEME_STORAGE_KEY) return;
      const next = readStored();
      setThemeState(next);
      setResolvedTheme(apply(next));
    };
    mq.addEventListener("change", onMedia);
    window.addEventListener("storage", onStorage);
    return () => {
      mq.removeEventListener("change", onMedia);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setTheme = useCallback((next: Theme) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // ignore
    }
    setThemeState(next);
    setResolvedTheme(apply(next));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
