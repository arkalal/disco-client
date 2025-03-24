"use client";

import { useState } from "react";
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
  const [activeTab, setActiveTab] = useState("overview");

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Profile Tab Navigation section
  const renderTabNavigation = () => {
    if (activeTab.startsWith("profile")) {
      return (
        <>
          <div
            className={`vertical-tab ${
              activeTab === "platforms" ? "active" : ""
            }`}
            onClick={() => handleTabChange("platforms")}
          >
            <span className="tab-icon">
              <IoPhonePortraitOutline />
            </span>
            <span>Platforms</span>
          </div>
          <div
            className={`vertical-tab ${
              activeTab === "content" ? "active" : ""
            }`}
            onClick={() => handleTabChange("content")}
          >
            <span className="tab-icon">
              <RiFileList3Line />
            </span>
            <span>Content</span>
          </div>
          <div
            className={`vertical-tab ${activeTab === "brands" ? "active" : ""}`}
            onClick={() => handleTabChange("brands")}
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
          >
            <span className="tab-icon">
              <RiUserLine />
            </span>
            <span>Audience</span>
          </div>
          <div
            className={`vertical-tab ${activeTab === "growth" ? "active" : ""}`}
            onClick={() => handleTabChange("growth")}
          >
            <span className="tab-icon">
              <RiLineChartLine />
            </span>
            <span>Growth</span>
          </div>
          <div
            className={`vertical-tab ${activeTab === "brands" ? "active" : ""}`}
            onClick={() => handleTabChange("brands")}
          >
            <span className="tab-icon">
              <RiShoppingBag3Line />
            </span>
            <span>Brands</span>
          </div>
          <div
            className={`vertical-tab ${
              activeTab === "download-pdf" ? "active" : ""
            }`}
            onClick={() => handleTabChange("download-pdf")}
          >
            <span className="tab-icon">
              <RiDownload2Line />
            </span>
            <span>Download PDF</span>
          </div>
          <div
            className={`vertical-tab ${
              activeTab === "instagram-profile" ? "active" : ""
            }`}
            onClick={() => handleTabChange("instagram-profile")}
          >
            <span className="tab-icon">
              <TbExternalLink />
            </span>
            <span>Go To Instagram Profile</span>
          </div>
        </>
      );
    }
  };

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
              {activeTab === "overview" && (
                <ProfileOverview profileData={profileData} />
              )}
              {activeTab === "engagement" && (
                <div className="engagement-content">
                  <div className="engagement-header">
                    <div className="engagement-icon">
                      <RiHeartLine />
                    </div>
                    <h2>ENGAGEMENTS & VIEWS</h2>
                  </div>

                  <div className="content-types">
                    <div className="content-type">
                      <div className="instagram-icon">
                        <FaInstagram size={20} />
                      </div>
                      <div className="content-label">Images</div>

                      <div className="engagement-stats">
                        <div className="stat-item">
                          <div className="stat-label">AVG. LIKES</div>
                          <div className="stat-value">17.4k</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-label">AVG. COMMENTS</div>
                          <div className="stat-value">108</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-label">ENGAGEMENT RATE</div>
                          <div className="stat-value">1.49%</div>
                        </div>
                      </div>
                    </div>

                    <div className="content-type">
                      <div className="reels-icon">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                            fill="currentColor"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"
                            fill="currentColor"
                          />
                          <path
                            d="M12 3C12.5523 3 13 3.44772 13 4C13 4.55228 12.5523 5 12 5C11.4477 5 11 4.55228 11 4C11 3.44772 11.4477 3 12 3Z"
                            fill="currentColor"
                          />
                          <path
                            d="M18.3639 5.63604C18.7545 6.02656 18.7545 6.65973 18.3639 7.05025C17.9734 7.44078 17.3402 7.44078 16.9497 7.05025C16.5592 6.65973 16.5592 6.02656 16.9497 5.63604C17.3402 5.24551 17.9734 5.24551 18.3639 5.63604Z"
                            fill="currentColor"
                          />
                          <path
                            d="M20 12C20 11.4477 20.4477 11 21 11C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13C20.4477 13 20 12.5523 20 12Z"
                            fill="currentColor"
                          />
                          <path
                            d="M18.3639 16.9497C18.7545 16.5592 19.3877 16.5592 19.7782 16.9497C20.1687 17.3402 20.1687 17.9734 19.7782 18.3639C19.3877 18.7545 18.7545 18.7545 18.3639 18.3639C17.9734 17.9734 17.9734 17.3402 18.3639 16.9497Z"
                            fill="currentColor"
                          />
                          <path
                            d="M12 19C12.5523 19 13 19.4477 13 20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20C11 19.4477 11.4477 19 12 19Z"
                            fill="currentColor"
                          />
                          <path
                            d="M5.63604 16.9497C6.02656 16.5592 6.65973 16.5592 7.05025 16.9497C7.44078 17.3402 7.44078 17.9734 7.05025 18.3639C6.65973 18.7545 6.02656 18.7545 5.63604 18.3639C5.24551 17.9734 5.24551 17.3402 5.63604 16.9497Z"
                            fill="currentColor"
                          />
                          <path
                            d="M3 12C3 11.4477 3.44772 11 4 11C4.55228 11 5 11.4477 5 12C5 12.5523 4.55228 13 4 13C3.44772 13 3 12.5523 3 12Z"
                            fill="currentColor"
                          />
                          <path
                            d="M5.63604 7.05025C5.24551 6.65973 5.24551 6.02656 5.63604 5.63604C6.02656 5.24551 6.65973 5.24551 7.05025 5.63604C7.44078 6.02656 7.44078 6.65973 7.05025 7.05025C6.65973 7.44078 6.02656 7.44078 5.63604 7.05025Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                      <div className="content-label">Reels</div>

                      <div className="engagement-stats">
                        <div className="stat-item">
                          <div className="stat-label">AVG. VIEWS</div>
                          <div className="stat-value">397.2k</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-label">AVG. LIKES</div>
                          <div className="stat-value">28.1k</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-label">AVG. COMMENTS</div>
                          <div className="stat-value">141</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-label">ENGAGEMENT RATE</div>
                          <div className="stat-value">2.40%</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-label">VIEW RATE</div>
                          <div className="stat-value">33.75%</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="engagement-metrics">
                    <div className="metric-section">
                      <div className="metric-header">
                        <h3>LIKES - COMMENTS RATIO</h3>
                        <div className="info-icon">i</div>
                      </div>

                      <div className="metric-value-container">
                        <div className="metric-value">0.61</div>
                        <div className="metric-badge">Average</div>
                      </div>

                      <div className="metric-description">
                        Average ratio for similar influencers is around 0.96
                      </div>
                    </div>

                    <div className="metric-section">
                      <div className="metric-header">
                        <h3>REEL VIEWS TO FOLLOWERS RATIO</h3>
                        <div className="info-icon">i</div>
                      </div>

                      <div className="metric-value-container">
                        <div className="metric-value">33.75</div>
                        <div className="metric-badge good">Good</div>
                      </div>

                      <div className="metric-description">
                        Similar accounts generate around 24.65 views per 100
                        followers.
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "platforms" && (
                <div className="platforms-content">
                  <div className="platform-user">
                    <div className="instagram-icon">
                      <FaInstagram size={22} />
                    </div>
                    <div className="platform-username">@srkkingk555</div>
                    <div className="platform-influence-score">7.88</div>
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
                      <div className="metric-value">15.6k</div>
                      <div className="metric-value">96</div>
                      <div className="metric-value">397.2k</div>
                      <div className="metric-value">174.7k</div>
                      <div className="metric-value">1.33%</div>
                    </div>
                  </div>

                  <div className="content-section">
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
                            <div className="category-name">
                              Arts & Entertainment
                            </div>
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
                            <div className="category-name">
                              Health & Fitness
                            </div>
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
                </div>
              )}
              {(activeTab === "content" ||
                activeTab === "audience" ||
                activeTab === "growth" ||
                activeTab === "brands" ||
                activeTab === "download-pdf" ||
                activeTab === "instagram-profile") && (
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
