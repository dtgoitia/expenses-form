import CenteredPage from "./components/CenteredPage";
import ErrorPanel from "./components/ErrorPanel";
import NavBar from "./components/NaviBar";
import { BASE_URL } from "./constants";
import { App } from "./domain/app";
import ExpensesForm from "./pages/ExpensesForm";
import PageNotFound from "./pages/PageNotFound";
import PaymentAccountsPage from "./pages/PaymentAccountsPage";
import SettingsPage from "./pages/Settings";
import Paths from "./routes";
import { Spinner } from "@blueprintjs/core";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";

const navBarHeight = "50px";
const ScrollableSectionBellowNavBar = styled.div`
  height: calc(100vh - ${navBarHeight});
  overflow-y: scroll;
`;

const FullPage = styled.div`
  height: 100vh;
`;

const FullPageVerticallyCentered = styled(FullPage)`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
`;

const SpinnerText = styled.p`
  margin: 1rem;
  font-size: large;
`;

interface Props {
  app: App;
}

function AppUI({ app }: Props) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    app.initialize();
    setLoading(false);
  }, [app]);

  if (loading) {
    return (
      <FullPage>
        <FullPageVerticallyCentered>
          <CenteredPage>
            <Spinner />
            <SpinnerText>Loading data...</SpinnerText>
          </CenteredPage>
        </FullPageVerticallyCentered>
      </FullPage>
    );
  }

  return (
    <BrowserRouter basename={BASE_URL}>
      <FullPage>
        <ErrorPanel />
        <NavBar />
        <ScrollableSectionBellowNavBar>
          <Routes>
            <Route path={Paths.root} element={<ExpensesForm app={app} />} />
            <Route
              path={Paths.paymentAccounts}
              element={<PaymentAccountsPage app={app} />}
            />
            <Route path={Paths.settings} element={<SettingsPage />} />
            <Route path={Paths.notFound} element={<PageNotFound />} />
          </Routes>
        </ScrollableSectionBellowNavBar>
      </FullPage>
    </BrowserRouter>
  );
}

export default AppUI;
