import { createContext } from "react";

export type Theme = "light" | "dark";

export const DEFAULT_THEME: Theme = "light";

interface Props {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<Props>({
  theme: DEFAULT_THEME,
  setTheme: (theme: Theme): void => {},
});
