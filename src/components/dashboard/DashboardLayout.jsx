import { Outlet } from "react-router-dom";
import AuthProvider from "../../providers/AuthProvider";
import { Sidebar } from "./Sidebar";

export default function DashboardLayout() {
  return (
    <AuthProvider>
      <main className="h-screen w-full flex">
        <Sidebar />
        <section className="flex-1 p-4 max-h-screen overflow-y-auto bg-slate-100 z-40">
          <Outlet />
        </section>
      </main>
    </AuthProvider>
  );
}
