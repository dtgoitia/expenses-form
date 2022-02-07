import ExpensesForm from "./pages/ExpensesForm";
import PageNotFound from "./pages/PageNotFound";
import SettingsPage from "./pages/Settings";
import Paths from "./routes";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path={Paths.root} element={<ExpensesForm />} />
      <Route path={Paths.settings} element={<SettingsPage />} />
      <Route path={Paths.notFound} element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
