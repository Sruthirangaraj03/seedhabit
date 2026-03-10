import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggleTheme: () => {},
});

const DARK_BG_PATTERNS = [
  "rgba(15, 23, 42",
  "rgba(5, 10, 25",
  "rgba(10, 22, 40",
  "rgba(6, 14, 26",
  "rgb(5, 10, 25",
  "rgb(6, 14, 26",
  "rgb(10, 22, 40",
  "#050a15",
  "#060e1a",
  "#0a0e1a",
  "#0a1628",
  "#0f172a",
  "rgb(10, 14, 26",
  "rgba(10, 14, 26",
];

function isDarkBg(bg: string): boolean {
  return DARK_BG_PATTERNS.some((p) => bg.includes(p));
}

// Store original inline styles so we can restore them
const originalStyles = new Map<HTMLElement, { bg: string; borderColor: string; boxShadow: string; color: string; fill: string }>();

function fixAllElements() {
  document.querySelectorAll<HTMLElement>("[style]").forEach((el) => {
    const bg = el.style.background || el.style.backgroundColor;
    const fill = el.style.getPropertyValue("-webkit-text-fill-color");
    const color = el.style.color;

    const needsBgFix = bg && isDarkBg(bg);
    const needsFillFix = fill === "transparent";
    const needsColorFix = color === "#fff" || color === "rgb(255, 255, 255)" || color === "white";
    const needsCyanFix = color && (color.includes("0, 212, 255") || color === "#00d4ff" || (color.startsWith("#00d4ff") && color.length > 7));

    if (!needsBgFix && !needsFillFix && !needsColorFix && !needsCyanFix) return;

    // Save originals before mutating
    if (!originalStyles.has(el)) {
      originalStyles.set(el, {
        bg: el.style.background || el.style.backgroundColor,
        borderColor: el.style.borderColor,
        boxShadow: el.style.boxShadow,
        color: el.style.color,
        fill: fill,
      });
    }

    if (needsBgFix) {
      el.style.background = "rgba(255, 255, 255, 0.95)";
      el.style.borderColor = "rgba(59, 130, 246, 0.15)";
      el.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.06)";
    }

    if (needsFillFix) {
      el.style.setProperty("-webkit-text-fill-color", "#1e3a5f");
      el.style.background = "none";
      el.style.color = "#1e3a5f";
    }

    if (needsColorFix) {
      el.style.color = "#0f172a";
    }

    if (needsCyanFix) {
      el.style.color = "#1e3a5f";
    }
  });
}

function restoreAllElements() {
  originalStyles.forEach((orig, el) => {
    if (!document.contains(el)) return;
    el.style.background = orig.bg;
    el.style.borderColor = orig.borderColor;
    el.style.boxShadow = orig.boxShadow;
    el.style.color = orig.color;
    if (orig.fill) {
      el.style.setProperty("-webkit-text-fill-color", orig.fill);
    }
  });
  originalStyles.clear();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("hunterhabit_theme");
    return stored === "light" ? "light" : "dark";
  });
  const isFirstRender = useRef(true);

  useEffect(() => {
    localStorage.setItem("hunterhabit_theme", theme);
    const root = document.documentElement;

    if (theme === "light") {
      if (!isFirstRender.current) {
        root.style.transition = "none";
        root.style.opacity = "0";
      }

      root.classList.add("light-theme");

      requestAnimationFrame(() => {
        fixAllElements();
        requestAnimationFrame(() => {
          root.style.transition = "opacity 0.15s ease";
          root.style.opacity = "1";
        });
      });
    } else {
      if (!isFirstRender.current) {
        root.style.transition = "none";
        root.style.opacity = "0";
      }

      root.classList.remove("light-theme");
      restoreAllElements();

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          root.style.transition = "opacity 0.15s ease";
          root.style.opacity = "1";
        });
      });
    }

    isFirstRender.current = false;
  }, [theme]);

  // Watch for dynamically added elements in light mode
  useEffect(() => {
    if (theme !== "light") return;

    let raf: number;
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(fixAllElements);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme((prev) => (prev === "dark" ? "light" : "dark")), []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
