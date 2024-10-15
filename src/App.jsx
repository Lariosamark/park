import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/landing/HomePage";
import LandingLayout from "./components/landing/LandingLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import MyPermit from "./pages/dashboard/MyPermit";
import Permits from "./pages/dashboard/Permits";
import PermitPage from "./pages/dashboard/PermitPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="mypermit" element={<MyPermit />} />
          <Route path="permits" element={<Permits />} />
          <Route path="permits/:permitId" element={<PermitPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
