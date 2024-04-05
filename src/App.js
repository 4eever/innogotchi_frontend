import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";

import LogInPage from "./components/LogInPage";
import SignUpPage from "./components/SignUpPage";
import FarmOverviewPage from "./components/FarmOverviewPage";
import FarmPage from "./components/FarmPage";
import AccountDetalesPage from "./components/AccountDetalesPage";
import CreateFarmPage from "./components/CreateFarmPage";
import CreateInnogotchiPage from "./components/CreateInnogotchiPage";
import FarmDetalesPage from "./components/FarmDetalesPage";
import AllInnogotchiesPage from "./components/AllInnogotchiesPage";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LogInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/farm-overview/:id" element={<FarmOverviewPage />} />
          <Route path="/farm/:id" element={<FarmPage />} />
          <Route path="/account-detales/:id" element={<AccountDetalesPage />} />
          <Route path="/create-farm/:id" element={<CreateFarmPage />} />
          <Route path="/create-innogotchi/:id" element={<CreateInnogotchiPage />} />
          <Route path="/all-innogotchies/:id" element={<AllInnogotchiesPage />} />
          <Route path="/farm-detales/:id" element={<FarmDetalesPage />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
