// src/layouts/AppLayout.jsx
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSideBar from "./AppSidebar";
import { useAdminAuth } from "../context/adminAuthContext"; 

const LayoutContent = () => {
  const { isHovered, isMobileOpen } = useSidebar();
  const { admin } = useAdminAuth(); 

  return (
    <div className="flex min-h-screen">
      {/* Sidebar + Backdrop */}
      <AppSideBar user={admin} /> {/* pass user to sidebar */}
      <Backdrop />

      {/* Main Content */}
      <div
        className={`
          flex-1 transition-all duration-300 ease-in-out
          ${isMobileOpen ? "ml-0" : isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"}
          min-h-screen
        `}
      >
        <AppHeader />
        <main className="p-4 md:p-6 max-w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const AppLayout = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
