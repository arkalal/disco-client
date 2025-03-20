"use client";

import MainLayout from "../../../components/layout/MainLayout";
import SearchSection from "../../../components/home/SearchSection";
import SetupGuide from "../../../components/home/SetupGuide";

import "../../../components/layout/MainLayout.scss";
import "../../../components/layout/Sidebar.scss";
import "../../../components/home/SearchSection.scss";
import "../../../components/home/SearchDropdown.scss";
import "../../../components/home/SetupGuide.scss";

const HomePage = () => {
  return (
    <MainLayout>
      <SearchSection />
      <SetupGuide />
    </MainLayout>
  );
};

export default HomePage;
