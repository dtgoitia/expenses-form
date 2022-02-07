import ExpensesForm from "./pages/ExpensesForm";
import PageNotFound from "./pages/PageNotFound";
import { Route, Routes } from "react-router-dom";

enum Paths {
  root = "/",
  notFound = "/*",
}

function App() {
  return (
    <Routes>
      <Route path={Paths.root} element={<ExpensesForm />} />
      <Route path={Paths.notFound} element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
