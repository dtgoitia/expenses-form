import AppUI from "./AppUI";
import "./blueprint.css";
import { App } from "./domain/app";
import { BrowserStorage } from "./domain/browserstorage";
import { CurrencyManager } from "./domain/currencies";
import { ExpenseManager } from "./domain/expenses";
import { PaymentAccountsManager } from "./domain/paymentAccounts";
import "./index.css";
import { Storage } from "./localStorage";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { GlobalStyle } from "./style/globalStyle";
import React from "react";
import ReactDOM from "react-dom";
import { registerSW } from "virtual:pwa-register";

const isLocalhost = window.location.hostname === "localhost";

const updateSW = registerSW({
  onNeedRefresh: function () {
    if (
      isLocalhost ||
      confirm("There is an newer version of this app. Do you want to update?")
    ) {
      updateSW(true);
    }
  },
});

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
