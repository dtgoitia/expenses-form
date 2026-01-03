import CenteredPage from "./components/CenteredPage";
import { ErrorPanel } from "./components/ErrorPanel";
import { FullPage } from "./components/FullPage";
import NavBar from "./components/NaviBar";
import { BASE_URL } from "./constants";
import { App } from "./domain/app";
import { ExpenseEditorPage } from "./pages/ExpenseEditorPage";
import { ExpensesPage } from "./pages/ExpensesPage";
import { ExpenseSplitsEditorPage } from "./pages/ExpenseSplitsEditorPage";
import PageNotFound from "./pages/PageNotFound";
import PaymentAccountsPage from "./pages/PaymentAccountsPage";
import { SettingsPage } from "./pages/SettingsPage";
import Paths from "./routes";
import { DEFAULT_THEME, Theme, ThemeContext } from "./style/ThemeContext";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";

const navBarHeight = "50px";
const ScrollableSectionBellowNavBar = styled.div`
  height: calc(100vh - ${navBarHeight});
  overflow-y: scroll;
`;

interface Props {
  app: App;
}

function AppUI({ app }: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    app.initialize();
    setLoading(false);
  }, [app]);

  const baseCss = "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200";

  if (loading) {
    return (
      <FullPage.Parent className={DEFAULT_THEME}>
        <FullPage.ContentFullyCentered className={baseCss}>
          <CenteredPage>
            <div className="flex flex-row justify-center">Loading data...</div>
          </CenteredPage>
        </FullPage.ContentFullyCentered>
      </FullPage.Parent>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <BrowserRouter basename={BASE_URL}>
        <FullPage.Parent className={theme}>
          <FullPage.Content className={baseCss}>
            <ErrorPanel />
            <NavBar />
            <ScrollableSectionBellowNavBar>
              <Routes>
                <Route path={Paths.root} element={<ExpensesPage app={app} />} />
                <Route
                  path={Paths.expenseEditor}
                  element={<ExpenseEditorPage app={app} />}
                />
                <Route
                  path={Paths.expenseSplitsEditor}
                  element={<ExpenseSplitsEditorPage app={app} />}
                />
                <Route
                  path={Paths.paymentAccounts}
                  element={<PaymentAccountsPage app={app} />}
                />
                <Route path={Paths.settings} element={<SettingsPage app={app} />} />
                <Route path={Paths.notFound} element={<PageNotFound />} />
              </Routes>
            </ScrollableSectionBellowNavBar>
          </FullPage.Content>
        </FullPage.Parent>
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}

export default AppUI;
