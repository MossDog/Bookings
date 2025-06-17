const THEME_KEY = "theme-preference";
const storedTheme = localStorage.getItem(THEME_KEY);

export const theme =
  storedTheme === "system" ? "light" : storedTheme || "light";
