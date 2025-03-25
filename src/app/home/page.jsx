"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MainLayout from "../../../components/layout/MainLayout";
import SearchSection from "../../../components/home/SearchSection";
import SetupGuide from "../../../components/home/SetupGuide";

import "../../../components/layout/MainLayout.scss";
import "../../../components/layout/Sidebar.scss";
import "../../../components/home/SearchSection.scss";
import "../../../components/home/SearchDropdown.scss";
import "../../../components/home/SetupGuide.scss";

const HomePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Check if user is not authenticated and redirect to login
    if (status === "unauthenticated") {
      window.location.href = "/login";
    }
  }, [status]);

  // Show loading state while session is being validated
  if (status === "loading") {
    return <div className="loading-screen">Loading...</div>;
  }

  // Only render the page content when authenticated
  return (
    <MainLayout>
      <SearchSection />
      <SetupGuide />
    </MainLayout>
  );
};

export default HomePage;
