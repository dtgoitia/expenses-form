import AppUI from "./AppUI";
import "./blueprint.css";
import { DEVELOPMENT_MODE, MOCK_APIS } from "./constants";
import { App } from "./domain/app";
import { BrowserStorage } from "./domain/browserstorage";
import { CurrencyManager } from "./domain/currencies";
import { ExpenseManager } from "./domain/expenses";
import { PaymentAccountsManager } from "./domain/paymentAccounts";
import "./index.css";
import { Storage } from "./localStorage";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { GlobalStyle } from "./style/globalStyle";
import React from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";

if (DEVELOPMENT_MODE && MOCK_APIS) {
  const { worker } = require("./mocks/browser");
  worker.start();
}

const expenseManager = new ExpenseManager();
const paymentAccountsManager = new PaymentAccountsManager();
const browserStorage = new BrowserStorage({
  expenseManager,
  paymentAccountsManager,
  client: new Storage(),
});
const currencyManager = new CurrencyManager();

const app = new App({
  browserStorage,
  expenseManager,
  paymentAccountsManager,
  currencyManager,
});

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <AppUI app={app} />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
