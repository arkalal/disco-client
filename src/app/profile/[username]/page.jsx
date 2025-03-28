"use client";

import React, { useState } from "react";
import { use } from "react";
import Link from "next/link";
// Icons
import { IoHomeOutline } from "react-icons/io5";
import { BsLightbulb } from "react-icons/bs";
import { BsSearch } from "react-icons/bs";
import { AiOutlineMessage, AiOutlineInstagram } from "react-icons/ai";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdOutlineAnalytics } from "react-icons/md";
import { BiNotification } from "react-icons/bi";
import { BsBarChart } from "react-icons/bs";
import { VscGraph } from "react-icons/vsc";
import { IconArrowsExchange } from "@tabler/icons-react";
import { RiListCheck2 } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { CgInbox } from "react-icons/cg";
import { BsFileText } from "react-icons/bs";
import { IoPhonePortraitOutline } from "react-icons/io5";
import {
  RiFileList3Line,
  RiShoppingBag3Line,
  RiHeartLine,
  RiUserLine,
  RiLineChartLine,
  RiDownload2Line,
} from "react-icons/ri";
import { TbExternalLink } from "react-icons/tb";
import { RiDashboardLine } from "react-icons/ri";
import { FaInstagram } from "react-icons/fa";

// Components
import ProfileHeader from "../../../../components/profile/ProfileHeader";
import ProfileNavigation from "../../../../components/profile/ProfileNavigation";
import ProfileOverview from "../../../../components/profile/ProfileOverview";

// Styles
import "../profile-styles.scss";

const profileData = {
  username: "srkkingk555",
  name: "Shah Rukh Khan",
  bio: "This fan page is dedicated to the Actor SRK. Upcoming movie : King, PATHAAN 2 Upcoming web series : The Ba***ds of Boll...",
  location: "India",
  website: "www.redchillies.com",
  category: ["Arts & Entertainment", "Movies"],
  influenceScore: 7.88,
  followers: "1.2m",
  engagementRate: "1.33%",
  estimatedReach: "174.7k",
  insights: {
    positive: "High engagement on promotional content",
    negative: "Decreased activity in the last month",
    neutral: "Most active between 6-9 PM IST",
  },
};

export default function Profile({ params }) {
  // Unwrap params with React.use()
  const unwrappedParams = use(params);
  const username = unwrappedParams?.username || "srkkingk555";
  const [activeTab, setActiveTab] = useState("profile-summary");
  const [profileSection, setProfileSection] = useState("platforms");

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);

    // If this is a section that should be scrolled to (not profile tabs)
    if (
      [
        "overview",
        "engagement",
        "content",
        "audience",
        "growth",
        "brands",
      ].includes(tab)
    ) {
      // Find the section element
      const sectionElement = document.querySelector(`[data-section="${tab}"]`);
      if (sectionElement) {
        // Scroll to the section with smooth behavior
        sectionElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Handle profile section change
  const handleProfileSectionChange = (section) => {
    setProfileSection(section);
    // Find the section element
    const sectionElement = document.querySelector(
      `[data-profile-section="${section}"]`
    );
    if (sectionElement) {
      // Scroll to the section with smooth behavior
      sectionElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Profile Tab Navigation section
  const renderTabNavigation = () => {
    if (activeTab.startsWith("profile")) {
      return (
        <>
          <div
            className={`vertical-tab ${
              profileSection === "platforms" ? "active" : ""
            }`}
            onClick={() => handleProfileSectionChange("platforms")}
            data-profile-section="platforms"
          >
            <span className="tab-icon">
              <IoPhonePortraitOutline />
            </span>
            <span>Platforms</span>
          </div>
          <div
            className={`vertical-tab ${
              profileSection === "content" ? "active" : ""
            }`}
            onClick={() => handleProfileSectionChange("content")}
            data-profile-section="content"
          >
            <span className="tab-icon">
              <RiFileList3Line />
            </span>
            <span>Content</span>
          </div>
          <div
            className={`vertical-tab ${
              profileSection === "brands" ? "active" : ""
            }`}
            onClick={() => handleProfileSectionChange("brands")}
            data-profile-section="brands"
          >
            <span className="tab-icon">
              <RiShoppingBag3Line />
            </span>
            <span>Brands</span>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div
            className={`vertical-tab ${
              activeTab === "overview" ? "active" : ""
            }`}
            onClick={() => handleTabChange("overview")}
            data-section="overview"
          >
            <span className="tab-icon">
              <RiDashboardLine />
            </span>
            <span>Overview</span>
          </div>
          <div
            className={`vertical-tab ${
              activeTab === "engagement" ? "active" : ""
            }`}
            onClick={() => handleTabChange("engagement")}
            data-section="engagement"
          >
            <span className="tab-icon">
              <RiHeartLine />
            </span>
            <span>Engagement</span>
          </div>
          <div
            className={`vertical-tab ${
              activeTab === "content" ? "active" : ""
            }`}
            onClick={() => handleTabChange("content")}
            data-section="content"
          >
            <span className="tab-icon">
              <RiFileList3Line />
            </span>
            <span>Content</span>
          </div>
          <div
            className={`vertical-tab ${
              activeTab === "audience" ? "active" : ""
            }`}
            onClick={() => handleTabChange("audience")}
            data-section="audience"
          >
            <span className="tab-icon">
              <RiUserLine />
            </span>
            <span>Audience</span>
          </div>
          <div
            className={`vertical-tab ${activeTab === "growth" ? "active" : ""}`}
            onClick={() => handleTabChange("growth")}
            data-section="growth"
          >
            <span className="tab-icon">
              <RiLineChartLine />
            </span>
            <span>Growth</span>
          </div>
          <div
            className={`vertical-tab ${activeTab === "brands" ? "active" : ""}`}
            onClick={() => handleTabChange("brands")}
            data-section="brands"
          >
            <span className="tab-icon">
              <RiShoppingBag3Line />
            </span>
            <span>Brands</span>
          </div>

          {/* Action buttons, not navigation tabs */}
          <div className="action-buttons">
            <button
              className="action-button"
              onClick={() => window.open("#", "_blank")}
            >
              <span className="button-icon">
                <RiDownload2Line />
              </span>
              <span>Download PDF</span>
            </button>
            <button
              className="action-button"
              onClick={() =>
                window.open(
                  "https://instagram.com/" + profileData.username,
                  "_blank"
                )
              }
            >
              <span className="button-icon">
                <TbExternalLink />
              </span>
              <span>Go To Instagram Profile</span>
            </button>
          </div>
        </>
      );
    }
  };

  // Render profile summary content based on active section
  const renderProfileSummaryContent = () => {
    return (
      <div className="profile-summary-content">
        {/* Platforms Section */}
        <div
          className="profile-section platforms-section"
          data-profile-section="platforms"
        >
          <div className="platform-user">
            <div className="platform-header">
              <div className="instagram-icon">
                <FaInstagram size={22} />
              </div>
              <div className="platform-username">@{profileData.username}</div>
              <div className="platform-influence-score">
                {profileData.influenceScore}
              </div>
            </div>

            <div className="platform-metrics">
              <div className="metrics-grid">
                <div className="metric-item">Followers</div>
                <div className="metric-item">Avg. Likes</div>
                <div className="metric-item">Avg. Comments</div>
                <div className="metric-item">Avg. Reel Views</div>
                <div className="metric-item">Estimated Reach</div>
                <div className="metric-item">Engagement Rate</div>

                <div className="metric-value">1.2m</div>
                <div className="metric-value">17.7k</div>
                <div className="metric-value">104</div>
                <div className="metric-value">397.2k</div>
                <div className="metric-value">184.1k</div>
                <div className="metric-value">1.51%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div
          className="profile-section content-section"
          data-profile-section="content"
        >
          <div className="section-header">
            <h3>CONTENT</h3>
          </div>

          <div className="content-categories">
            <h4>CONTENT CATEGORIES</h4>
            <div className="category-bar">
              <div
                className="category-bar-fill"
                style={{
                  width: "95.92%",
                  backgroundColor: "#4338ca",
                }}
              ></div>
            </div>

            <div className="categories-list">
              <div className="category-item">
                <div className="category-icon">🎭</div>
                <div className="category-details">
                  <div className="category-name">Arts & Entertainment</div>
                  <div className="category-bar">
                    <div
                      className="category-bar-fill"
                      style={{
                        width: "95.92%",
                        backgroundColor: "#4338ca",
                      }}
                    ></div>
                  </div>
                  <div className="category-percentage">95.92%</div>
                </div>
              </div>

              <div className="category-item">
                <div className="category-icon">🎬</div>
                <div className="category-details">
                  <div className="category-name">
                    Movies - Arts & Entertainment
                  </div>
                  <div className="category-bar">
                    <div
                      className="category-bar-fill"
                      style={{
                        width: "93.88%",
                        backgroundColor: "#4338ca",
                      }}
                    ></div>
                  </div>
                  <div className="category-percentage">93.88%</div>
                </div>
              </div>

              <div className="category-item">
                <div className="category-icon">🏋️</div>
                <div className="category-details">
                  <div className="category-name">Health & Fitness</div>
                  <div className="category-bar">
                    <div
                      className="category-bar-fill"
                      style={{
                        width: "2.04%",
                        backgroundColor: "#38bdf8",
                      }}
                    ></div>
                  </div>
                  <div className="category-percentage">2.04%</div>
                </div>
              </div>

              <div className="category-item">
                <div className="category-icon">⚽</div>
                <div className="category-details">
                  <div className="category-name">Sports</div>
                  <div className="category-bar">
                    <div
                      className="category-bar-fill"
                      style={{
                        width: "2.04%",
                        backgroundColor: "#fb7185",
                      }}
                    ></div>
                  </div>
                  <div className="category-percentage">2.04%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brands Section */}
        <div
          className="profile-section brands-section"
          data-profile-section="brands"
        >
          <div className="section-header">
            <div className="brands-icon">
              <RiShoppingBag3Line />
            </div>
            <h3>BRANDS</h3>
          </div>

          <div className="brand-mentions">
            <h4>BRAND MENTIONS</h4>
            <div className="brand-filters">
              <button className="brand-filter active">All</button>
              <button className="brand-filter">Beverages</button>
              <button className="brand-filter">Entertainment</button>
              <button className="brand-filter">Sports</button>
            </div>

            <div className="brand-grid">
              <div className="brand-card">
                <div className="brand-logo">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1920px-Netflix_2015_logo.svg.png"
                    alt="Netflix"
                  />
                </div>
                <div className="brand-name">netflix_in</div>
                <div className="brand-handle">@netflix_in</div>
                <div className="brand-posts">6 posts</div>
              </div>

              <div className="brand-card">
                <div className="brand-logo">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/8/84/Indian_Premier_League_Official_Logo.svg/1200px-Indian_Premier_League_Official_Logo.svg.png"
                    alt="Indian Super League"
                  />
                </div>
                <div className="brand-name">indiansuperleague</div>
                <div className="brand-handle">@indiansuperleague</div>
                <div className="brand-posts">3 posts</div>
              </div>

              <div className="brand-card">
                <div className="brand-logo">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/IIFA_Awards_Logo.svg/1200px-IIFA_Awards_Logo.svg.png"
                    alt="IIFA"
                  />
                </div>
                <div className="brand-name">iifa</div>
                <div className="brand-handle">@iifa</div>
                <div className="brand-posts">3 posts</div>
              </div>

              <div className="brand-card">
                <div className="brand-logo">
                  <img
                    src="https://www.roarwithsimba.com/images/logo.svg"
                    alt="Roar with Simba"
                  />
                </div>
                <div className="brand-name">roarwithsimba</div>
                <div className="brand-handle">@roarwithsimba</div>
                <div className="brand-posts">1 post</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Set up scroll spy for profile summary sections
  React.useEffect(() => {
    if (activeTab === "profile-summary") {
      const sections = document.querySelectorAll("[data-profile-section]");
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const section = entry.target.getAttribute("data-profile-section");
              setProfileSection(section);
            }
          });
        },
        { threshold: 0.5 }
      );

      sections.forEach((section) => {
        observer.observe(section);
      });

      return () => {
        sections.forEach((section) => {
          observer.unobserve(section);
        });
      };
    }
  }, [activeTab]);

  return (
    <div className="search-page-container">
      <div className="collapsible-sidebar">
        <div className="logo">
          <Link href="/home">
            <span className="logo-text">disco</span>
          </Link>
        </div>

        <nav className="nav-menu">
          <Link href="/home" className="nav-item">
            <IoHomeOutline className="nav-icon" />
            <span className="nav-label">Home</span>
          </Link>
          <Link href="/campaign-ideas" className="nav-item">
            <BsLightbulb className="nav-icon" />
            <span className="nav-label">Campaign Ideas</span>
          </Link>
          <Link href="/search" className="nav-item">
            <BsSearch className="nav-icon" />
            <span className="nav-label">Influencer Search</span>
          </Link>
          <Link href="/influencer-comparison" className="nav-item">
            <IconArrowsExchange className="nav-icon" />
            <span className="nav-label">Influencer Comparison</span>
          </Link>
          <Link href="/plans-lists" className="nav-item">
            <RiListCheck2 className="nav-icon" />
            <span className="nav-label">Plans & Lists</span>
          </Link>
          <Link href="/messages" className="nav-item">
            <AiOutlineMessage className="nav-icon" />
            <span className="nav-label">Messages</span>
            <span className="badge">3</span>
          </Link>
          <Link href="/campaign-reports" className="nav-item">
            <BsBarChart className="nav-icon" />
            <span className="nav-label">Campaign Reports</span>
          </Link>
          <Link href="/consolidated-reports" className="nav-item">
            <MdOutlineAnalytics className="nav-icon" />
            <span className="nav-label">Consolidated Reports</span>
          </Link>
          <Link href="/content-research" className="nav-item">
            <VscGraph className="nav-icon" />
            <span className="nav-label">Content Research</span>
            <span className="badge">New</span>
          </Link>
          <Link href="/competitor-analysis" className="nav-item">
            <BsBarChart className="nav-icon" />
            <span className="nav-label">Competitor Analysis</span>
          </Link>
        </nav>

        <div className="notifications">
          <Link href="/notifications" className="nav-item">
            <BiNotification className="nav-icon" />
            <span className="nav-label">Notifications</span>
          </Link>
        </div>

        <div className="try-disco">
          <button className="try-button">
            TRY DISCO
            <span className="credits">3 credits remaining</span>
          </button>
        </div>
      </div>

      <div className="profile-main-content">
        <div className="profile-content-wrapper">
          <ProfileHeader profileData={profileData} />

          <div className="profile-navigation-header">
            <div className="profile-nav-tabs">
              <div
                className={`profile-nav-tab ${
                  activeTab.startsWith("profile") ? "active" : ""
                }`}
                onClick={() => handleTabChange("profile-summary")}
              >
                <div className="tab-icon">
                  <BsFileText />
                </div>
                <span>Profile Summary</span>
              </div>

              <div
                className={`profile-nav-tab ${
                  !activeTab.startsWith("profile") ? "active" : ""
                }`}
                onClick={() => handleTabChange("overview")}
              >
                <div className="tab-icon instagram-icon">
                  <FaInstagram />
                </div>
                <span>@{username}</span>
              </div>
            </div>
          </div>

          <div className="profile-tabs-content-layout">
            <div className="profile-tabs">
              <div className="vertical-tabs">{renderTabNavigation()}</div>
            </div>

            <div className="profile-content-area">
              {activeTab === "profile-summary" ? (
                renderProfileSummaryContent()
              ) : activeTab === "overview" ||
                activeTab === "engagement" ||
                activeTab === "content" ||
                activeTab === "audience" ||
                activeTab === "growth" ||
                activeTab === "brands" ? (
                <ProfileOverview profileData={profileData} />
              ) : (
                <div className="tab-content">
                  <h2>
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                    Content
                  </h2>
                  <p>This tab content is under development.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
