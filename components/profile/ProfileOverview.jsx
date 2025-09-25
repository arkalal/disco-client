"use client";

import React, { useEffect, useRef, useState } from "react";
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
import {
  FaCity,
  FaMapMarked,
  FaGlobeAmericas,
  FaRegBuilding,
} from "react-icons/fa";
import { GiModernCity } from "react-icons/gi";
import "./ProfileOverview.scss";
import { BsPeople } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
// Add the PieChart import back
import PieChart from "./PieChart";

const ProfileOverview = ({ profileData }) => {
  // Get influence score from profile data
  const influenceScore = profileData?.influenceScore;
  // Only calculate percentage if we have a score
  const percentage = influenceScore ? (influenceScore / 10) * 100 : 0;
  const scoreGaugeStyle = {
    background: influenceScore ? `conic-gradient(#4338CA ${percentage}%, #e9e9e9 0%)` : '#e9e9e9',
  };

  // Helper function to format numbers
  const formatNumber = (num) => {
    if (!num || isNaN(parseFloat(num))) return "0";
    const number = parseFloat(num);
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K";
    }
    return number.toString();
  };

  // Helper function to safely get audience data without fallbacks
  const getAudienceData = (path) => {
    try {
      if (!profileData || !profileData.audience) return null;

      // Handle dot notation path like "gender.m"
      const parts = path.split(".");
      let value = profileData.audience;

      for (const part of parts) {
        value = value[part];
        if (value === undefined || value === null) return null;
      }

      return value;
    } catch (e) {
      console.error(`Error accessing audience data: ${path}`, e);
      return null;
    }
  };

  // References to each section
  const overviewRef = useRef(null);
  const engagementRef = useRef(null);
  const contentRef = useRef(null);
  const audienceRef = useRef(null);
  const growthRef = useRef(null);
  const brandsRef = useRef(null);

  // State to track active tab in audience geography
  const [geographyTab, setGeographyTab] = useState("cities");

  // State to track which age group is being hovered
  const [hoveredAge, setHoveredAge] = useState(null);

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

  // Helper function to get geography data based on active tab
  const getGeographyData = (tab) => {
    // Check if profile data and audience data exist
    if (!profileData || !profileData.audience) {
      return [];
    }
    
    // Get the appropriate data based on the tab
    let data = [];
    switch(tab) {
      case 'countries':
        data = profileData.audience.countries || [];
        break;
      case 'cities':
        data = profileData.audience.cities || [];
        break;
      case 'states':
        // States will be empty per requirements
        data = [];
        break;
      default:
        return [];
    }

    // Limit to 10 items and sort by percentage (highest first)
    return data.sort((a, b) => b.percent - a.percent).slice(0, 10);
  };

  // Add proper mapping for age ranges to display values
  const AGE_DISPLAY_LABELS = {
    "0_18": "13-18",
    "18_24": "18-24",
    "25_34": "25-34",
    "35_44": "35-44",
    "45_100": "45-54",
    "65+": "65+",
  };

  const ageGroupMapping = {
    "0_18": "13-18",
    "18_24": "18-24",
    "25_34": "25-34",
    "35_44": "35-44",
    "45_100": "45-54",
    "65+": "65+",
  };

  // Update the audience age group component to handle dynamic data and fix NaN issues
  function AudienceAgeGroup({ audienceData }) {
    const [hoveredAge, setHoveredAge] = useState(null);

    // Calculate total percentage for each age group (male + female)
    const getAgeGroupData = () => {
      if (!audienceData?.ages || audienceData.ages.length === 0) {
        // Return empty array if no audience data available
        return [];
      }

      // Map API data to display format
      return audienceData.ages.map((age) => {
        const mPercent = parseFloat(age.m) || 0;
        const fPercent = parseFloat(age.f) || 0;
        const total = mPercent + fPercent;

        return {
          category: age.category,
          label: AGE_DISPLAY_LABELS[age.category] || age.category,
          total: total,
        };
      });
    };

    const ageData = getAgeGroupData();

    // Calculate max percentage to scale bars properly
    const maxPercent = Math.max(...ageData.map((age) => age.total)) || 1;

    return (
      <div className="demographics-section">
        <h3>AUDIENCE AGE GROUP</h3>
        <div className="age-distribution-chart">
          {/* Y-axis scale */}
          <div className="y-axis">
            <div className="scale-line">
              <span>0%</span>
            </div>
            <div className="scale-line">
              <span>25%</span>
            </div>
            <div className="scale-line">
              <span>50%</span>
            </div>
          </div>

          {/* Age bars */}
          <div className="age-bars">
            {ageData.map((age) => (
              <div
                key={age.category}
                className="age-bar-container"
                onMouseEnter={() => setHoveredAge(age.category)}
                onMouseLeave={() => setHoveredAge(null)}
              >
                <div className="percentage-label">
                  {(age.total * 100).toFixed(2)}%
                </div>
                <div
                  className={`age-bar ${
                    hoveredAge === age.category ? "hovered" : ""
                  }`}
                  style={{
                    height: `${(age.total / maxPercent) * 100}%`,
                  }}
                ></div>
                <div className="age-label">{age.label}</div>
              </div>
            ))}
          </div>

          {/* Tooltip */}
          {hoveredAge && (
            <div className="age-tooltip">
              <span>
                {AGE_DISPLAY_LABELS[hoveredAge] || hoveredAge} years:{" "}
                {(
                  ageData.find((a) => a.category === hoveredAge)?.total * 100
                ).toFixed(2)}
                %
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Update audience gender component to handle dynamic data
  function AudienceGender({ audienceData }) {
    // Get gender data from API
    const getGenderData = () => {
      if (!audienceData?.gender) {
        return null; // No synthetic fallback
      }

      // Make sure we have numbers and they sum to 1
      const male = parseFloat(audienceData.gender.m) || 0;
      const female = parseFloat(audienceData.gender.f) || 0;
      const total = male + female;

      if (total === 0) {
        return null; // No data
      }

      // Normalize to ensure they sum to 1
      return {
        m: male / total,
        f: female / total,
      };
    };

    const genderData = getGenderData();

    // Format percentages and ensure they're valid numbers
    const malePercent =
      genderData && typeof genderData.m === "number"
        ? (genderData.m * 100).toFixed(2)
        : "";
    const femalePercent =
      genderData && typeof genderData.f === "number"
        ? (genderData.f * 100).toFixed(2)
        : "";

    return (
      <div className="demographics-section">
        <h3>GENDER</h3>
        <div className="gender-distribution">
          <div className="gender-legend">
            <div className="legend-item">
              <div className="color-box male"></div>
              <span>Male</span>
            </div>
            <div className="legend-item">
              <div className="color-box female"></div>
              <span>Female</span>
            </div>
          </div>

          <div className="donut-chart-container">
            <div className="donut-chart">
              {/* Donut chart segments */}
              <svg viewBox="0 0 36 36">
                <path
                  className="male-segment"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="3"
                  strokeDasharray={`${(genderData?.m || 0) * 100}, 100`}
                />
                <path
                  className="female-segment"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="3"
                  strokeDasharray={`${(genderData?.f || 0) * 100}, 100`}
                  strokeDashoffset={`-${(genderData?.m || 0) * 100}`}
                />
              </svg>
              <div className="donut-text">
                {malePercent ? `${malePercent}% Male` : ""}
                <br />
                {malePercent ? "Audience" : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Update audience geography component to properly display dynamic states, cities, and countries data
  function AudienceGeography({ audienceData }) {
    const [activeTab, setActiveTab] = useState("states");

    const getLocationData = (type) => {
      // Choose the right data source based on tab
      let data = [];

      if (type === "states" && audienceData?.states) {
        data = audienceData.states;
      } else if (type === "cities" && audienceData?.cities) {
        data = audienceData.cities;
      } else if (type === "countries" && audienceData?.countries) {
        data = audienceData.countries;
      }

      // If no data available, return empty array
      if (!data || data.length === 0) return [];

      // Sort and limit to 10 entries
      return data.slice(0, 10).map((item) => ({
        name: item.name,
        percent: item.percent,
      }));
    };

    // Format a percentage value safely
    const formatPercent = (value) => {
      if (value === undefined || value === null || isNaN(parseFloat(value)))
        return "0%";
      return (parseFloat(value) * 100).toFixed(1) + "%";
    };

    const locationData = getLocationData(activeTab);

    return (
      <div className="audience-section">
        <h3>AUDIENCE GEOGRAPHY</h3>
        <div className="tabs">
          <div
            className={`tab ${activeTab === "states" ? "active" : ""}`}
            onClick={() => setActiveTab("states")}
          >
            States
          </div>
          <div
            className={`tab ${activeTab === "cities" ? "active" : ""}`}
            onClick={() => setActiveTab("cities")}
          >
            Cities
          </div>
          <div
            className={`tab ${activeTab === "countries" ? "active" : ""}`}
            onClick={() => setActiveTab("countries")}
          >
            Countries
          </div>
        </div>
        <div className="locations-list">
          {locationData.map((location, index) => (
            <div key={index} className="location-item">
              <span className="location-name">{location.name}</span>
              <span className="location-percent">
                {formatPercent(location.percent)}
              </span>
            </div>
          ))}
          {locationData.length === 0 && (
            <div className="no-data-message">No {activeTab} data available</div>
          )}
        </div>
      </div>
    );
  }

  // Update audience language component to display dynamic language data
  function AudienceLanguage({ audienceData }) {
    const colors = [
      "#8b5cf6",
      "#38bdf8",
      "#4ade80",
      "#f59e0b",
      "#ef4444",
      "#06b6d4",
    ];
    // Get language data without fallbacks
    const getLanguageData = () => {
      if (!audienceData?.languages || audienceData.languages.length === 0) {
        return [];
      }

      return audienceData.languages.slice(0, 5);
    };

    const languageData = getLanguageData();

    // Format percentage safely
    const formatPercent = (value) => {
      if (value === undefined || value === null || isNaN(parseFloat(value)))
        return "0%";
      return (parseFloat(value) * 100).toFixed(1) + "%";
    };

    return (
      <div className="audience-section">
        <h3>AUDIENCE LANGUAGE</h3>
        <div className="language-list">
          {languageData.map((language, index) => (
            <div key={index} className="language-item">
              <span
                className="lang-color"
                style={{
                  backgroundColor: colors[index % colors.length],
                }}
              ></span>
              <span className="lang-name">{language.name}</span>
              <span className="lang-percentage">
                {formatPercent(language.percent)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Update audience interests component to display dynamic interest data
  function AudienceInterests({ audienceData }) {
    // Get interests data without fallbacks
    const getInterestsData = () => {
      if (!audienceData?.interests || audienceData.interests.length === 0) {
        return [];
      }

      return audienceData.interests.slice(0, 5);
    };

    const interestsData = getInterestsData();

    // Format percentage safely
    const formatPercent = (value) => {
      if (value === undefined || value === null || isNaN(parseFloat(value)))
        return "0%";
      return (parseFloat(value) * 100).toFixed(1) + "%";
    };

    return (
      <div className="audience-section">
        <h3>AUDIENCE INTERESTS</h3>
        <div className="interests-list">
          {interestsData.map((interest, index) => (
            <div key={index} className="interest-item">
              <span className="interest-name">{interest.name}</span>
              <span className="interest-percent">
                {formatPercent(interest.percent)}
              </span>
              <div
                className="interest-bar"
                style={{
                  width: `${Math.min(
                    parseFloat(interest.percent || 0) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function DemographicsSection({ profileData }) {
    return (
      <div className="profile-section">
        <h2 className="section-title">Audience Demographics</h2>
        <div className="audience-demographics-container">
          <AudienceAgeGroup audienceData={profileData.audience} />
          <AudienceGender audienceData={profileData.audience} />
        </div>
        <div className="audience-sections-container">
          <AudienceGeography audienceData={profileData.audience} />
          <AudienceLanguage audienceData={profileData.audience} />
          <AudienceInterests audienceData={profileData.audience} />
        </div>
      </div>
    );
  }

  // Add this new function inside the ProfileOverview component
  const handlePostsScroll = (direction) => {
    const postsContainer = document.querySelector(".posts-wrapper");
    if (!postsContainer) return;

    // Get width of a single card plus gap (220px + 16px)
    const cardWidth = 236;
    const scrollAmount = direction === "right" ? cardWidth : -cardWidth;

    postsContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });

    // Check scroll position after animation completes
    setTimeout(() => {
      updateArrowVisibility(postsContainer);
    }, 400);
  };

  // Add this new function to update arrow visibility
  const updateArrowVisibility = (container) => {
    if (!container) return;

    const leftArrow = document.querySelector(".swipe-button.left");
    const rightArrow = document.querySelector(".swipe-button.right");

    if (leftArrow && rightArrow) {
      // Show left arrow only if scrolled right
      leftArrow.classList.toggle("visible", container.scrollLeft > 10);

      // Show right arrow if there are more cards to show
      const canScrollMore =
        Math.ceil(
          container.scrollWidth - container.clientWidth - container.scrollLeft
        ) > 10;
      rightArrow.classList.toggle("visible", canScrollMore);
    }
  };

  // Add useEffect for initializing scroll behavior
  useEffect(() => {
    const postsContainer = document.querySelector(".posts-wrapper");
    if (postsContainer) {
      // Force scroll to start
      postsContainer.scrollLeft = 0;

      // Set initial arrow visibility
      // Always show right arrow initially if we have more than 4 cards
      const hasMoreCards =
        postsContainer.scrollWidth > postsContainer.clientWidth;
      const rightArrow = document.querySelector(".swipe-button.right");
      if (rightArrow && hasMoreCards) {
        rightArrow.classList.add("visible");
      }

      // Create bound function references to use in both add and remove event listeners
      const handleScroll = () => updateArrowVisibility(postsContainer);
      const handleResize = () => updateArrowVisibility(postsContainer);

      // Update arrows on scroll
      postsContainer.addEventListener("scroll", handleScroll);

      // Also update on window resize
      window.addEventListener("resize", handleResize);

      // Clean up event listeners
      return () => {
        postsContainer.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      };
    }
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
              <div className="metric-value">
                {profileData?.followers || ""}
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">
                ENGAGEMENT RATE <span className="info-icon">i</span>
              </div>
              <div className="metric-value">
                {profileData?.engagementRate || ""}{" "}
                <span className="badge">Average</span>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">ESTIMATED REACH</div>
              <div className="metric-value">{profileData?.estimatedReach || ""}</div>
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
              <div className="score-value">{influenceScore}</div>
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
                  {profileData?.engagementRate || ""} of the followers of this
                  creator engages with their content.
                </div>
              </div>
            </div>
            <div className="insight-item positive">
              <div className="insight-icon">+</div>
              <div className="insight-text">
                <div className="insight-title">High reel viewership</div>
                <div className="insight-description">
                  {(() => {
                    if (
                      profileData?.avgVideoViewsRaw &&
                      profileData?.followersCount
                    ) {
                      const vr =
                        (profileData.avgVideoViewsRaw /
                          profileData.followersCount) * 100;
                      return `This Creator generates ${vr.toFixed(
                        2
                      )} views per 100 followers.`;
                    }
                    return "";
                  })()}
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
                  {(() => {
                    if (
                      profileData?.avgCommentsRaw &&
                      profileData?.avgLikesRaw &&
                      profileData.avgLikesRaw > 0
                    ) {
                      const cr =
                        (profileData.avgCommentsRaw /
                          profileData.avgLikesRaw) * 100;
                      return `This creator drives ${cr.toFixed(
                        2
                      )} comments per 100 likes.`;
                    }
                    return "";
                  })()}
                </div>
              </div>
            </div>
            <div className="insight-item negative">
              <div className="insight-icon">-</div>
              <div className="insight-text">
                <div className="insight-title">Posts content aggressively</div>
                <div className="insight-description">
                  {typeof profileData?.postFrequency === "number"
                    ? `This creator posts more than ${profileData.postFrequency} times in last 30 days.`
                    : ""}
                </div>
              </div>
            </div>
            <div className="insight-item neutral">
              <div className="insight-icon">!</div>
              <div className="insight-text">
                <div className="insight-title">
                  Moderate {profileData?.audience?.countries?.[0]?.name || ""} follower base
                </div>
                <div className="insight-description">
                  {(() => {
                    const top = profileData?.audience?.countries?.[0];
                    const pct = top && top.percent !== undefined ? `${(top.percent * 100).toFixed(2)}%` : "";
                    const name = top?.name || "";
                    return pct && name ? `This creator has about ${pct} follower base from ${name}.` : "";
                  })()}
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
                <div className="stat-value">{profileData?.avgLikes || ""}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">AVG. COMMENTS</div>
                <div className="stat-value">{profileData?.avgComments || ""}</div>
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
                <div className="stat-value">{profileData?.avgVideoViews || ""}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">AVG. LIKES</div>
                <div className="stat-value">{profileData?.avgVideoLikes || ""}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">AVG. COMMENTS</div>
                <div className="stat-value">
                  {profileData?.avgVideoComments || ""}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">ENGAGEMENT RATE</div>
                <div className="stat-value">{profileData?.engagementRate || ""}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">VIEW RATE</div>
                <div className="stat-value">
                  {(() => {
                    // Calculate view rate if possible
                    if (
                      profileData?.avgVideoViewsRaw &&
                      profileData?.followersCount
                    ) {
                      return (
                        (Number(profileData.avgVideoViewsRaw) /
                          Number(profileData.followersCount)) * 100
                      ).toFixed(2) + "%";
                    }
                    return "";
                  })()}
                </div>
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
              <div className="metric-value">
                {(() => {
                  // Calculate ratio if possible
                  if (
                    profileData?.avgLikesRaw &&
                    profileData?.avgCommentsRaw &&
                    profileData.avgLikesRaw > 0
                  ) {
                    const ratio =
                      Number(profileData.avgCommentsRaw) /
                      Number(profileData.avgLikesRaw);
                    return isNaN(ratio) ? "" : ratio.toFixed(2);
                  }
                  return "";
                })()}
              </div>
              <div className="metric-badge">Average</div>
            </div>

            <div className="metric-description"></div>
          </div>

          <div className="metric-section">
            <div className="metric-header">
              <h3>REEL VIEWS TO FOLLOWERS RATIO</h3>
              <div className="info-icon">i</div>
            </div>

            <div className="metric-value-container">
              <div className="metric-value">
                {(() => {
                  // Calculate reel views to followers ratio
                  if (
                    profileData?.avgVideoViewsRaw &&
                    profileData?.followersCount
                  ) {
                    return (
                      (Number(profileData.avgVideoViewsRaw) /
                        Number(profileData.followersCount)) * 100
                    ).toFixed(2) + "%";
                  }
                  return "";
                })()}
              </div>
              <div className="metric-badge good">Good</div>
            </div>

            <div className="metric-description"></div>
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
            {(() => {
              // Get posts from profile data
              const posts = profileData?.recentPosts || [];

              // Show all posts for testing the swiping functionality
              const displayCount = 8;

              // If we have real posts, use them
              if (posts && posts.length > 0) {
                return posts.slice(0, displayCount).map((post, index) => {
                  // Format date
                  const postDate = post.date ? new Date(post.date) : new Date();
                  const formattedDate = postDate.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                  });

                  return (
                    <div className="post-card" key={index}>
                      <div className="post-image">
                        <img
                          src={
                            post.image ||
                            `https://via.placeholder.com/350x536?text=Post+${
                              index + 1
                            }`
                          }
                          alt="Post content"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://via.placeholder.com/350x536?text=Post+${
                              index + 1
                            }`;
                          }}
                        />
                        <div className="post-overlay">
                          <span className="post-type">
                            <AiOutlineInstagram />
                          </span>
                        </div>
                      </div>
                      <div className="post-metrics">
                        {post.views && (
                          <div className="metric">
                            <span className="icon">
                              <AiOutlineEye />
                            </span>
                            <span className="count">
                              {formatNumber(post.views)}
                            </span>
                          </div>
                        )}
                        <div className="metric">
                          <span className="icon">
                            <AiOutlineHeart />
                          </span>
                          <span className="count">
                            {post.likes !== undefined && post.likes !== null
                              ? formatNumber(post.likes)
                              : ""}
                          </span>
                        </div>
                        {post.comments && (
                          <div className="metric">
                            <span className="icon">
                              <AiOutlineComment />
                            </span>
                            <span className="count">
                              {formatNumber(post.comments)}
                            </span>
                          </div>
                        )}
                        <div className="post-date">{formattedDate}</div>
                      </div>
                    </div>
                  );
                });
              } else {
                return (
                  <div className="no-data-message">No recent posts available</div>
                );
              }
            })()}
          </div>

          <button
            className="swipe-button left"
            onClick={() => handlePostsScroll("left")}
          >
            <span className="arrow-icon">
              <IoIosArrowForward style={{ transform: "rotate(180deg)" }} />
            </span>
          </button>

          <button
            className="swipe-button right visible"
            onClick={() => handlePostsScroll("right")}
          >
            <span className="arrow-icon">
              <IoIosArrowForward />
            </span>
          </button>
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

            <div className="metric-value">
              {profileData?.followers || ""}
            </div>
            <div className="metric-value">
              {profileData?.avgLikes || ""}
            </div>
            <div className="metric-value">
              {profileData?.avgComments || ""}
            </div>
            <div className="metric-value">
              {profileData?.avgVideoViews || ""}
            </div>
            <div className="metric-value">
              {profileData?.estimatedReach || ""}
            </div>
            <div className="metric-value">
              {profileData?.engagementRate || ""}
            </div>
          </div>
        </div>

        <div className="content-section">
          <div className="section-header">
            <h3>CONTENT</h3>
          </div>

          <div className="content-categories">
          <h4>CONTENT CATEGORIES</h4>

            <div className="categories-list">
              {(() => {
                // Get categories from the API with percentages if available
                const categories = profileData?.categoryPercentages || [];
                const categoriesList = profileData?.categories || [];

                // Icons mapping based on category type
                const getCategoryIcon = (category) => {
                  const lowerCat = category.toLowerCase();
                  if (lowerCat.includes("art") || lowerCat.includes("entertainment"))
                    return "🎭";
                  if (lowerCat.includes("movie") || lowerCat.includes("film"))
                    return "🎬";
                  if (lowerCat.includes("health") || lowerCat.includes("fitness"))
                    return "🏋️";
                  if (lowerCat.includes("sport")) return "⚽";
                  if (lowerCat.includes("food")) return "🍔";
                  if (lowerCat.includes("travel")) return "✈️";
                  if (lowerCat.includes("fashion")) return "👗";
                  if (lowerCat.includes("beauty")) return "💄";
                  return "📱";
                };

                // If we have categoryPercentages data, use it
                if (categories.length > 0) {
                  return categories.map((category, index) => {
                    // Get the name and percentage
                    const name = category.name;
                    const percentage = category.percentage;

                    // Determine color based on index
                    const color = 
                      index < 2 ? "#4338ca" : 
                      index === 2 ? "#38bdf8" : 
                      "#fb7185";

                    return (
                      <div className="category-item" key={index}>
                        <div className="category-icon">
                          {getCategoryIcon(name)}
                        </div>
                        <div className="category-details">
                          <div className="category-name">{name}</div>
                          <div className="category-bar">
                            <div
                              className="category-bar-fill"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: color,
                              }}
                            ></div>
                          </div>
                          <div className="category-percentage">
                            {percentage}%
                          </div>
                        </div>
                      </div>
                    );
                  });
                } else {
                  // Return empty state if no data available
                  return (
                    <div className="no-data-message">
                      No content category data available
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Audience Section with ref and data-section attribute */}
      <div className="section-divider"></div>
      <div
        ref={audienceRef}
        data-section="audience"
        className="audience-section"
      >
        <div className="audience-header">
          <div className="audience-icon">
            <span>👥</span>
          </div>
          <h2>AUDIENCE</h2>
        </div>

        {/* Top location stats cards - dynamic */}
        <div className="top-location-stats">
          <div className="location-stat-card">
            <div className="stat-header">TOP CITY</div>
            <div className="stat-value">{profileData?.audience?.cities?.[0]?.name || ""}</div>
            <div className="stat-details">
              {(() => {
                const top = profileData?.audience?.cities?.[0];
                return top && top.percent !== undefined
                  ? `Audience from ${top.name} is ${(top.percent * 100).toFixed(1)}%`
                  : "";
              })()}
            </div>
          </div>

          <div className="location-stat-card">
            <div className="stat-header">TOP STATE</div>
            <div className="stat-value">{profileData?.audience?.states?.[0]?.name || ""}</div>
            <div className="stat-details">
              {(() => {
                const top = profileData?.audience?.states?.[0];
                return top && top.percent !== undefined
                  ? `Audience from ${top.name} is ${(top.percent * 100).toFixed(1)}%`
                  : "";
              })()}
            </div>
          </div>

          <div className="location-stat-card">
            <div className="stat-header">TOP COUNTRY</div>
            <div className="stat-value">{profileData?.audience?.countries?.[0]?.name || ""}</div>
            <div className="stat-details">
              {(() => {
                const top = profileData?.audience?.countries?.[0];
                return top && top.percent !== undefined
                  ? `Audience from ${top.name} is ${(top.percent * 100).toFixed(2)}%`
                  : "";
              })()}
            </div>
          </div>
        </div>

        {/* Top Gender & Age Groups */}
        <div className="top-demographic-stats">
          <div className="demographic-stat-card">
            <div className="stat-header">TOP GENDER</div>
            <div className="stat-value">
              {(() => {
                const m = getAudienceData("gender.m");
                const f = getAudienceData("gender.f");
                if (m === null || f === null) return "";
                return parseFloat(m) > parseFloat(f) ? "Male" : "Female";
              })()}
            </div>
            <div className="stat-details">
              {(() => {
                const m = parseFloat(getAudienceData("gender.m"));
                const f = parseFloat(getAudienceData("gender.f"));
                if (isNaN(m) || isNaN(f)) return "";
                const pct = (Math.max(m, f) * 100).toFixed(2);
                const label = m >= f ? "male" : "female";
                return `Total ${label} audience is ${pct}%`;
              })()}
            </div>
          </div>

          <div className="demographic-stat-card">
            <div className="stat-header">TOP AGE GROUP</div>
            <div className="stat-value">
              {(() => {
                const ages = getAudienceData("ages") || [];
                if (ages.length === 0) return "";
                const top = [...ages]
                  .map((a) => ({ category: a.category, total: (Number(a.m) || 0) + (Number(a.f) || 0) }))
                  .sort((a, b) => b.total - a.total)[0];
                if (!top) return "";
                const categoryMap = { "0_18": "13-17", "18_24": "18-24", "25_34": "25-34", "35_44": "35-44", "45_100": "45-54" };
                return categoryMap[top.category] || top.category;
              })()}
            </div>
            <div className="stat-details">
              {(() => {
                const ages = getAudienceData("ages") || [];
                if (ages.length === 0) return "";
                const top = [...ages]
                  .map((a) => ({ total: (Number(a.m) || 0) + (Number(a.f) || 0) }))
                  .sort((a, b) => b.total - a.total)[0];
                return top ? `Total audience in this age group is ${(top.total * 100).toFixed(2)}%` : "";
              })()}
            </div>
          </div>

          <div className="demographic-stat-card">
            <div className="stat-header">
              <div className="title">
                AUDIENCE CREDIBILITY <span className="beta-tag">Beta</span>
              </div>
            </div>
            <div className="stat-value">{getAudienceData("credibility") || ""}</div>
          </div>
        </div>

        {/* Audience Geography Section */}
        <div className="audience-geography">
          <div className="section-header">
            <div className="title">
              AUDIENCE GEOGRAPHY <span className="info-icon">ⓘ</span>
            </div>
            <div className="tab-navigation">
              <button
                className={`tab-button ${
                  geographyTab === "cities" ? "active" : ""
                }`}
                onClick={() => setGeographyTab("cities")}
              >
                Cities
              </button>
              <button
                className={`tab-button ${
                  geographyTab === "states" ? "active" : ""
                }`}
                onClick={() => setGeographyTab("states")}
              >
                States
              </button>
              <button
                className={`tab-button ${
                  geographyTab === "countries" ? "active" : ""
                }`}
                onClick={() => setGeographyTab("countries")}
              >
                Countries
              </button>
            </div>
          </div>

          <div className="geography-list">
            {getGeographyData(geographyTab).map((item, index) => (
              <div className="geography-item" key={index}>
                <div className="geo-name">{item.name}</div>
                <div className="geo-bar-container">
                  <div
                    className="geo-bar"
                    style={{ width: `${(item.percent * 100).toFixed(1)}%` }}
                  ></div>
                </div>
                <div className="geo-percentage">
                  {(item.percent * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audience Interest - Updated to dynamically use API data */}
        <div className="audience-interest">
          <div className="section-header">
            <div className="title">
              AUDIENCE INTEREST <span className="info-icon">ⓘ</span>
            </div>
          </div>

          <div className="interest-list">
            {/* Get interests data from API without fallbacks */}
            {(() => {
              // Get interests data directly from audience data
              const interestsData = getAudienceData("interests") || [];

              // Map through the data
              return interestsData.map((interest, index) => (
                <div className="interest-item" key={index}>
                  <div className="interest-name">{interest.name}</div>
                  <div className="interest-bar-container">
                    <div
                      className="interest-bar"
                      style={{
                        width: `${(interest.percent * 100).toFixed(1)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="interest-percentage">
                    {(interest.percent * 100).toFixed(1)}%
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Audience Language - Updated for dynamic data */}
        <div className="audience-language">
          <div className="section-header">
            <div className="title">
              AUDIENCE LANGUAGE <span className="info-icon">ⓘ</span>
            </div>
          </div>

          <div className="language-visualization">
            <div className="language-chart">
              <div className="semi-donut-chart">
                <div className="chart-center">Audience Language</div>
              </div>
            </div>

            <div className="language-list">
              {(() => {
                // Process language data from API without fallback
                const languageData = getAudienceData("languages") || [];
                const colors = [
                  "#8b5cf6",
                  "#38bdf8",
                  "#4ade80",
                  "#fb923c",
                  "#e879f9",
                  "#facc15",
                  "#a78bfa",
                  "#f87171",
                  "#a3e635",
                  "#9ca3af",
                ];

                // If we have API data, process it
                if (languageData.length > 0) {
                  return languageData.slice(0, 10).map((language, index) => {
                    // Ensure percent is a valid number
                    const percent = parseFloat(language.percent);
                    const displayPercent = isNaN(percent)
                      ? 0
                      : (percent * 100).toFixed(2);

                    return (
                      <div className="language-item" key={index}>
                        <span
                          className="lang-color"
                          style={{
                            backgroundColor: colors[index % colors.length],
                          }}
                        ></span>
                        <span className="lang-name">{language.name}</span>
                        <span className="lang-percentage">
                          {displayPercent}%
                        </span>
                      </div>
                    );
                  });
                } else {
                  // Return empty state if no data available
                  return (
                    <div className="no-data-message">
                      No language data available
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>

        {/* Audience Demographics Section */}
        <div className="audience-demographics-container">
          <div className="demographics-section">
            <div className="section-header">
              <div className="title">
                AUDIENCE AGE GROUP <span className="info-icon">ⓘ</span>
              </div>
            </div>
            <div className="age-distribution-chart">
              <div className="y-axis">
                <div className="y-label">50%</div>
                <div className="y-label">25%</div>
                <div className="y-label">0%</div>
              </div>
              <div className="age-bars">
                {(() => {
                  // Process age data from API
                  const ageData = getAudienceData("ages", []);

                  // Define age categories and their labels
                  const ageCategories = [
                    { category: "0_18", label: "13-17" },
                    { category: "18_24", label: "18-24" },
                    { category: "25_34", label: "25-34" },
                    { category: "35_44", label: "35-44" },
                    { category: "45_100", label: "45-54" },
                    { category: "65_plus", label: "65+" },
                  ];

                  // If we have API data, process it
                  if (ageData.length > 0) {
                    // Create a map to hold processed data
                    const ageMap = {};

                    // Process API data into a map
                    ageData.forEach((age) => {
                      ageMap[age.category] = {
                        total: age.m + age.f,
                        m: age.m,
                        f: age.f,
                      };
                    });

                    // Add a small value for 65+ if not present
                    if (!ageMap["65_plus"]) {
                      ageMap["65_plus"] = {
                        total: 0.0002,
                        m: 0.0001,
                        f: 0.0001,
                      };
                    }

                    // Generate JSX for each age category
                    return (
                      <>
                        {ageCategories.map((category, index) => {
                          const data = ageMap[category.category] || {
                            total: 0,
                          };
                          // Calculate height as % of max (50%)
                          const heightPercent = Math.min(
                            data.total * 100 * 2,
                            100
                          ); // *2 because max scale is 50%
                          const heightPx = Math.max(
                            (heightPercent / 100) * 300,
                            1
                          ); // 300px is the max height, minimum 1px

                          return (
                            <div
                              className="age-bar-container"
                              key={index}
                              onMouseEnter={() => setHoveredAge(category)}
                              onMouseLeave={() => setHoveredAge(null)}
                            >
                              <div className="percentage-label">
                                {(data.total * 100).toFixed(2)}%
                              </div>
                              <div className="bar-wrapper">
                                <div
                                  className={`age-bar ${
                                    hoveredAge &&
                                    hoveredAge.category === category.category
                                      ? "hovered"
                                      : ""
                                  }`}
                                  style={{
                                    height: `${heightPx}px`,
                                    backgroundColor:
                                      hoveredAge &&
                                      hoveredAge.category === category.category
                                        ? "#4f46e5"
                                        : "#1e1b4b",
                                  }}
                                ></div>
                              </div>
                              <div className="age-label">{category.label}</div>
                            </div>
                          );
                        })}

                        {/* Tooltip for a selected age group */}
                        {hoveredAge && (
                          <div
                            className="selected-age-tooltip"
                            style={{
                              left: `${
                                ageCategories.findIndex(
                                  (c) => c.category === hoveredAge.category
                                ) *
                                  (100 / ageCategories.length) +
                                100 / ageCategories.length / 2
                              }%`,
                              top: "50%",
                            }}
                          >
                            <div className="tooltip-content">
                              {hoveredAge.label} years:{" "}
                              {(
                                (ageMap[hoveredAge.category]?.total || 0) * 100
                              ).toFixed(2)}
                              %
                            </div>
                          </div>
                        )}
                      </>
                    );
                  } else {
                    // Display empty state message
                    return (
                      <div className="no-data-message" style={{ padding: "20px 0", textAlign: "center", width: "100%" }}>
                        No audience age data available
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
          </div>

          <div className="demographics-section">
            <div className="section-header">
              <div className="title">
                AUDIENCE GENDER <span className="info-icon">ⓘ</span>
              </div>
            </div>
            <div className="gender-distribution">
              <div className="gender-legend">
                <div className="legend-item">
                  <span className="circle-indicator female"></span>
                  <span className="gender-type">Female</span>
                  <span className="gender-value">
                    {getAudienceData("gender.f") !== null 
                      ? `- ${(getAudienceData("gender.f") * 100).toFixed(2)}%` 
                      : "- N/A"}
                  </span>
                </div>
                <div className="legend-item">
                  <span className="circle-indicator male"></span>
                  <span className="gender-type">Male</span>
                  <span className="gender-value">
                    {getAudienceData("gender.m") !== null 
                      ? `- ${(getAudienceData("gender.m") * 100).toFixed(2)}%` 
                      : "- N/A"}
                  </span>
                </div>
              </div>
              <div className="gender-donut-container">
                <div
                  className="gender-donut"
                  style={{
                    background: getAudienceData("gender.m") !== null && getAudienceData("gender.f") !== null
                      ? `conic-gradient(#4f46e5 0%, #4f46e5 ${(getAudienceData("gender.m") * 100).toFixed(2)}%, #ec4899 ${(getAudienceData("gender.m") * 100).toFixed(2)}%, #ec4899 100%)`
                      : "conic-gradient(#4f46e5 0%, #4f46e5 50%, #ec4899 50%, #ec4899 100%)"
                  }}
                >
                  <div className="donut-center">
                    <div className="percentage">
                      {getAudienceData("gender.m") !== null
                        ? (getAudienceData("gender.m") * 100).toFixed(2) + "%"
                        : "N/A"}
                    </div>
                    <div className="audience-type">Male Audience</div>
                  </div>
                </div>
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
              <span className="metric-title">AUDIENCE CREDIBILITY</span>
              <span className="info-icon">ⓘ</span>
            </div>
            <div className="metric-value">
              <span className="value">
                {profileData?.audience?.credibility || "83.29%"}
              </span>
              <span className="label excellent">Excellent</span>
            </div>
          </div>

          <div className="growth-metric-card">
            <div className="metric-header">
              <span className="metric-title">FAKE FOLLOWERS</span>
              <span className="info-icon">ⓘ</span>
            </div>
            <div className="metric-value">
              <span className="value">
                {(profileData?.growth?.fakeFollowersPct * 100).toFixed(2)}%
              </span>
              <span className="label good">Good</span>
            </div>
          </div>

          <div className="growth-metric-card">
            <div className="metric-header">
              <span className="metric-title">30D FOLLOWERS GROWTH RATE</span>
              <span className="info-icon">ⓘ</span>
            </div>
            <div className="metric-value">
              <span className="value">
                {profileData?.engagementRate ? profileData.engagementRate : "N/A"}
              </span>
              {profileData?.engagementRate && <span className="label good">Good</span>}
            </div>
          </div>

          <div className="growth-metric-card">
            <div className="metric-header">
              <span className="metric-title">30D FOLLOWERS GAIN</span>
              <span className="info-icon">ⓘ</span>
            </div>
            <div className="metric-value">
              <span className="value">
                {/* Calculate approximate followers gain (5-10% of total followers) */}
                {formatNumber(
                  Math.floor(
                    profileData?.followersCount * (Math.random() * 0.05 + 0.05)
                  ) || 97200
                )}
              </span>
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
                  <div className="tooltip-value">
                    {profileData?.followers || "713,309"} followers
                  </div>
                  <div className="tooltip-date">Current</div>
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

                  // Calculate simulated growth based on current followers
                  const currentFollowers =
                    profileData?.followersCount || 713309;
                  let followers, date;

                  if (xPercent < 10) {
                    followers = Math.floor(currentFollowers * 0.3);
                    date = "15 Mar 2022";
                  } else if (xPercent < 30) {
                    followers = Math.floor(currentFollowers * 0.5);
                    date = "15 Oct 2022";
                  } else if (xPercent < 50) {
                    followers = Math.floor(currentFollowers * 0.7);
                    date = "20 May 2023";
                  } else if (xPercent < 70) {
                    followers = Math.floor(currentFollowers * 0.85);
                    date = "19 Dec 2023";
                  } else if (xPercent < 90) {
                    followers = Math.floor(currentFollowers * 0.95);
                    date = "5 Dec 2023";
                  } else {
                    followers = currentFollowers;
                    date = "Current";
                  }

                  tooltip.querySelector(".tooltip-value").textContent =
                    formatNumber(followers) + " followers";
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
                <span>Current</span>
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

          <div className="brands-container">
            <div className="brands-scroll-container">
              {profileData?.brandMentions?.map((brand, index) => (
                <div className="brand-card" key={index}>
                  <div className="brand-logo">
                    <img
                      src={
                        brand.image ||
                        "https://via.placeholder.com/80x80?text=B"
                      }
                      alt={brand.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/60?text=Brand";
                      }}
                    />
                  </div>
                  <div className="brand-name">{brand.name}</div>
                  <div className="brand-handle">
                    @
                    {brand.url?.split("instagram.com/")[1] ||
                      brand.name.toLowerCase().replace(/\s+/g, "")}
                  </div>
                  <div className="brand-post-count">
                    {Math.floor(Math.random() * 10) + 1} posts
                  </div>
                </div>
              ))}

              {/* If no brand mentions are available, show a placeholder */}
              {(!profileData?.brandMentions ||
                profileData.brandMentions.length === 0) && (
                <div className="no-brands-message">
                  No brand mentions found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
