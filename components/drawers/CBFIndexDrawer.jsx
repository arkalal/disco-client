"use client";

import React, { useEffect, useRef, useState } from 'react';
import { IoClose, IoChevronDown, IoChevronForward } from 'react-icons/io5';
import { RiShieldCheckLine } from 'react-icons/ri';
import { MdOutlinePersonSearch } from 'react-icons/md';
import { GoPeople } from 'react-icons/go';
import './CBFIndexDrawer.scss';

const CBFIndexDrawer = ({ isOpen, onClose, onApply }) => {
  const [activeTab, setActiveTab] = useState('instagram');
  const [sections, setSections] = useState({
    influencerMetrics: true,
    brandSafety: false,
    audienceFitment: false
  });
  
  const [expandedMetrics, setExpandedMetrics] = useState({
    engagementRate: false,
    imagesCPE: false,
    reelsCPE: false,
    cpv: false,
    followersGrowthRate: false,
    politicalMentions: false,
    abusiveWordMentions: false,
    competitionMentions: false,
    audienceLocationCountry: false,
    audienceLocationCities: false,
    audienceGender: false,
    audienceAgeGroup: false
  });
  
  // Toggle states for Instagram
  const [instagramToggles, setInstagramToggles] = useState({
    engagementRate: true,
    imagesCPE: true,
    reelsCPE: true,
    cpv: true,
    followersGrowthRate: true,
    politicalMentions: false,
    abusiveWordMentions: false,
    competitionMentions: false,
    audienceLocationCountry: false,
    audienceLocationCities: false,
    audienceGender: false,
    audienceAgeGroup: false
  });
  
  // Toggle states for YouTube
  const [youtubeToggles, setYoutubeToggles] = useState({
    engagementRate: true,
    imagesCPE: true,
    reelsCPE: true,
    cpv: true,
    followersGrowthRate: true,
    politicalMentions: false,
    abusiveWordMentions: false,
    competitionMentions: false,
    audienceLocationCountry: false,
    audienceLocationCities: false,
    audienceGender: false,
    audienceAgeGroup: false
  });

  const drawerRef = useRef(null);
  const contentRef = useRef(null);
  
  // Close on ESC key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  const toggleSection = (section) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const toggleMetricExpand = (metric) => {
    setExpandedMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };
  
  const toggleMetric = (metric) => {
    if (activeTab === 'instagram') {
      setInstagramToggles(prev => ({
        ...prev,
        [metric]: !prev[metric]
      }));
    } else {
      setYoutubeToggles(prev => ({
        ...prev,
        [metric]: !prev[metric]
      }));
    }
  };

  const handleApply = () => {
    const selectedToggles = activeTab === 'instagram' ? instagramToggles : youtubeToggles;
    onApply({
      platform: activeTab,
      metrics: selectedToggles
    });
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };
  
  const currentToggles = activeTab === 'instagram' ? instagramToggles : youtubeToggles;

  if (!isOpen) return null;

  return (
    <div className="cbf-index-drawer-container">
      <div className="drawer-scrim" onClick={onClose}></div>
      <div 
        ref={drawerRef}
        className="drawer-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cbf-index-title"
      >
        <div className="drawer-header">
          <h2 id="cbf-index-title">Creator Brand Fit (CBF) Index</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close"
          >
            <IoClose size={20} />
          </button>
        </div>

        <div className="platform-tabs">
          <button 
            className={`platform-tab ${activeTab === 'instagram' ? 'active' : ''}`}
            onClick={() => setActiveTab('instagram')}
          >
            Instagram <span className="count">5</span>
          </button>
          <button 
            className={`platform-tab ${activeTab === 'youtube' ? 'active' : ''}`}
            onClick={() => setActiveTab('youtube')}
          >
            YouTube <span className="count">5</span>
          </button>
        </div>
        
        <div className="drawer-scrollable-content" ref={contentRef}>
          <div className="info-card">
            <h3>How to Configure CBF Index?</h3>
            <p>
              To analyze the Creator Brand Fit (CBF) for creators in this campaign plan:
            </p>
            <p>
              <strong>Enable the Metrics:</strong> Choose the specific metrics you want to include in the CBF calculation. <a href="#" className="view-more-link">View More</a>
            </p>
          </div>
          
          {/* Influencer Metrics Section */}
          <div className="metrics-section">
            <div 
              className="section-header"
              onClick={() => toggleSection('influencerMetrics')}
            >
              <div className="section-title">
                <GoPeople className="section-icon" />
                <span>INFLUENCER METRICS</span>
              </div>
              <button className="expand-button">
                {sections.influencerMetrics ? <IoChevronDown /> : <IoChevronForward />}
              </button>
            </div>
            
            {sections.influencerMetrics && (
              <div className="section-content">
                {/* Engagement Rate */}
                <div className="metric-row">
                  <div className="metric-main">
                    <label className="toggle">
                      <input 
                        type="checkbox" 
                        checked={currentToggles.engagementRate} 
                        onChange={() => toggleMetric('engagementRate')} 
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="metric-name">Engagement Rate</span>
                    <button 
                      className="metric-expand"
                      onClick={() => toggleMetricExpand('engagementRate')}
                    >
                      {expandedMetrics.engagementRate ? <IoChevronDown /> : <IoChevronForward />}
                    </button>
                  </div>
                  {expandedMetrics.engagementRate && (
                    <div className="metric-details">
                      <span className="range minimal">Minimal (-10): 0 - 0.05;</span>
                      <span className="range fair">Fair (-5): 0.05 - 0.2;</span>
                      <span className="range moderate">Moderate (5): 0.2 - 1;</span>
                      <span className="range strong">Strong (15): 1 - ...</span>
                    </div>
                  )}
                </div>

                {/* Images CPE */}
                <div className="metric-row">
                  <div className="metric-main">
                    <label className="toggle">
                      <input 
                        type="checkbox" 
                        checked={currentToggles.imagesCPE} 
                        onChange={() => toggleMetric('imagesCPE')} 
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="metric-name">Images CPE</span>
                    <button 
                      className="metric-expand"
                      onClick={() => toggleMetricExpand('imagesCPE')}
                    >
                      {expandedMetrics.imagesCPE ? <IoChevronDown /> : <IoChevronForward />}
                    </button>
                  </div>
                  {expandedMetrics.imagesCPE && (
                    <div className="metric-details">
                      <span className="range low">Low Cost (20): 0 - 0.05;</span>
                      <span className="range affordable">Affordable (15): 0.05 - 0.2;</span>
                      <span className="range moderate">Moderate (5): 0.2 - 1;</span>
                      <span className="range expensive">Expensive (-5): ...</span>
                    </div>
                  )}
                </div>

                {/* Reels CPE */}
                <div className="metric-row">
                  <div className="metric-main">
                    <label className="toggle">
                      <input 
                        type="checkbox" 
                        checked={currentToggles.reelsCPE} 
                        onChange={() => toggleMetric('reelsCPE')} 
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="metric-name">Reels CPE</span>
                    <button 
                      className="metric-expand"
                      onClick={() => toggleMetricExpand('reelsCPE')}
                    >
                      {expandedMetrics.reelsCPE ? <IoChevronDown /> : <IoChevronForward />}
                    </button>
                  </div>
                  {expandedMetrics.reelsCPE && (
                    <div className="metric-details">
                      <span className="range low">Low Cost (20): 0 - 0.05;</span>
                      <span className="range affordable">Affordable (15): 0.05 - 0.2;</span>
                      <span className="range moderate">Moderate (5): 0.2 - 1;</span>
                      <span className="range expensive">Expensive (-5): ...</span>
                    </div>
                  )}
                </div>

                {/* CPV */}
                <div className="metric-row">
                  <div className="metric-main">
                    <label className="toggle">
                      <input 
                        type="checkbox" 
                        checked={currentToggles.cpv} 
                        onChange={() => toggleMetric('cpv')} 
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="metric-name">CPV</span>
                    <button 
                      className="metric-expand"
                      onClick={() => toggleMetricExpand('cpv')}
                    >
                      {expandedMetrics.cpv ? <IoChevronDown /> : <IoChevronForward />}
                    </button>
                  </div>
                  {expandedMetrics.cpv && (
                    <div className="metric-details">
                      <span className="range cheaper">Cheaper (20): 0 - 0.05;</span>
                      <span className="range cheap">Cheap (15): 0.05 - 0.2;</span>
                      <span className="range moderate">Moderate (5): 0.2 - 0.5;</span>
                      <span className="range high">High (-5): ...</span>
                    </div>
                  )}
                </div>

                {/* Followers Growth Rate */}
                <div className="metric-row">
                  <div className="metric-main">
                    <label className="toggle">
                      <input 
                        type="checkbox" 
                        checked={currentToggles.followersGrowthRate} 
                        onChange={() => toggleMetric('followersGrowthRate')} 
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="metric-name">Followers Growth Rate</span>
                    <button 
                      className="metric-expand"
                      onClick={() => toggleMetricExpand('followersGrowthRate')}
                    >
                      {expandedMetrics.followersGrowthRate ? <IoChevronDown /> : <IoChevronForward />}
                    </button>
                  </div>
                  {expandedMetrics.followersGrowthRate && (
                    <div className="metric-details">
                      <span className="range decline">Decline (-10): -100 - 0;</span>
                      <span className="range moderate-negative">Moderate (-5): 0 - 0.01;</span>
                      <span className="range optimal">Optimal (5): 0.01 - 0.5;</span>
                      <span className="range high-growth">High (15): ...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Brand Safety Section */}
          <div className="metrics-section">
            <div 
              className="section-header"
              onClick={() => toggleSection('brandSafety')}
            >
              <div className="section-title">
                <RiShieldCheckLine className="section-icon" />
                <span>BRAND SAFETY</span>
              </div>
              <button className="expand-button">
                {sections.brandSafety ? <IoChevronDown /> : <IoChevronForward />}
              </button>
            </div>
            
            {sections.brandSafety && (
              <div className="section-content">
                {/* Political Mentions */}
                <div className="metric-row">
                  <div className="metric-main">
                    <label className="toggle">
                      <input 
                        type="checkbox" 
                        checked={currentToggles.politicalMentions} 
                        onChange={() => toggleMetric('politicalMentions')} 
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="metric-name">Political Mentions</span>
                    <button 
                      className="metric-expand"
                      onClick={() => toggleMetricExpand('politicalMentions')}
                    >
                      {expandedMetrics.politicalMentions ? <IoChevronDown /> : <IoChevronForward />}
                    </button>
                  </div>
                  {expandedMetrics.politicalMentions && (
                    <div className="metric-details">
                      <span>Analyze political content mentions in creator's posts</span>
                    </div>
                  )}
                </div>
                
                {/* Abusive Word Mentions */}
                <div className="metric-row">
                  <div className="metric-main">
                    <label className="toggle">
                      <input 
                        type="checkbox" 
                        checked={currentToggles.abusiveWordMentions} 
                        onChange={() => toggleMetric('abusiveWordMentions')} 
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="metric-name">Abusive Word Mentions</span>
                    <button 
                      className="metric-expand"
                      onClick={() => toggleMetricExpand('abusiveWordMentions')}
                    >
                      {expandedMetrics.abusiveWordMentions ? <IoChevronDown /> : <IoChevronForward />}
                    </button>
                  </div>
                  {expandedMetrics.abusiveWordMentions && (
                    <div className="metric-details">
                      <span>Analyze abusive language in creator's content</span>
                    </div>
                  )}
                </div>
                
                {/* Competition Mentions */}
                <div className="metric-row">
                  <div className="metric-main">
                    <label className="toggle">
                      <input 
                        type="checkbox" 
                        checked={currentToggles.competitionMentions} 
                        onChange={() => toggleMetric('competitionMentions')} 
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="metric-name">Competition Mentions</span>
                    <button 
                      className="metric-expand"
                      onClick={() => toggleMetricExpand('competitionMentions')}
                    >
                      {expandedMetrics.competitionMentions ? <IoChevronDown /> : <IoChevronForward />}
                    </button>
                  </div>
                  {expandedMetrics.competitionMentions && (
                    <div className="metric-details">
                      <span>Detect competitor brand mentions in creator's content</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Audience Fitment Section */}
          <div className="metrics-section">
            <div 
              className="section-header"
              onClick={() => toggleSection('audienceFitment')}
            >
              <div className="section-title">
                <MdOutlinePersonSearch className="section-icon" />
                <span>AUDIENCE FITMENT</span>
              </div>
              <button className="expand-button">
                {sections.audienceFitment ? <IoChevronDown /> : <IoChevronForward />}
              </button>
            </div>
            
            {sections.audienceFitment && (
              <div className="section-content">
                {/* Audience Location (Country) */}
                <div className="metric-row">
                  <div className="metric-main">
                    <label className="toggle">
                      <input 
                        type="checkbox" 
                        checked={currentToggles.audienceLocationCountry} 
                        onChange={() => toggleMetric('audienceLocationCountry')} 
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="metric-name">Audience Location (Country)</span>
                    <button 
                      className="metric-expand"
                      onClick={() => toggleMetricExpand('audienceLocationCountry')}
                    >
                      {expandedMetrics.audienceLocationCountry ? <IoChevronDown /> : <IoChevronForward />}
                    </button>
                  </div>
                  {expandedMetrics.audienceLocationCountry && (
                    <div className="metric-details">
                      <span>Match creator's audience country distribution with campaign targets</span>
                    </div>
                  )}
                </div>
                
                {/* Audience Location (Cities) */}
                <div className="metric-row">
                  <div className="metric-main">
                    <label className="toggle">
                      <input 
                        type="checkbox" 
                        checked={currentToggles.audienceLocationCities} 
                        onChange={() => toggleMetric('audienceLocationCities')} 
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="metric-name">Audience Location (Cities)</span>
                    <button 
                      className="metric-expand"
                      onClick={() => toggleMetricExpand('audienceLocationCities')}
                    >
                      {expandedMetrics.audienceLocationCities ? <IoChevronDown /> : <IoChevronForward />}
                    </button>
                  </div>
                  {expandedMetrics.audienceLocationCities && (
                    <div className="metric-details">
                      <span>Match creator's audience city distribution with campaign targets</span>
                    </div>
                  )}
                </div>
                
                {/* Audience Gender */}
                <div className="metric-row">
                  <div className="metric-main">
                    <label className="toggle">
                      <input 
                        type="checkbox" 
                        checked={currentToggles.audienceGender} 
                        onChange={() => toggleMetric('audienceGender')} 
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="metric-name">Audience Gender</span>
                    <button 
                      className="metric-expand"
                      onClick={() => toggleMetricExpand('audienceGender')}
                    >
                      {expandedMetrics.audienceGender ? <IoChevronDown /> : <IoChevronForward />}
                    </button>
                  </div>
                  {expandedMetrics.audienceGender && (
                    <div className="metric-details">
                      <span>Match creator's audience gender distribution with campaign targets</span>
                    </div>
                  )}
                </div>
                
                {/* Audience Age Group */}
                <div className="metric-row">
                  <div className="metric-main">
                    <label className="toggle">
                      <input 
                        type="checkbox" 
                        checked={currentToggles.audienceAgeGroup} 
                        onChange={() => toggleMetric('audienceAgeGroup')} 
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="metric-name">Audience Age Group</span>
                    <button 
                      className="metric-expand"
                      onClick={() => toggleMetricExpand('audienceAgeGroup')}
                    >
                      {expandedMetrics.audienceAgeGroup ? <IoChevronDown /> : <IoChevronForward />}
                    </button>
                  </div>
                  {expandedMetrics.audienceAgeGroup && (
                    <div className="metric-details">
                      <span>Match creator's audience age distribution with campaign targets</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="drawer-footer">
          <div className="footer-buttons">
            <button className="cancel-button" onClick={handleCancel}>
              Cancel
            </button>
            <button className="apply-button" onClick={handleApply}>
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CBFIndexDrawer;
