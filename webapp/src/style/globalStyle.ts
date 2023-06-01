import { createGlobalStyle } from "styled-components";

export enum Theme {
  light = "light",
  dark = "dark",
}

interface ThemeColours {
  backgroundColor: string;
}

function getTheme(theme: Theme): ThemeColours {
  switch (theme) {
    case Theme.light:
      return {
        backgroundColor: "#F6F7F9",
      };
    case Theme.dark:
      return {
        backgroundColor: "#404854",
      };

    default:
      throw new Error("Requested theme is not supported");
  }
}

export const activeTheme = Theme.dark;

interface Props {
  theme: Theme;
}
export const GlobalStyle = createGlobalStyle<Props>`
  a {
    color: inherit;
    text-decoration: none;
  }

  ul li {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  ol li {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  html {
    background-color: ${({ theme }) => getTheme(theme).backgroundColor};
    font-size: 1.2rem;
  }
`;
