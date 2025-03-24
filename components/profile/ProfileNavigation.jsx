"use client";

import { useState, useEffect, useRef } from "react";
import {
  RiDashboardLine,
  RiHeartLine,
  RiFileList3Line,
  RiUserLine,
  RiLineChartLine,
  RiShoppingBag3Line,
  RiDownload2Line,
} from "react-icons/ri";
import { FaInstagram } from "react-icons/fa";
import { TbExternalLink } from "react-icons/tb";
import { BsFileText } from "react-icons/bs";
import { IoPhonePortraitOutline } from "react-icons/io5";
import "./ProfileNavigation.scss";

const ProfileNavigation = ({ activeTab, onChangeTab }) => {
  const [activeMainTab, setActiveMainTab] = useState("instagram");

  // Define navigation tabs based on active main tab
  const mainTabs = [
    {
      id: "profile-summary",
      label: "Profile Summary",
      icon: <BsFileText />,
    },
    {
      id: "instagram",
      label: "@srkkingk555",
      icon: <FaInstagram className="instagram-icon" />,
    },
  ];

  // Define different sidebar navigation tabs for each main tab
  const profileSummaryTabs = [
    { id: "platforms", label: "Platforms", icon: <IoPhonePortraitOutline /> },
    { id: "content", label: "Content", icon: <RiFileList3Line /> },
    { id: "brands", label: "Brands", icon: <RiShoppingBag3Line /> },
  ];

  const instagramTabs = [
    { id: "overview", label: "Overview", icon: <RiDashboardLine /> },
    { id: "engagement", label: "Engagement", icon: <RiHeartLine /> },
    { id: "content", label: "Content", icon: <RiFileList3Line /> },
    { id: "audience", label: "Audience", icon: <RiUserLine /> },
    { id: "growth", label: "Growth", icon: <RiLineChartLine /> },
    { id: "brands", label: "Brands", icon: <RiShoppingBag3Line /> },
    { id: "download-pdf", label: "Download PDF", icon: <RiDownload2Line /> },
    {
      id: "instagram-profile",
      label: "Go To Instagram Profile",
      icon: <TbExternalLink />,
    },
  ];

  // Initialize with Instagram view by default
  useEffect(() => {
    if (activeTab === "overview") {
      setActiveMainTab("instagram");
    } else if (profileSummaryTabs.some((tab) => tab.id === activeTab)) {
      setActiveMainTab("profile-summary");
    }
  }, []);

  // Handle main tab change
  const handleMainTabChange = (tabId) => {
    setActiveMainTab(tabId);
    // Set first tab of the group as active when switching main tabs
    if (tabId === "profile-summary") {
      onChangeTab("platforms");
    } else {
      onChangeTab("overview");
    }
  };

  // Get current sidebar tabs based on active main tab
  const currentSidebarTabs =
    activeMainTab === "profile-summary" ? profileSummaryTabs : instagramTabs;

  return (
    <div className="profile-navigation-container">
      <div className="top-tabs">
        {mainTabs.map((tab) => (
          <div
            key={tab.id}
            className={`top-tab ${activeMainTab === tab.id ? "active" : ""}`}
            onClick={() => handleMainTabChange(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </div>
        ))}
      </div>

      <div className="profile-content-layout">
        <div className="side-vertical-tabs">
          {currentSidebarTabs.map((tab) => (
            <div
              key={tab.id}
              className={`vertical-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => {
                onChangeTab(tab.id);
              }}
            >
              <div className="tab-icon">{tab.icon}</div>
              <span className="tab-label">{tab.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileNavigation;
