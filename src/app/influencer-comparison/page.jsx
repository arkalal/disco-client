"use client";

import React, { useState } from "react";
import { FiShare2 } from "react-icons/fi";
import { IoHomeOutline } from "react-icons/io5";
import { BsLightbulb, BsSearch, BsBarChart, BsInstagram } from "react-icons/bs";
import { MdKeyboardArrowDown, MdOutlineAnalytics } from "react-icons/md";
import {
  AiOutlineMessage,
  AiOutlineYoutube,
  AiOutlineUser,
  AiOutlineHeart,
  AiOutlineClockCircle,
  AiOutlinePicture,
} from "react-icons/ai";
import { IconArrowsExchange } from "@tabler/icons-react";
import { RiListCheck2, RiVideoLine } from "react-icons/ri";
import { VscGraph } from "react-icons/vsc";
import { BiNotification, BiChevronDown } from "react-icons/bi";
import Link from "next/link";

import "../../../components/layout/MainLayout.scss";
import "../../../components/layout/Sidebar.scss";
import "./influencer-comparison.scss";

const InfluencerComparisonPage = () => {
  // State for accordion sections
  const [openSections, setOpenSections] = useState({
    overview: true,
    engagements: false,
    paidPartnerships: true,
    content: true,
    audience: true,
    growth: true,
    brands: true,
  });

  // Toggle accordion sections
  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="influencer-comparison-container">
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
          <Link href="/influencer-comparison" className="nav-item active">
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
          {[1, 2, 3, 4].map((slot) => (
            <div key={slot} className="comparison-slot">
              <div className="avatar-placeholder">
                <AiOutlineUser className="user-icon" />
              </div>
              <button className="add-influencer-button">
                <span>+ Add Influencer</span>
              </button>
            </div>
          ))}
        </div>

        <div className="accordion-sections">
          {/* Overview Section */}
          <div
            className={`accordion-section ${
              openSections.overview ? "open" : ""
            }`}
          >
            <div
              className="section-header"
              onClick={() => toggleSection("overview")}
            >
              <div className="header-left">
                <AiOutlineClockCircle className="section-icon" />
                <h2>Overview</h2>
              </div>
              <BiChevronDown className="chevron-icon" />
            </div>
            <div className="section-content">
              <div className="metrics-row">
                <div className="metric-label">Followers</div>
                {[1, 2, 3, 4].map((slot) => (
                  <div key={slot} className="metric-value-placeholder"></div>
                ))}
              </div>
              <div className="metrics-row">
                <div className="metric-label">Engagement Rate</div>
                {[1, 2, 3, 4].map((slot) => (
                  <div key={slot} className="metric-value-placeholder"></div>
                ))}
              </div>
              <div className="metrics-row">
                <div className="metric-label">Estimated Reach</div>
                {[1, 2, 3, 4].map((slot) => (
                  <div key={slot} className="metric-value-placeholder"></div>
                ))}
              </div>
              <div className="metrics-row">
                <div className="metric-label">Influence Score</div>
                {[1, 2, 3, 4].map((slot) => (
                  <div key={slot} className="metric-value-placeholder"></div>
                ))}
              </div>
              <div className="metrics-row">
                <div className="metric-label">Insights</div>
                {[1, 2, 3, 4].map((slot) => (
                  <div key={slot} className="metric-value-placeholder"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Engagements & Views Section */}
          <div
            className={`accordion-section ${
              openSections.engagements ? "open" : ""
            }`}
          >
            <div
              className="section-header"
              onClick={() => toggleSection("engagements")}
            >
              <div className="header-left">
                <AiOutlineHeart className="section-icon" />
                <h2>Engagements & Views</h2>
              </div>
              <BiChevronDown className="chevron-icon" />
            </div>
            <div className="section-content">
              <div className="subsection">
                <div className="subsection-header">
                  <AiOutlinePicture className="subsection-icon" />
                  <h3>Images</h3>
                </div>
                <div className="metrics-row">
                  <div className="metric-label">Avg. Likes</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
                <div className="metrics-row">
                  <div className="metric-label">Avg. Comments</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
                <div className="metrics-row">
                  <div className="metric-label">Engagement Rate</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
              </div>

              <div className="subsection">
                <div className="subsection-header">
                  <RiVideoLine className="subsection-icon" />
                  <h3>Reels</h3>
                </div>
                <div className="metrics-row">
                  <div className="metric-label">Avg. Views</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
                <div className="metrics-row">
                  <div className="metric-label">Avg. Likes</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
                <div className="metrics-row">
                  <div className="metric-label">Avg. Comments</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
                <div className="metrics-row">
                  <div className="metric-label">Engagement Rate</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
                <div className="metrics-row">
                  <div className="metric-label">View Rate</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
              </div>

              <div className="subsection">
                <div className="metrics-row">
                  <div className="metric-label">Likes - Comments Ratio</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
                <div className="metrics-row">
                  <div className="metric-label">
                    Reel Views To Followers Ratio
                  </div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
                <div className="metrics-row">
                  <div className="metric-label">Post Frequency</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Paid Partnerships - Engagements & Views Section */}
          <div
            className={`accordion-section ${
              openSections.paidPartnerships ? "open" : ""
            }`}
          >
            <div
              className="section-header"
              onClick={() => toggleSection("paidPartnerships")}
            >
              <div className="header-left">
                <AiOutlineHeart className="section-icon" />
                <h2>Paid Partnerships - Engagements & Views</h2>
              </div>
              <BiChevronDown className="chevron-icon" />
            </div>
            <div className="section-content">
              <div className="subsection">
                <div className="subsection-header">
                  <AiOutlinePicture className="subsection-icon" />
                  <h3>Images</h3>
                </div>
                <div className="metrics-row">
                  <div className="metric-label">Avg. Likes</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
                <div className="metrics-row">
                  <div className="metric-label">Avg. Comments</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
                <div className="metrics-row">
                  <div className="metric-label">Engagement Rate</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
                <div className="metrics-row">
                  <div className="metric-label">Images Count</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
              </div>

              <div className="subsection">
                <div className="subsection-header">
                  <RiVideoLine className="subsection-icon" />
                  <h3>Reels</h3>
                </div>
                <div className="metrics-row">
                  <div className="metric-label">Avg. Views</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
                <div className="metrics-row">
                  <div className="metric-label">Avg. Likes</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
                <div className="metrics-row">
                  <div className="metric-label">Avg. Comments</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
                <div className="metrics-row">
                  <div className="metric-label">Total Reels</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
                <div className="metrics-row">
                  <div className="metric-label">Engagement Rate</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
                <div className="metrics-row">
                  <div className="metric-label">View Rate</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className={`accordion-section ${openSections.content ? 'open' : ''}`}>
            <div 
              className="section-header" 
              onClick={() => toggleSection('content')}
            >
              <div className="header-left">
                <AiOutlinePicture className="section-icon" />
                <h2>Content</h2>
              </div>
              <BiChevronDown className="chevron-icon" />
            </div>
            <div className="section-content">
              <div className="metrics-row">
                <div className="metric-label">
                  Content Categories
                  <span className="info-icon">ⓘ</span>
                </div>
                {[1, 2, 3, 4].map((slot) => (
                  <div key={slot} className="metric-value-placeholder"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Audience Section */}
          <div className={`accordion-section ${openSections.audience ? 'open' : ''}`}>
            <div 
              className="section-header" 
              onClick={() => toggleSection('audience')}
            >
              <div className="header-left">
                <AiOutlineUser className="section-icon" />
                <h2>Audience</h2>
                <span className="section-info">ⓘ</span>
              </div>
              <BiChevronDown className="chevron-icon" />
            </div>
            <div className="section-content">
              <div className="metrics-row">
                <div className="metric-label">Top Cities</div>
                {[1, 2, 3, 4].map((slot) => (
                  <div key={slot} className="metric-value-placeholder"></div>
                ))}
              </div>
              
              <div className="metrics-row">
                <div className="metric-label">Top States</div>
                {[1, 2, 3, 4].map((slot) => (
                  <div key={slot} className="metric-value-placeholder"></div>
                ))}
              </div>
              
              <div className="metrics-row">
                <div className="metric-label">
                  Audience Credibility
                  <span className="info-icon">ⓘ</span>
                </div>
                {[1, 2, 3, 4].map((slot) => (
                  <div key={slot} className="metric-value-placeholder"></div>
                ))}
              </div>
              
              <div className="metrics-row">
                <div className="metric-label">Top Countries</div>
                {[1, 2, 3, 4].map((slot) => (
                  <div key={slot} className="metric-value-placeholder"></div>
                ))}
              </div>
              
              <div className="metrics-group">
                <div className="metrics-row group-header">
                  <div className="metric-label">Audience Gender</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
                
                <div className="metrics-row submetric">
                  <div className="metric-label">Male</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
                
                <div className="metrics-row submetric">
                  <div className="metric-label">Female</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
              </div>
              
              <div className="metrics-group">
                <div className="metrics-row group-header">
                  <div className="metric-label">Audience Age Group</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
                
                <div className="metrics-row submetric">
                  <div className="metric-label">13-17 years</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
                
                <div className="metrics-row submetric">
                  <div className="metric-label">18-24 years</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
                
                <div className="metrics-row submetric">
                  <div className="metric-label">25-34 years</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
                
                <div className="metrics-row submetric">
                  <div className="metric-label">35-44 years</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
                
                <div className="metrics-row submetric">
                  <div className="metric-label">45-64 years</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
                
                <div className="metrics-row submetric">
                  <div className="metric-label">65+ years</div>
                  {[1, 2, 3, 4].map((slot) => (
                    <div key={slot} className="metric-value-placeholder"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Growth Section */}
          <div className={`accordion-section ${openSections.growth ? 'open' : ''}`}>
            <div 
              className="section-header" 
              onClick={() => toggleSection('growth')}
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
                {[1, 2, 3, 4].map((slot) => (
                  <div key={slot} className="metric-value-placeholder"></div>
                ))}
              </div>
              
              <div className="metrics-row">
                <div className="metric-label">
                  30d Followers Gain
                  <span className="info-icon">ⓘ</span>
                </div>
                {[1, 2, 3, 4].map((slot) => (
                  <div key={slot} className="metric-value-placeholder"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Brands Section */}
          <div className={`accordion-section ${openSections.brands ? 'open' : ''}`}>
            <div 
              className="section-header" 
              onClick={() => toggleSection('brands')}
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
                {[1, 2, 3, 4].map((slot) => (
                  <div key={slot} className="metric-value-placeholder"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InfluencerComparisonPage;
