import { assertNever } from "../exhaustive-match";
import { ThemeContext } from "../style/ThemeContext";
import { useContext } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);

  function handleClick() {
    switch (theme) {
      case "light":
        return setTheme("dark");
      case "dark":
        return setTheme("light");
      default:
        assertNever(theme, `unsupported theme: ${theme}`);
    }
  }

  return (
    <div className="cursor-pointer hover:text-blue-300" onClick={handleClick}>
      {theme}
    </div>
  );
}
