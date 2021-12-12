import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
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
    font-size: 1.2rem;
  }
`;
