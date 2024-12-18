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

  body {
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0;
    text-transform: none;
  }
`;
