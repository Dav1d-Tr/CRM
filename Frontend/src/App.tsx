import { BrowserRouter as Router, Routes, Route } from "react-router";
import { PlannerProvider } from "./context/PlannerContext";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Reports from "./pages/Reports";
import Price from "./pages/Price";
import Billed from "./pages/Billed";
import General from "./pages/General";
import Planner from "./pages/Planner";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ProtectedContext from "./context/ProtectedContext";
import BillingInformation from "./components/billing/BillingInformation";
import NumberLeadsMetrics from "./pages/Metrics/NumberLeadsMetrics";
import CountryAdmin from "./pages/CountryAdmin";
import UserRoleAdmin from "./pages/UserRoleAdmin";
import LineAdmin from "./pages/LineAdmin";
import CityAdmin from "./pages/CityAdmin";
import ProductAdmin from "./pages/ProductAdmin";
import UsersAdmin from "./pages/UsersAdmin";
import MetricsTotal from "./pages/Metrics/MetricsTotal";

export default function App() {
  return (
    <PlannerProvider>
      <Router>
        <ScrollToTop />
        <Routes>

          {/* PRIVADO */}
          <Route element={<ProtectedContext />}>
            <Route element={<AppLayout />}>

              <Route index path="/" element={<Home />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/price" element={<Price />} />
              <Route path="/billed" element={<Billed />} />
              <Route path="/general" element={<General />} />
              <Route path="/billed/:id" element={<BillingInformation />} />
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/numberleadsmetrics" element={<NumberLeadsMetrics />} />
              <Route path="/metricsTotal" element={<MetricsTotal />} />

            </Route>
          </Route>

          {/* ADMIN */}
          <Route
            element={
              <ProtectedContext
                allowedRoles={["Administrador", "Coordinador de Mercadeo"]}
              />
            }
          >
            <Route element={<AppLayout />}>
              <Route path="/countryAdmin" element={<CountryAdmin />} />
              <Route path="/roleAdmin" element={<UserRoleAdmin />} />
              <Route path="/lineAdmin" element={<LineAdmin />} />
              <Route path="/cityAdmin" element={<CityAdmin />} />
              <Route path="/productAdmin" element={<ProductAdmin />} />
              <Route path="/usersAdmin" element={<UsersAdmin />} />
            </Route>
          </Route>


          {/* PÚBLICO */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/resetpassword" element={<ResetPassword />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </PlannerProvider>
  );
}
