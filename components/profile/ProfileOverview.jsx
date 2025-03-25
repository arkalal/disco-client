"use client";

import React, { useEffect, useRef } from "react";
import { FaInstagram } from "react-icons/fa";
import { RiHeartLine } from "react-icons/ri";
import { BsInfoCircle } from "react-icons/bs";
import { VscGraph } from "react-icons/vsc";
import {
  AiOutlineInstagram,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineComment,
} from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { RiShoppingBag3Line, RiFileList3Line } from "react-icons/ri";
import "./ProfileOverview.scss";

const ProfileOverview = ({ profileData }) => {
  const percentage = (profileData.influenceScore / 10) * 100;
  const scoreGaugeStyle = {
    background: `conic-gradient(#4338CA ${percentage}%, #e9e9e9 0%)`,
  };

  // References to each section
  const overviewRef = useRef(null);
  const engagementRef = useRef(null);
  const contentRef = useRef(null);
  const audienceRef = useRef(null);
  const growthRef = useRef(null);
  const brandsRef = useRef(null);

  // Function to handle scrolling to sections when tabs are clicked
  const scrollToSection = (sectionName) => {
    // Map section names to their respective refs
    const sectionRefs = {
      overview: overviewRef,
      engagement: engagementRef,
      content: contentRef,
      audience: audienceRef,
      growth: growthRef,
      brands: brandsRef,
    };

    const ref = sectionRefs[sectionName];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Set up scroll spy functionality
  useEffect(() => {
    // Create intersection observer to watch sections
    const observerOptions = {
      root: null, // viewport
      rootMargin: "-100px 0px -300px 0px", // adjust margins to control when sections are considered "visible"
      threshold: 0.1, // percentage of visibility needed
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Get section ID from the observed element's data attribute
          const sectionId = entry.target.dataset.section;

          // Find the tab in the left navigation and activate it
          const tabElement = document.querySelector(
            `.vertical-tab[data-section="${sectionId}"]`
          );
          if (tabElement) {
            // Remove active class from all tabs
            document.querySelectorAll(".vertical-tab").forEach((tab) => {
              tab.classList.remove("active");
            });

            // Add active class to the corresponding tab
            tabElement.classList.add("active");
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      handleIntersection,
      observerOptions
    );

    // Observe all section elements
    const sections = document.querySelectorAll("[data-section]");
    sections.forEach((section) => {
      observer.observe(section);
    });

    // Set up click handlers for the left navigation tabs
    const setupTabClickHandlers = () => {
      const tabs = document.querySelectorAll(".vertical-tab");
      tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          const sectionId = tab.dataset.section;
          if (sectionId) {
            scrollToSection(sectionId);
          }
        });
      });
    };

    // Setup tab click handlers after a short delay to ensure DOM is ready
    setTimeout(setupTabClickHandlers, 500);

    // Cleanup observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="profile-overview">
      {/* Overview Section with ref and data-section attribute */}
      <div ref={overviewRef} data-section="overview">
        <div className="announcement-banner">
          <span className="new-badge">NEW</span>
          <p>Introducing Audience Credibility</p>
          <button className="learn-more-btn">Learn More</button>
        </div>

        <div className="metrics-section">
          <div className="metric-row">
            <div className="metric-card">
              <div className="metric-label">FOLLOWERS</div>
              <div className="metric-value">{profileData.followers}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">
                ENGAGEMENT RATE <span className="info-icon">i</span>
              </div>
              <div className="metric-value">
                {profileData.engagementRate}{" "}
                <span className="badge">Average</span>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">ESTIMATED REACH</div>
              <div className="metric-value">{profileData.estimatedReach}</div>
            </div>
          </div>
        </div>

        <div className="influence-section">
          <div className="influence-header">
            <h3>
              INFLUENCE SCORE <span className="info-icon">i</span>
            </h3>
          </div>
          <div className="score-container">
            <div className="score-gauge" style={scoreGaugeStyle}>
              <div className="score-value">{profileData.influenceScore}</div>
            </div>
            <div className="score-scale">
              <div>1</div>
              <div>10</div>
            </div>
          </div>
        </div>

        <div className="insights-container">
          <h3>INSIGHTS FOR YOU</h3>
          <div className="insights-list">
            <div className="insight-item positive">
              <div className="insight-icon">+</div>
              <div className="insight-text">
                <div className="insight-title">
                  Moderately engaging audience
                </div>
                <div className="insight-description">
                  1.33% of the followers of this creator engages with their
                  content.
                </div>
              </div>
            </div>
            <div className="insight-item positive">
              <div className="insight-icon">+</div>
              <div className="insight-text">
                <div className="insight-title">High reel viewership</div>
                <div className="insight-description">
                  This Creator generates 33.75 views per 100 followers.
                </div>
              </div>
            </div>
            <div className="insight-item positive">
              <div className="insight-icon">+</div>
              <div className="insight-text">
                <div className="insight-title">
                  High ability to drive comments
                </div>
                <div className="insight-description">
                  This creator drives 0.61 comments per 100 likes.
                </div>
              </div>
            </div>
            <div className="insight-item negative">
              <div className="insight-icon">-</div>
              <div className="insight-text">
                <div className="insight-title">Posts content aggressively</div>
                <div className="insight-description">
                  This creator posts more than 68 times in last 30 days.
                </div>
              </div>
            </div>
            <div className="insight-item neutral">
              <div className="insight-icon">!</div>
              <div className="insight-text">
                <div className="insight-title">
                  Moderate Indian follower base
                </div>
                <div className="insight-description">
                  This creator has about 56.99% follower base from India.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Section with ref and data-section attribute */}
      <div className="section-divider"></div>
      <div
        ref={engagementRef}
        data-section="engagement"
        className="engagement-content"
      >
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
              Similar accounts generate around 24.65 views per 100 followers.
            </div>
          </div>
        </div>
      </div>

      {/* Platform Section */}
      <div className="section-divider"></div>
      <div className="platforms-content">
        <div className="platform-user">
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
      </div>

      {/* Content Section with ref and data-section attribute */}
      <div className="section-divider"></div>
      <div
        ref={contentRef}
        data-section="content"
        className="content-section-wrapper"
      >
        <h2 className="section-title">
          <span className="icon">
            <RiFileList3Line />
          </span>
          CONTENT
        </h2>

        <div className="content-header">
          <div className="content-title">CONTENT</div>
          <div className="content-view-all">View All</div>
          <div className="content-tabs">
            <button className="content-tab active">Top Posts</button>
            <button className="content-tab">Recent Posts</button>
            <button className="content-tab">Brand Posts</button>
          </div>
        </div>

        <div className="content-posts-container">
          <div className="posts-wrapper">
            <div className="post-card">
              <div className="post-image">
                <img
                  src="https://via.placeholder.com/350x536?text=Indian+Flag"
                  alt="Post content"
                />
                <div className="post-overlay">
                  <span className="post-type">
                    <AiOutlineInstagram />
                  </span>
                </div>
              </div>
              <div className="post-metrics">
                <div className="metric">
                  <span className="icon">
                    <AiOutlineEye />
                  </span>
                  <span className="count">2.3m</span>
                </div>
                <div className="metric">
                  <span className="icon">
                    <AiOutlineHeart />
                  </span>
                  <span className="count">1.4k</span>
                </div>
                <div className="post-date">15 Aug 24</div>
              </div>
            </div>

            <div className="post-card">
              <div className="post-image">
                <img
                  src="https://via.placeholder.com/350x536?text=Flag+Post"
                  alt="Post content"
                />
                <div className="post-overlay">
                  <span className="post-type">
                    <AiOutlineInstagram />
                  </span>
                </div>
              </div>
              <div className="post-metrics">
                <div className="metric">
                  <span className="icon">
                    <AiOutlineEye />
                  </span>
                  <span className="count">1.8m</span>
                </div>
                <div className="metric">
                  <span className="icon">
                    <AiOutlineHeart />
                  </span>
                  <span className="count">1.2k</span>
                </div>
                <div className="post-date">26 Jan 24</div>
              </div>
            </div>

            <div className="post-card">
              <div className="post-image">
                <img
                  src="https://via.placeholder.com/350x536?text=TV+Appearance"
                  alt="Post content"
                />
                <div className="post-overlay">
                  <span className="post-type">
                    <AiOutlineInstagram />
                  </span>
                </div>
              </div>
              <div className="post-metrics">
                <div className="metric">
                  <span className="icon">
                    <AiOutlineEye />
                  </span>
                  <span className="count">13.4m</span>
                </div>
                <div className="metric">
                  <span className="icon">
                    <AiOutlineHeart />
                  </span>
                  <span className="count">1.7m</span>
                </div>
                <div className="metric">
                  <span className="icon">
                    <AiOutlineComment />
                  </span>
                  <span className="count">113</span>
                </div>
                <div className="post-date">30 Jan 23</div>
              </div>
            </div>

            <div className="post-card">
              <div className="post-image">
                <img
                  src="https://via.placeholder.com/350x536?text=Group+Photo"
                  alt="Post content"
                />
                <div className="post-overlay">
                  <span className="post-type">
                    <AiOutlineInstagram />
                  </span>
                </div>
              </div>
              <div className="post-metrics">
                <div className="metric">
                  <span className="icon">
                    <AiOutlineEye />
                  </span>
                  <span className="count">1.7m</span>
                </div>
                <div className="metric">
                  <span className="icon">
                    <AiOutlineHeart />
                  </span>
                  <span className="count">2.3k</span>
                </div>
                <div className="post-date">04 Jun 24</div>
              </div>
            </div>
          </div>

          <button className="swipe-button right">
            <span className="arrow-icon">
              <IoIosArrowForward />
            </span>
          </button>
        </div>
      </div>

      {/* Audience Section with ref and data-section attribute */}
      <div className="section-divider"></div>
      <div
        ref={audienceRef}
        data-section="audience"
        className="audience-section"
      >
        <h2>AUDIENCE</h2>

        {/* Top Cities, States, Countries, Gender, Age Group */}
        <div className="audience-top-locations">
          <div className="location-card">
            <div className="location-header">TOP CITY</div>
            <div className="location-name">Jakarta</div>
            <div className="location-stat">
              Audience from Jakarta is <span className="stat-value">13.6%</span>
            </div>
          </div>

          <div className="location-card">
            <div className="location-header">TOP STATE</div>
            <div className="location-name">Maharashtra</div>
            <div className="location-stat">
              Audience from Maharashtra is{" "}
              <span className="stat-value">20%</span>
            </div>
          </div>

          <div className="location-card">
            <div className="location-header">TOP COUNTRY</div>
            <div className="location-name">India</div>
            <div className="location-stat">
              Audience from India is <span className="stat-value">56.99%</span>
            </div>
          </div>

          <div className="location-card">
            <div className="location-header">
              AUDIENCE CREDIBILITY <span className="beta-tag">beta</span>
            </div>
            <div className="credibility-score">68.75 %</div>
          </div>

          <div className="location-card">
            <div className="location-header">TOP GENDER</div>
            <div className="location-name">Male</div>
            <div className="location-stat">
              Total male audience is <span className="stat-value">65.04%</span>
            </div>
          </div>

          <div className="location-card">
            <div className="location-header">TOP AGE GROUP</div>
            <div className="location-name">25-34 Years</div>
            <div className="location-stat">
              Total audience in this age group is{" "}
              <span className="stat-value">53.51%</span>
            </div>
          </div>
        </div>

        {/* Audience Geography */}
        <div className="audience-geography">
          <div className="section-header">
            <h3>
              AUDIENCE GEOGRAPHY <BsInfoCircle className="info-icon" />
            </h3>
            <div className="geography-tabs">
              <button className="tab active">Cities</button>
              <button className="tab">States</button>
              <button className="tab">Countries</button>
            </div>
          </div>

          <div className="geography-content">
            <div className="geography-item">
              <div className="geo-name">Jakarta</div>
              <div className="geo-bar-container">
                <div className="geo-bar" style={{ width: "13.6%" }}></div>
              </div>
              <div className="geo-percentage">13.6%</div>
            </div>

            <div className="geography-item">
              <div className="geo-name">Mumbai</div>
              <div className="geo-bar-container">
                <div className="geo-bar" style={{ width: "10.98%" }}></div>
              </div>
              <div className="geo-percentage">10.98%</div>
            </div>

            <div className="geography-item">
              <div className="geo-name">Kolkata</div>
              <div className="geo-bar-container">
                <div className="geo-bar" style={{ width: "7.87%" }}></div>
              </div>
              <div className="geo-percentage">7.87%</div>
            </div>

            <div className="geography-item">
              <div className="geo-name">Delhi</div>
              <div className="geo-bar-container">
                <div className="geo-bar" style={{ width: "6.01%" }}></div>
              </div>
              <div className="geo-percentage">6.01%</div>
            </div>

            <div className="geography-item">
              <div className="geo-name">Bandung</div>
              <div className="geo-bar-container">
                <div className="geo-bar" style={{ width: "4.87%" }}></div>
              </div>
              <div className="geo-percentage">4.87%</div>
            </div>

            <div className="geography-item">
              <div className="geo-name">Ahmedabad</div>
              <div className="geo-bar-container">
                <div className="geo-bar" style={{ width: "4.14%" }}></div>
              </div>
              <div className="geo-percentage">4.14%</div>
            </div>

            <div className="geography-item">
              <div className="geo-name">Pune</div>
              <div className="geo-bar-container">
                <div className="geo-bar" style={{ width: "3.73%" }}></div>
              </div>
              <div className="geo-percentage">3.73%</div>
            </div>

            <div className="geography-item">
              <div className="geo-name">Dhaka</div>
              <div className="geo-bar-container">
                <div className="geo-bar" style={{ width: "3.72%" }}></div>
              </div>
              <div className="geo-percentage">3.71999999999999998%</div>
            </div>
          </div>
        </div>

        {/* Age and Gender */}
        <div className="audience-demographics">
          <div className="audience-age">
            <div className="section-header">
              <h3>
                AUDIENCE AGE GROUP <BsInfoCircle className="info-icon" />
              </h3>
            </div>

            <div className="age-chart">
              <div className="chart-y-axis">
                <div className="y-label">50%</div>
                <div className="y-label">25%</div>
                <div className="y-label">0%</div>
              </div>

              <div className="age-bars">
                <div className="age-bar-container">
                  <div className="age-percentage">2.39%</div>
                  <div className="age-bar" style={{ height: "2.39%" }}></div>
                  <div className="age-label">13-17</div>
                </div>

                <div className="age-bar-container">
                  <div className="age-percentage">27.5%</div>
                  <div className="age-bar" style={{ height: "27.5%" }}></div>
                  <div className="age-label">18-24</div>
                </div>

                <div className="age-bar-container">
                  <div className="age-percentage">53.51%</div>
                  <div className="age-bar" style={{ height: "53.51%" }}></div>
                  <div className="age-label">25-34</div>
                </div>

                <div className="age-bar-container">
                  <div className="age-percentage">13.77%</div>
                  <div className="age-bar" style={{ height: "13.77%" }}></div>
                  <div className="age-label">35-44</div>
                </div>

                <div className="age-bar-container">
                  <div className="age-percentage">2.82%</div>
                  <div className="age-bar" style={{ height: "2.82%" }}></div>
                  <div className="age-label">45-64</div>
                </div>

                <div className="age-bar-container">
                  <div className="age-percentage">0.02%</div>
                  <div className="age-bar" style={{ height: "0.02%" }}></div>
                  <div className="age-label">65+</div>
                </div>
              </div>
            </div>
          </div>

          <div className="audience-gender">
            <div className="section-header">
              <h3>
                AUDIENCE GENDER <BsInfoCircle className="info-icon" />
              </h3>
            </div>

            <div className="gender-legends">
              <div className="gender-legend female">
                <span className="color-dot"></span>
                <span className="gender-label">Female</span>
                <span className="gender-percentage">- 34.96%</span>
              </div>

              <div className="gender-legend male">
                <span className="color-dot"></span>
                <span className="gender-label">Male</span>
                <span className="gender-percentage">- 65.04%</span>
              </div>
            </div>

            <div className="gender-chart">
              <div className="chart-container">
                <div className="gender-donut">
                  <div className="donut-inner">
                    <div className="donut-value">65.04%</div>
                    <div className="donut-label">Male Audience</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audience Interests */}
        <div className="audience-interests">
          <div className="section-header">
            <h3>
              AUDIENCE INTEREST <BsInfoCircle className="info-icon" />
            </h3>
          </div>

          <div className="interests-content">
            <div className="interest-item">
              <div className="interest-name">
                Friends, Family & Relationships
              </div>
              <div className="interest-bar-container">
                <div className="interest-bar" style={{ width: "9.2%" }}></div>
              </div>
              <div className="interest-percentage">9.2%</div>
            </div>

            <div className="interest-item">
              <div className="interest-name">Restaurants, Food & Grocery</div>
              <div className="interest-bar-container">
                <div className="interest-bar" style={{ width: "5.53%" }}></div>
              </div>
              <div className="interest-percentage">5.53%</div>
            </div>

            <div className="interest-item">
              <div className="interest-name">
                Clothes, Shoes, Handbags & Accessories
              </div>
              <div className="interest-bar-container">
                <div className="interest-bar" style={{ width: "8.33%" }}></div>
              </div>
              <div className="interest-percentage">8.33%</div>
            </div>

            <div className="interest-item">
              <div className="interest-name">Travel, Tourism & Aviation</div>
              <div className="interest-bar-container">
                <div className="interest-bar" style={{ width: "5.2%" }}></div>
              </div>
              <div className="interest-percentage">5.2%</div>
            </div>

            <div className="interest-item">
              <div className="interest-name">Camera & Photography</div>
              <div className="interest-bar-container">
                <div className="interest-bar" style={{ width: "8.22%" }}></div>
              </div>
              <div className="interest-percentage">8.22%</div>
            </div>

            <div className="interest-item">
              <div className="interest-name">Art & Design</div>
              <div className="interest-bar-container">
                <div className="interest-bar" style={{ width: "5.03%" }}></div>
              </div>
              <div className="interest-percentage">5.03%</div>
            </div>

            <div className="interest-item">
              <div className="interest-name">Television & Film</div>
              <div className="interest-bar-container">
                <div className="interest-bar" style={{ width: "6.38%" }}></div>
              </div>
              <div className="interest-percentage">6.38%</div>
            </div>

            <div className="interest-item">
              <div className="interest-name">Cars & Motorbikes</div>
              <div className="interest-bar-container">
                <div className="interest-bar" style={{ width: "4.62%" }}></div>
              </div>
              <div className="interest-percentage">4.62%</div>
            </div>

            <div className="interest-item">
              <div className="interest-name">Music</div>
              <div className="interest-bar-container">
                <div className="interest-bar" style={{ width: "6.02%" }}></div>
              </div>
              <div className="interest-percentage">6.02%</div>
            </div>

            <div className="interest-item">
              <div className="interest-name">Electronics & Computers</div>
              <div className="interest-bar-container">
                <div className="interest-bar" style={{ width: "4.23%" }}></div>
              </div>
              <div className="interest-percentage">4.23%</div>
            </div>
          </div>
        </div>

        {/* Audience Language */}
        <div className="audience-language">
          <div className="section-header">
            <h3>
              AUDIENCE LANGUAGE <BsInfoCircle className="info-icon" />
            </h3>
          </div>

          <div className="language-chart-container">
            <div className="language-donut-chart">
              <div className="language-donut">
                <div className="language-label">Audience Language</div>
              </div>
            </div>

            <div className="language-list">
              <div className="language-item">
                <span className="language-color english"></span>
                <span className="language-name">English</span>
                <span className="language-percentage">55%</span>
              </div>

              <div className="language-item">
                <span className="language-color hindi"></span>
                <span className="language-name">Hindi</span>
                <span className="language-percentage">2.88%</span>
              </div>

              <div className="language-item">
                <span className="language-color indonesian"></span>
                <span className="language-name">Indonesian</span>
                <span className="language-percentage">11.59%</span>
              </div>

              <div className="language-item">
                <span className="language-color spanish"></span>
                <span className="language-name">Spanish</span>
                <span className="language-percentage">1.71%</span>
              </div>

              <div className="language-item">
                <span className="language-color arabic"></span>
                <span className="language-name">Arabic</span>
                <span className="language-percentage">7.28%</span>
              </div>

              <div className="language-item">
                <span className="language-color urdu"></span>
                <span className="language-name">Urdu</span>
                <span className="language-percentage">1.71%</span>
              </div>

              <div className="language-item">
                <span className="language-color persian"></span>
                <span className="language-name">Persian</span>
                <span className="language-percentage">5.91%</span>
              </div>

              <div className="language-item">
                <span className="language-color nepali"></span>
                <span className="language-name">Nepali</span>
                <span className="language-percentage">1.55%</span>
              </div>

              <div className="language-item">
                <span className="language-color russian"></span>
                <span className="language-name">Russian</span>
                <span className="language-percentage">4.38%</span>
              </div>

              <div className="language-item">
                <span className="language-color bengali"></span>
                <span className="language-name">Bengali</span>
                <span className="language-percentage">1.32%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Section with ref and data-section attribute */}
      <div className="section-divider"></div>
      <div ref={growthRef} data-section="growth" className="growth-section">
        <h2 className="section-title">
          <span className="icon">
            <VscGraph />
          </span>
          GROWTH
        </h2>

        <div className="growth-metrics">
          <div className="growth-metric-card">
            <div className="metric-header">
              <span className="metric-title">30D FOLLOWERS GROWTH RATE</span>
              <span className="info-icon">ⓘ</span>
            </div>
            <div className="metric-value">
              <span className="value">8.33%</span>
              <span className="label good">Good</span>
            </div>
          </div>

          <div className="growth-metric-card">
            <div className="metric-header">
              <span className="metric-title">30D FOLLOWERS GAIN</span>
              <span className="info-icon">ⓘ</span>
            </div>
            <div className="metric-value">
              <span className="value">97.2k</span>
            </div>
          </div>
        </div>

        <div className="followers-growth">
          <div className="followers-growth-header">
            <div className="title">
              <span>FOLLOWERS GROWTH</span>
              <span className="info-icon">ⓘ</span>
            </div>
            <div className="time-filters">
              <button className="time-filter active">All</button>
              <button className="time-filter">1Y</button>
              <button className="time-filter">6M</button>
              <button className="time-filter">3M</button>
              <button className="time-filter">1M</button>
            </div>
          </div>

          <div className="growth-chart-container">
            <div className="growth-chart">
              {/* Interactive chart with hover functionality - no visible dots/lines */}
              <div id="growthTooltip" className="chart-tooltip">
                <div className="tooltip-content">
                  <div className="tooltip-value">713,309 followers</div>
                  <div className="tooltip-date">on 05 Dec 2023</div>
                </div>
              </div>
              <div
                className="chart-area"
                onMouseMove={(e) => {
                  // Basic functionality to show tooltip on hover
                  const tooltip = document.getElementById("growthTooltip");
                  const chartArea = e.currentTarget;
                  const rect = chartArea.getBoundingClientRect();

                  // Calculate position within chart (percentage)
                  const x = e.clientX - rect.left;
                  const xPercent = (x / rect.width) * 100;

                  // Show tooltip at mouse position
                  tooltip.style.display = "block";
                  tooltip.style.left = x + "px";
                  tooltip.style.top = e.clientY - rect.top - 70 + "px";

                  // Update tooltip content based on x position
                  let value, date;

                  if (xPercent < 10) {
                    value = "250,000 followers";
                    date = "15 Mar 2022";
                  } else if (xPercent < 30) {
                    value = "370,000 followers";
                    date = "15 Oct 2022";
                  } else if (xPercent < 50) {
                    value = "480,000 followers";
                    date = "20 May 2023";
                  } else if (xPercent < 70) {
                    value = "610,000 followers";
                    date = "19 Dec 2023";
                  } else if (xPercent < 90) {
                    value = "713,309 followers";
                    date = "05 Dec 2023";
                  } else {
                    value = "890,000 followers";
                    date = "20 Jul 2024";
                  }

                  tooltip.querySelector(".tooltip-value").textContent = value;
                  tooltip.querySelector(".tooltip-date").textContent =
                    "on " + date;
                }}
                onMouseLeave={() => {
                  // Hide tooltip when not hovering
                  const tooltip = document.getElementById("growthTooltip");
                  tooltip.style.display = "none";
                }}
              >
                {/* No SVG line chart or data points - just the background gradient */}
              </div>
              <div className="chart-dates">
                <span>15 Mar 2022</span>
                <span>15 Oct 2022</span>
                <span>20 May 2023</span>
                <span>19 Dec 2023</span>
                <span>20 Jul 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brands Section with ref and data-section attribute */}
      <div className="section-divider"></div>
      <div ref={brandsRef} data-section="brands" className="brands-section">
        <h2 className="section-title">
          <span className="icon">
            <RiShoppingBag3Line />
          </span>
          BRANDS
        </h2>

        <div className="brand-mentions">
          <div className="mentions-title">
            BRAND MENTIONS <BsInfoCircle />
          </div>

          <div className="brand-filter-tabs">
            <button className="brand-filter active">All</button>
            <button className="brand-filter">Beverages</button>
            <button className="brand-filter">Entertainment</button>
            <button className="brand-filter">Sports</button>
          </div>

          <div className="brand-cards-container">
            <div className="brand-card">
              <div className="brand-logo">
                <img
                  src="https://via.placeholder.com/80x80?text=N"
                  alt="Netflix"
                />
              </div>
              <div className="brand-name">netflix_in</div>
              <div className="brand-handle">@netflix_in</div>
              <div className="brand-post-count">6 posts</div>
            </div>

            <div className="brand-card">
              <div className="brand-logo">
                <img
                  src="https://via.placeholder.com/80x80?text=ISL"
                  alt="Indian Super League"
                />
              </div>
              <div className="brand-name">indiansuperleague</div>
              <div className="brand-handle">@indiansuperleague</div>
              <div className="brand-post-count">3 posts</div>
            </div>

            <div className="brand-card">
              <div className="brand-logo">
                <img
                  src="https://via.placeholder.com/80x80?text=IIFA"
                  alt="IIFA"
                />
              </div>
              <div className="brand-name">iifa</div>
              <div className="brand-handle">@iifa</div>
              <div className="brand-post-count">3 posts</div>
            </div>

            <div className="brand-card">
              <div className="brand-logo">
                <img
                  src="https://via.placeholder.com/80x80?text=RS"
                  alt="Roar With Simba"
                />
              </div>
              <div className="brand-name">roarwithsimba</div>
              <div className="brand-handle">@roarwithsimba</div>
              <div className="brand-post-count">1 post</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
