import { HashRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/landing/HomePage";
import LandingLayout from "./components/landing/LandingLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import MyPermit from "./pages/dashboard/MyPermit";
import Permits from "./pages/dashboard/Permits";
import PermitPage from "./pages/dashboard/PermitPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import ParkingPage from "./pages/dashboard/ParkingPage";
import ManageUser from "./pages/dashboard/ManageUser";
import ViewLogs from "./pages/dashboard/ViewLogs";
import ViolationPage from "./pages/dashboard/ViolationPage";
import ReportViolationPage from "./pages/dashboard/ReportViolationPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import RenewalPage from "./pages/dashboard/RenewalPage";
import Scanner from "./pages/dashboard/Scanner";
import ForgotPasswordPage from "./pages/auth/ForgotPassword";

import QRScanHandler from "./lib/QRScanHandler";
import { getAuth } from "firebase/auth";
import VisitorPage from "./pages/dashboard/VisitorPage";
import VisitorsList from "./pages/dashboard/VisitorsList";
import Visitor from "./pages/dashboard/Visitor";
import ScanPage from "./pages/dashboard/ScanPage";

export default function App() {
  const auth = getAuth();
  const user = auth.currentUser;

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/ForgotPasswordPage" element={<ForgotPasswordPage />} />
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="mypermit" element={<MyPermit />} />
          <Route path="permits" element={<Permits />} />
          <Route path="Profile" element={<ProfilePage />} />
          <Route path="permits/:permitId" element={<PermitPage />} />
          <Route path="parking" element={<ParkingPage />} />
          <Route path="parking/:userId" element={<ParkingPage />} />
          <Route path="ManageUSer" element={<ManageUser />} />
          <Route path="ViewLogs" element={<ViewLogs />} />
          <Route path="ViolationPage" element={<ViolationPage />} />
          <Route path="ReportViolationPage" element={<ReportViolationPage />} />
          <Route path="AnalyticsPage" element={<AnalyticsPage />} />
          <Route path="RenewalPage" element={<RenewalPage />} />
          <Route path="Scanner" element={<Scanner />} />
          <Route path="Visitors" element={<VisitorPage />} />
          <Route path="Visitors/list" element={<VisitorsList />} />
          <Route path="Visitors/:id" element={<Visitor />} />
        </Route>

        <Route path="/scan" element={<QRScanHandler />} />
        <Route path="/scan/:userId" element={<ScanPage />} />
      </Routes>
    </HashRouter>
  );
}
