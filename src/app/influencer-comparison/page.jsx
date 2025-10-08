"use client";

import React, { useState, useEffect } from "react";
import { FiShare2 } from "react-icons/fi";
import { BsInstagram } from "react-icons/bs";
import {
  AiOutlineYoutube,
  AiOutlineUser,
  AiOutlineHeart,
  AiOutlineClockCircle,
  AiOutlinePicture,
} from "react-icons/ai";
import { RiVideoLine } from "react-icons/ri";
import { VscGraph } from "react-icons/vsc";
import { BiChevronDown } from "react-icons/bi";
import { BsBarChart } from "react-icons/bs";
import CollapsibleSidebar from "../../../components/layout/CollapsibleSidebar";

// Custom components
import AddInfluencerPopup from "../../../components/influencerComparison/AddInfluencerPopup";
import InfluencerCard from "../../../components/influencerComparison/InfluencerCard";
import InfluencerCardSkeletonLoader from "../../../components/influencerComparison/InfluencerCardSkeletonLoader";
import MetricsSection from "../../../components/influencerComparison/MetricsSection";

// Helper functions
import {
  fetchInfluencerData,
  calculateEngagementMetrics,
  generateInsights,
  processContentCategories,
  getPaidPartnershipMetrics,
} from "../../../utils/influencerComparisonHelpers";

import "../../../components/layout/MainLayout.scss";
import "../../../components/layout/Sidebar.scss";
import "../../../components/layout/CollapsibleSidebar.scss";
import "./influencer-comparison.scss";
import "./metrics-styles.scss";
import "../../../components/influencerComparison/audience-section.scss";

const InfluencerComparisonPage = () => {
  // State for accordion sections
  const [openSections, setOpenSections] = useState({
    overview: true,
    engagements: true,
    paidPartnerships: true,
    content: true,
    audience: true,
    growth: true,
    brands: true,
  });

  // State for add influencer popup
  const [showAddInfluencerPopup, setShowAddInfluencerPopup] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [influencers, setInfluencers] = useState([null, null, null, null]);

  // State for profile data
  const [influencerData, setInfluencerData] = useState([
    null,
    null,
    null,
    null,
  ]);
  const [loadingStates, setLoadingStates] = useState([
    false,
    false,
    false,
    false,
  ]);
  const [metricsLoaded, setMetricsLoaded] = useState(false);

  // Effect to fetch data when influencers change
  useEffect(() => {
    // Process each influencer to load its data
    influencers.forEach((influencer, index) => {
      if (influencer && !influencerData[index]) {
        fetchInfluencerProfile(influencer.username, index);
      }
    });
  }, [influencers]);

  // Function to fetch influencer profile data
  const fetchInfluencerProfile = async (username, slotIndex) => {
    // Update loading state for this slot
    setLoadingStates((prev) => {
      const newState = [...prev];
      newState[slotIndex] = true;
      return newState;
    });

    try {
      // Fetch profile data
      const profileData = await fetchInfluencerData(username);

      // Calculate additional metrics
      const engagement = calculateEngagementMetrics(profileData);
      const insights = generateInsights(profileData);
      const contentCategories = processContentCategories(profileData);
      const paidPartnerships = getPaidPartnershipMetrics(profileData);

      // Create enhanced data object
      const enhancedData = {
        ...profileData,
        engagement,
        insights,
        contentCategories,
        paidPartnerships,
        audience: profileData.audience || {},
      };

      // Update data for this slot
      setInfluencerData((prev) => {
        const newData = [...prev];
        newData[slotIndex] = enhancedData;
        return newData;
      });

      // Set metrics as loaded after a short delay for animation
      setTimeout(() => {
        setMetricsLoaded(true);
      }, 500);
    } catch (error) {
      console.error(`Error loading profile for slot ${slotIndex}:`, error);
    } finally {
      // Update loading state
      setLoadingStates((prev) => {
        const newState = [...prev];
        newState[slotIndex] = false;
        return newState;
      });
    }
  };

  // Toggle accordion sections
  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Open add influencer popup for a specific slot
  const handleOpenAddInfluencerPopup = (slotIndex) => {
    setSelectedSlot(slotIndex);
    setShowAddInfluencerPopup(true);
  };

  // Close add influencer popup
  const handleCloseAddInfluencerPopup = () => {
    setShowAddInfluencerPopup(false);
  };

  // Add influencer to a slot
  const handleAddInfluencer = (profile) => {
    if (selectedSlot !== null) {
      const newInfluencers = [...influencers];
      newInfluencers[selectedSlot] = profile;
      setInfluencers(newInfluencers);
      setShowAddInfluencerPopup(false);
    }
  };

  // Remove influencer from a slot
  const handleRemoveInfluencer = (slotIndex) => {
    // Clear the influencer data
    const newInfluencers = [...influencers];
    const newInfluencerData = [...influencerData];

    newInfluencers[slotIndex] = null;
    newInfluencerData[slotIndex] = null;

    setInfluencers(newInfluencers);
    setInfluencerData(newInfluencerData);
  };

  return (
    <div className="influencer-comparison-container">
      <CollapsibleSidebar activePage="influencer-comparison" />

      <main className="comparison-content">
        <div className="comparison-header">
          <h1>Influencer Comparison</h1>
          <button className="share-button">
            <FiShare2 className="share-icon" />
            <span>Share</span>
          </button>
        </div>

        <div className="platform-toggle">
          <button className="platform-button active">
            <BsInstagram className="platform-icon" />
            <span>INSTAGRAM</span>
          </button>
          <button className="platform-button">
            <AiOutlineYoutube className="platform-icon" />
            <span>YOUTUBE</span>
          </button>
        </div>

        <div className="comparison-slots">
          {[0, 1, 2, 3].map((slotIndex) => (
            <div key={slotIndex} className="comparison-slot">
              {influencers[slotIndex] ? (
                loadingStates[slotIndex] ? (
                  <InfluencerCardSkeletonLoader />
                ) : (
                  <InfluencerCard
                    profile={influencers[slotIndex]}
                    onRemove={() => handleRemoveInfluencer(slotIndex)}
                  />
                )
              ) : (
                <>
                  <div className="avatar-placeholder">
                    <AiOutlineUser className="user-icon" />
                  </div>
                  <button
                    className="add-influencer-button"
                    onClick={() => handleOpenAddInfluencerPopup(slotIndex)}
                  >
                    <span>+ Add Influencer</span>
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="accordion-sections">
          {/* Overview Section */}
          <MetricsSection
            sectionType="overview"
            title="Overview"
            icon={<AiOutlineClockCircle />}
            influencersData={influencerData}
            isOpen={openSections.overview}
            loading={!metricsLoaded}
            onToggle={() => toggleSection("overview")}
          />

          {/* Engagements & Views Section */}
          <MetricsSection
            sectionType="engagements"
            title="Engagements & Views"
            icon={<AiOutlineHeart />}
            influencersData={influencerData}
            isOpen={openSections.engagements}
            loading={!metricsLoaded}
            onToggle={() => toggleSection("engagements")}
          />

          {/* Paid Partnerships - Engagements & Views Section */}
          <MetricsSection
            sectionType="paidPartnerships"
            title="Paid Partnerships - Engagements & Views"
            icon={<AiOutlineHeart />}
            influencersData={influencerData}
            isOpen={openSections.paidPartnerships}
            loading={!metricsLoaded}
            onToggle={() => toggleSection("paidPartnerships")}
          />

          {/* Content Section */}
          <MetricsSection
            sectionType="content"
            title="Content"
            icon={<AiOutlinePicture />}
            influencersData={influencerData}
            isOpen={openSections.content}
            loading={!metricsLoaded}
            onToggle={() => toggleSection("content")}
          />

          {/* Audience Section */}
          <MetricsSection
            sectionType="audience"
            title="Audience"
            icon={<AiOutlineUser />}
            influencersData={influencerData}
            isOpen={openSections.audience}
            loading={!metricsLoaded}
            onToggle={() => toggleSection("audience")}
          />

          {/* Growth Section */}
          <div
            className={`accordion-section ${openSections.growth ? "open" : ""}`}
          >
            <div
              className="section-header"
              onClick={() => toggleSection("growth")}
            >
              <div className="header-left">
                <VscGraph className="section-icon" />
                <h2>Growth</h2>
              </div>
              <BiChevronDown className="chevron-icon" />
            </div>
            <div className="section-content">
              <div className="metrics-row">
                <div className="metric-label">
                  30d Followers Growth Rate
                  <span className="info-icon">ⓘ</span>
                </div>
                {influencerData.map((influencer, index) => (
                  <div key={index} className="metric-value">
                    {!metricsLoaded ? (
                      <div className="skeleton-metric"></div>
                    ) : influencer ? (
                      "2.4%"
                    ) : (
                      "-"
                    )}
                  </div>
                ))}
              </div>

              <div className="metrics-row">
                <div className="metric-label">
                  30d Followers Gain
                  <span className="info-icon">ⓘ</span>
                </div>
                {influencerData.map((influencer, index) => (
                  <div key={index} className="metric-value">
                    {!metricsLoaded ? (
                      <div className="skeleton-metric"></div>
                    ) : influencer ? (
                      "+12.5k"
                    ) : (
                      "-"
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Brands Section */}
          <div
            className={`accordion-section ${openSections.brands ? "open" : ""}`}
          >
            <div
              className="section-header"
              onClick={() => toggleSection("brands")}
            >
              <div className="header-left">
                <BsBarChart className="section-icon" />
                <h2>Brands</h2>
              </div>
              <BiChevronDown className="chevron-icon" />
            </div>
            <div className="section-content">
              <div className="metrics-row">
                <div className="metric-label">
                  Brand Mentions
                  <span className="info-icon">ⓘ</span>
                </div>
                {influencerData.map((influencer, index) => (
                  <div key={index} className="metric-value">
                    {!metricsLoaded ? (
                      <div className="skeleton-metric"></div>
                    ) : influencer && influencer.brandMentions ? (
                      <div className="brand-list">
                        {influencer.brandMentions
                          .slice(0, 3)
                          .map((brand, i) => (
                            <div key={i} className="brand-item">
                              {brand.name}
                            </div>
                          ))}
                      </div>
                    ) : (
                      "-"
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Add Influencer Popup */}
      <AddInfluencerPopup
        isOpen={showAddInfluencerPopup}
        onClose={handleCloseAddInfluencerPopup}
        onAddInfluencer={handleAddInfluencer}
      />
    </div>
  );
};

export default InfluencerComparisonPage;
