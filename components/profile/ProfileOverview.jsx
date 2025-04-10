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
  // Use profile data or fallback to defaults for UI consistency
  const influenceScore = profileData?.influenceScore || 7.2;
  const percentage = (influenceScore / 10) * 100;
  const scoreGaugeStyle = {
    background: `conic-gradient(#4338CA ${percentage}%, #e9e9e9 0%)`,
  };

  // Helper function to format numbers
  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  // Helper function to safely get audience data with fallbacks
  const getAudienceData = (path, fallback) => {
    try {
      if (!profileData || !profileData.audience) return fallback;

      // Handle dot notation path like "gender.m"
      const parts = path.split(".");
      let value = profileData.audience;

      for (const part of parts) {
        value = value[part];
        if (value === undefined || value === null) return fallback;
      }

      return value;
    } catch (e) {
      console.error(`Error accessing audience data: ${path}`, e);
      return fallback;
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
    const defaultData = {
      cities: [
        { name: "Jakarta", percent: 0.136 },
        { name: "Mumbai", percent: 0.1098 },
        { name: "Kolkata", percent: 0.0787 },
        { name: "Ahmedabad", percent: 0.0414 },
        { name: "Pune", percent: 0.0373 },
        { name: "Dhaka", percent: 0.0372 },
        { name: "Delhi", percent: 0.035 },
        { name: "Jaipur", percent: 0.032 },
        { name: "Bengaluru", percent: 0.031 },
        { name: "Chennai", percent: 0.029 },
      ],
      states: [
        { name: "Maharashtra", percent: 0.2 },
        { name: "West Bengal", percent: 0.15 },
        { name: "Gujarat", percent: 0.12 },
        { name: "Delhi", percent: 0.1 },
        { name: "Karnataka", percent: 0.09 },
        { name: "Rajasthan", percent: 0.08 },
        { name: "Tamil Nadu", percent: 0.07 },
        { name: "Uttar Pradesh", percent: 0.06 },
        { name: "Kerala", percent: 0.05 },
        { name: "Telangana", percent: 0.04 },
      ],
      countries: [
        { name: "India", percent: 0.5699 },
        { name: "Indonesia", percent: 0.17 },
        { name: "Bangladesh", percent: 0.08 },
        { name: "Pakistan", percent: 0.05 },
        { name: "United States", percent: 0.04 },
        { name: "United Kingdom", percent: 0.03 },
        { name: "Australia", percent: 0.02 },
        { name: "Canada", percent: 0.015 },
        { name: "Germany", percent: 0.01 },
        { name: "France", percent: 0.005 },
      ],
    };

    // Get data from API or use default
    let data = getAudienceData(tab, []);

    // If no data from API, use default data
    if (!data || data.length === 0) {
      data = defaultData[tab] || [];
    }

    // Limit to 10 items and sort by percentage (highest first)
    return data.sort((a, b) => b.percent - a.percent).slice(0, 10);
  };

  // Add proper mapping for age ranges to display values
  const AGE_DISPLAY_LABELS = {
    "0_18": "13-17",
    "18_24": "18-24",
    "25_34": "25-34",
    "35_44": "35-44",
    "45_100": "45-54",
    "65+": "65+",
  };

  const ageGroupMapping = {
    "0_18": "13-17",
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
        // Fallback data if no audience data available
        return [
          { category: "0_18", label: "13-17", total: 0.0239 },
          { category: "18_24", label: "18-24", total: 0.275 },
          { category: "25_34", label: "25-34", total: 0.5351 },
          { category: "35_44", label: "35-44", total: 0.1377 },
          { category: "45_100", label: "45-54", total: 0.0282 },
          { category: "65+", label: "65+", total: 0.0002 },
        ];
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
    // Get gender data from API or use fallback
    const getGenderData = () => {
      if (!audienceData?.gender) {
        return { m: 0.6504, f: 0.3496 }; // Fallback
      }

      // Make sure we have numbers and they sum to 1
      const male = parseFloat(audienceData.gender.m) || 0;
      const female = parseFloat(audienceData.gender.f) || 0;
      const total = male + female;

      if (total === 0) return { m: 0.6504, f: 0.3496 }; // Fallback

      // Normalize to ensure they sum to 1
      return {
        m: male / total,
        f: female / total,
      };
    };

    const genderData = getGenderData();

    // Format percentages and ensure they're valid numbers
    const malePercent =
      typeof genderData.m === "number"
        ? (genderData.m * 100).toFixed(2)
        : "65.00";
    const femalePercent =
      typeof genderData.f === "number"
        ? (genderData.f * 100).toFixed(2)
        : "35.00";

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
                  strokeDasharray={`${genderData.m * 100}, 100`}
                />
                <path
                  className="female-segment"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="3"
                  strokeDasharray={`${genderData.f * 100}, 100`}
                  strokeDashoffset={`-${genderData.m * 100}`}
                />
              </svg>
              <div className="donut-text">
                {malePercent}% Male
                <br />
                Audience
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
      if (value === undefined || value === null || isNaN(value)) return "0%";
      return (value * 100).toFixed(1) + "%";
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
    // Get language data or provide fallback
    const getLanguageData = () => {
      if (!audienceData?.languages || audienceData.languages.length === 0) {
        // Fallback data
        return [
          { name: "English", percent: 0.65 },
          { name: "Spanish", percent: 0.15 },
          { name: "Hindi", percent: 0.1 },
          { name: "French", percent: 0.05 },
          { name: "German", percent: 0.05 },
        ];
      }

      return audienceData.languages.slice(0, 5);
    };

    const languageData = getLanguageData();

    // Format percentage safely
    const formatPercent = (value) => {
      if (value === undefined || value === null || isNaN(value)) return "0%";
      return (value * 100).toFixed(1) + "%";
    };

    return (
      <div className="audience-section">
        <h3>AUDIENCE LANGUAGE</h3>
        <div className="language-list">
          {languageData.map((language, index) => (
            <div key={index} className="language-item">
              <span className="language-name">{language.name}</span>
              <span className="language-percent">
                {formatPercent(language.percent)}
              </span>
              <div
                className="language-bar"
                style={{ width: `${Math.min(language.percent * 100, 100)}%` }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Update audience interests component to display dynamic interest data
  function AudienceInterests({ audienceData }) {
    // Get interests data or provide fallback
    const getInterestsData = () => {
      if (!audienceData?.interests || audienceData.interests.length === 0) {
        // Fallback data
        return [
          { name: "Entertainment", percent: 0.3 },
          { name: "Fashion & Style", percent: 0.25 },
          { name: "Travel", percent: 0.2 },
          { name: "Food & Dining", percent: 0.15 },
          { name: "Technology", percent: 0.1 },
        ];
      }

      return audienceData.interests.slice(0, 5);
    };

    const interestsData = getInterestsData();

    // Format percentage safely
    const formatPercent = (value) => {
      if (value === undefined || value === null || isNaN(value)) return "0%";
      return (value * 100).toFixed(1) + "%";
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
                style={{ width: `${Math.min(interest.percent * 100, 100)}%` }}
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
                {formatNumber(profileData?.followers || 0)}
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">
                ENGAGEMENT RATE <span className="info-icon">i</span>
              </div>
              <div className="metric-value">
                {profileData?.engagementRate || "1.33%"}{" "}
                <span className="badge">Average</span>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">ESTIMATED REACH</div>
              <div className="metric-value">
                {formatNumber(
                  profileData?.estimatedReach ||
                    profileData?.followers * 0.37 ||
                    11500
                )}
              </div>
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
                  {profileData?.engagementRate || "1.33%"} of the followers of
                  this creator engages with their content.
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
                  This creator posts more than{" "}
                  {profileData?.postFrequency || 68} times in last 30 days.
                </div>
              </div>
            </div>
            <div className="insight-item neutral">
              <div className="insight-icon">!</div>
              <div className="insight-text">
                <div className="insight-title">
                  Moderate{" "}
                  {profileData?.audience?.countries?.[0]?.name || "Indian"}{" "}
                  follower base
                </div>
                <div className="insight-description">
                  This creator has about{" "}
                  {profileData?.audience?.countries?.[0]?.percentage ||
                    "56.99%"}{" "}
                  follower base from{" "}
                  {profileData?.audience?.countries?.[0]?.name || "India"}.
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
                <div className="stat-value">
                  {formatNumber(profileData?.stats?.avgLikes || 17400)}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">AVG. COMMENTS</div>
                <div className="stat-value">
                  {formatNumber(profileData?.stats?.avgComments || 124)}
                </div>
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
        <div className="audience-header">
          <div className="audience-icon">
            <span>👥</span>
          </div>
          <h2>AUDIENCE</h2>
        </div>

        {/* Top location stats cards - updated to match image */}
        <div className="top-location-stats">
          <div className="location-stat-card">
            <div className="stat-header">TOP CITY</div>
            <div className="stat-value">
              {getAudienceData("cities", []).length > 0
                ? getAudienceData("cities", [])[0]?.name || "Jakarta"
                : "Jakarta"}
            </div>
            <div className="stat-details">
              Audience from{" "}
              {getAudienceData("cities", []).length > 0
                ? getAudienceData("cities", [])[0]?.name || "Jakarta"
                : "Jakarta"}{" "}
              is{" "}
              {getAudienceData("cities", []).length > 0
                ? `${(getAudienceData("cities", [])[0]?.percent * 100).toFixed(
                    1
                  )}%`
                : "13.6%"}
            </div>
          </div>

          <div className="location-stat-card">
            <div className="stat-header">TOP STATE</div>
            <div className="stat-value">
              {getAudienceData("states", []).length > 0
                ? getAudienceData("states", [])[0]?.name || "Maharashtra"
                : "Maharashtra"}
            </div>
            <div className="stat-details">
              Audience from{" "}
              {getAudienceData("states", []).length > 0
                ? getAudienceData("states", [])[0]?.name || "Maharashtra"
                : "Maharashtra"}{" "}
              is{" "}
              {getAudienceData("states", []).length > 0
                ? `${(getAudienceData("states", [])[0]?.percent * 100).toFixed(
                    1
                  )}%`
                : "20%"}
            </div>
          </div>

          <div className="location-stat-card">
            <div className="stat-header">TOP COUNTRY</div>
            <div className="stat-value">
              {getAudienceData("countries", []).length > 0
                ? getAudienceData("countries", [])[0]?.name || "India"
                : "India"}
            </div>
            <div className="stat-details">
              Audience from{" "}
              {getAudienceData("countries", []).length > 0
                ? getAudienceData("countries", [])[0]?.name || "India"
                : "India"}{" "}
              is{" "}
              {getAudienceData("countries", []).length > 0
                ? `${(
                    getAudienceData("countries", [])[0]?.percent * 100
                  ).toFixed(2)}%`
                : "56.99%"}
            </div>
          </div>
        </div>

        {/* Top Gender & Age Groups */}
        <div className="top-demographic-stats">
          <div className="demographic-stat-card">
            <div className="stat-header">TOP GENDER</div>
            <div className="stat-value">
              {parseFloat(getAudienceData("gender.m", 0.65)) >
              parseFloat(getAudienceData("gender.f", 0.35))
                ? "Male"
                : "Female"}
            </div>
            <div className="stat-details">
              Total{" "}
              {parseFloat(getAudienceData("gender.m", 0.65)) >
              parseFloat(getAudienceData("gender.f", 0.35))
                ? "male"
                : "female"}{" "}
              audience is{" "}
              {parseFloat(getAudienceData("gender.m", 0.65)) >
              parseFloat(getAudienceData("gender.f", 0.35))
                ? (getAudienceData("gender.m", 0.65) * 100).toFixed(2)
                : (getAudienceData("gender.f", 0.35) * 100).toFixed(2)}
              %
            </div>
          </div>

          <div className="demographic-stat-card">
            <div className="stat-header">TOP AGE GROUP</div>
            <div className="stat-value">
              {(() => {
                // Find the age group with highest percentage
                const ages = getAudienceData("ages", []);
                if (ages.length > 0) {
                  // Calculate total percentage for each age group
                  const ageGroups = ages.map((age) => ({
                    category: age.category,
                    total: age.m + age.f,
                  }));

                  // Sort by total and get the highest
                  ageGroups.sort((a, b) => b.total - a.total);

                  // Format the category name for display
                  const topCategory = ageGroups[0]?.category;
                  if (topCategory) {
                    const categoryMap = {
                      "0_18": "13-17",
                      "18_24": "18-24",
                      "25_34": "25-34",
                      "35_44": "35-44",
                      "45_100": "45-54",
                    };
                    return categoryMap[topCategory] || "25-34 Years";
                  }
                }
                return "25-34 Years";
              })()}
            </div>
            <div className="stat-details">
              Total audience in this age group is{" "}
              {(() => {
                // Calculate the percentage of the top age group
                const ages = getAudienceData("ages", []);
                if (ages.length > 0) {
                  // Calculate total percentage for each age group
                  const ageGroups = ages.map((age) => ({
                    category: age.category,
                    total: age.m + age.f,
                  }));

                  // Sort by total and get the highest
                  ageGroups.sort((a, b) => b.total - a.total);

                  // Return the percentage
                  return (ageGroups[0]?.total * 100).toFixed(2);
                }
                return "53.51";
              })()}
              %
            </div>
          </div>

          <div className="demographic-stat-card">
            <div className="stat-header">
              AUDIENCE CREDIBILITY <span className="beta-tag">Beta</span>
            </div>
            <div className="stat-value">
              {getAudienceData("credibility", "68.75 %")}
            </div>
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
            {/* Get interests data from API with proper fallback */}
            {(() => {
              // Get interests data
              const interestsData = (() => {
                const interestsFromApi = getAudienceData("interests", []);
                if (interestsFromApi.length > 0) {
                  return interestsFromApi;
                }

                // Fallback data if API data not available
                return [
                  { name: "Friends, Family & Relationships", percent: 0.092 },
                  {
                    name: "Clothes, Shoes, Handbags & Accessories",
                    percent: 0.0833,
                  },
                  { name: "Camera & Photography", percent: 0.0822 },
                  { name: "Television & Film", percent: 0.0638 },
                  { name: "Beauty & Cosmetics", percent: 0.0532 },
                  { name: "Travel & Tourism", percent: 0.0487 },
                  { name: "Cars & Motorbikes", percent: 0.0462 },
                  { name: "Electronics & Computers", percent: 0.0423 },
                ];
              })();

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
                // Process language data from API
                const languageData = getAudienceData("languages", []);
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
                  return languageData.slice(0, 10).map((language, index) => (
                    <div className="language-item" key={index}>
                      <span
                        className="lang-color"
                        style={{
                          backgroundColor: colors[index % colors.length],
                        }}
                      ></span>
                      <span className="lang-name">{language.name}</span>
                      <span className="lang-percentage">
                        {(language.percent * 100).toFixed(2)}%
                      </span>
                    </div>
                  ));
                } else {
                  // Fallback static data
                  const fallbackData = [
                    { name: "English", percent: 55 },
                    { name: "Indonesian", percent: 11.59 },
                    { name: "Arabic", percent: 7.28 },
                    { name: "Persian", percent: 5.91 },
                    { name: "Russian", percent: 4.38 },
                    { name: "Hindi", percent: 2.88 },
                    { name: "Spanish", percent: 1.71 },
                    { name: "Urdu", percent: 1.71 },
                    { name: "Nepali", percent: 1.55 },
                    { name: "Bengali", percent: 1.32 },
                  ];

                  return fallbackData.map((language, index) => (
                    <div className="language-item" key={index}>
                      <span
                        className="lang-color"
                        style={{
                          backgroundColor: colors[index % colors.length],
                        }}
                      ></span>
                      <span className="lang-name">{language.name}</span>
                      <span className="lang-percentage">
                        {language.percent}%
                      </span>
                    </div>
                  ));
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
                    // Fallback static data with proper styling
                    const staticData = [
                      {
                        category: "0_18",
                        label: "13-17",
                        percent: 2.39,
                        height: 14,
                      },
                      {
                        category: "18_24",
                        label: "18-24",
                        percent: 27.5,
                        height: 138,
                      },
                      {
                        category: "25_34",
                        label: "25-34",
                        percent: 53.51,
                        height: 268,
                      },
                      {
                        category: "35_44",
                        label: "35-44",
                        percent: 13.77,
                        height: 69,
                      },
                      {
                        category: "45_100",
                        label: "45-54",
                        percent: 2.82,
                        height: 14,
                      },
                      {
                        category: "65_plus",
                        label: "65+",
                        percent: 0.02,
                        height: 1,
                      },
                    ];

                    return (
                      <>
                        {staticData.map((age, index) => (
                          <div
                            className="age-bar-container"
                            key={index}
                            onMouseEnter={() => setHoveredAge(age)}
                            onMouseLeave={() => setHoveredAge(null)}
                          >
                            <div className="percentage-label">
                              {age.percent}%
                            </div>
                            <div className="bar-wrapper">
                              <div
                                className={`age-bar ${
                                  hoveredAge &&
                                  hoveredAge.category === age.category
                                    ? "hovered"
                                    : ""
                                }`}
                                style={{
                                  height: `${age.height}px`,
                                  backgroundColor:
                                    hoveredAge &&
                                    hoveredAge.category === age.category
                                      ? "#4f46e5"
                                      : "#1e1b4b",
                                }}
                              ></div>
                            </div>
                            <div className="age-label">{age.label}</div>
                          </div>
                        ))}

                        {/* Tooltip for hovered age group */}
                        {hoveredAge && (
                          <div
                            className="selected-age-tooltip"
                            style={{
                              left: `${
                                staticData.findIndex(
                                  (a) => a.category === hoveredAge.category
                                ) *
                                  (100 / staticData.length) +
                                100 / staticData.length / 2
                              }%`,
                              top: "50%",
                            }}
                          >
                            <div className="tooltip-content">
                              {hoveredAge.label} years: {hoveredAge.percent}%
                            </div>
                          </div>
                        )}
                      </>
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
                    - {(getAudienceData("gender.f", 0.35) * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="legend-item">
                  <span className="circle-indicator male"></span>
                  <span className="gender-type">Male</span>
                  <span className="gender-value">
                    - {(getAudienceData("gender.m", 0.65) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="gender-donut-container">
                <div
                  className="gender-donut"
                  style={{
                    background: `conic-gradient(#4f46e5 0%, #4f46e5 ${(
                      getAudienceData("gender.m", 0.65) * 100
                    ).toFixed(2)}%, #ec4899 ${(
                      getAudienceData("gender.m", 0.65) * 100
                    ).toFixed(2)}%, #ec4899 100%)`,
                  }}
                >
                  <div className="donut-center">
                    <div className="percentage">
                      {(getAudienceData("gender.m", 0.65) * 100).toFixed(2)}%
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
                {/* Since we don't have growth rate in API, we'll use engagement rate as a fallback */}
                {profileData?.engagementRate || "8.33%"}
              </span>
              <span className="label good">Good</span>
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

          <div className="brand-cards-container">
            {profileData?.brandMentions?.map((brand, index) => (
              <div className="brand-card" key={index}>
                <div className="brand-logo">
                  <img
                    src={
                      brand.image || "https://via.placeholder.com/80x80?text=B"
                    }
                    alt={brand.name}
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
              <div className="no-brands-message">No brand mentions found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
