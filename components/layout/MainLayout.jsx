"use client";

import { usePathname } from 'next/navigation';
import Sidebar from "./Sidebar";
import CollapsibleSidebar from "./CollapsibleSidebar";

const MainLayout = ({ children }) => {
  const pathname = usePathname();
  const isHomePage = pathname === "/home" || pathname === "/";
  
  // Extract the current page from the pathname
  let activePage = pathname.replace(/^\//, ""); // Remove leading slash
  if (activePage === "") activePage = "home";
  
  return (
    <div className="main-layout">
      {isHomePage ? (
        <Sidebar />
      ) : (
        <CollapsibleSidebar activePage={activePage} />
      )}
      <main className="main-content">{children}</main>
    </div>
  );
};

export default MainLayout;
