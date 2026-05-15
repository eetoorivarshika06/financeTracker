import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../context/SidebarContext";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-bg">
        <Sidebar />
        <div className="md:ml-64">
          <Navbar />
          <main className="p-4 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default MainLayout;
