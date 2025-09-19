"use client";

import React, { useEffect, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { IoSettingsOutline } from 'react-icons/io5';
import './ColumnsVisibleDrawer.scss';

// Default selected columns based on the reference image
const defaultSelectedColumns = {
  planMetrics: ['cbfIndex', 'totalCost'],
  platformMetrics: ['followersCount', 'averageLikes', 'engagementRate'],
  audienceMetrics: [],
  messengerResponseMetrics: [],
  paidPartnershipsMetrics: []
};

const ColumnsVisibleDrawer = ({ isOpen, onClose, onApply }) => {
  const [selectedColumns, setSelectedColumns] = useState(defaultSelectedColumns);
  const drawerRef = useRef(null);
  const bodyRef = useRef(null);
  
  // Group selection states
  const [selectAllStates, setSelectAllStates] = useState({
    planMetrics: false,
    platformMetrics: false,
    audienceMetrics: false,
    messengerResponseMetrics: false,
    paidPartnershipsMetrics: false
  });

  const updateSelectAllState = (group, columns) => {
    const isAllSelected = columns[group].length === getColumnsByGroup(group).length;
    setSelectAllStates(prev => ({
      ...prev,
      [group]: isAllSelected
    }));
  };

  // Initialize select all states
  useEffect(() => {
    Object.keys(selectedColumns).forEach(group => {
      updateSelectAllState(group, selectedColumns);
    });
  }, []);

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

  const handleCheckboxChange = (group, column) => {
    setSelectedColumns(prev => {
      const updated = { ...prev };
      if (updated[group].includes(column)) {
        updated[group] = updated[group].filter(c => c !== column);
      } else {
        updated[group] = [...updated[group], column];
      }
      
      updateSelectAllState(group, updated);
      return updated;
    });
  };

  const handleSelectAllToggle = (group) => {
    const allColumns = getColumnsByGroup(group).map(col => col.id);
    
    setSelectedColumns(prev => {
      const updated = { ...prev };
      if (selectAllStates[group]) {
        // Deselect all
        updated[group] = [];
      } else {
        // Select all
        updated[group] = allColumns;
      }
      return updated;
    });
    
    setSelectAllStates(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const handleApply = () => {
    if (onApply) {
      onApply(selectedColumns);
    }
    onClose();
  };

  const isColumnSelected = (group, column) => {
    return selectedColumns[group].includes(column);
  };

  const getColumnsByGroup = (group) => {
    switch(group) {
      case 'planMetrics':
        return [
          { id: 'cbfIndex', label: 'CBF Index' },
          { id: 'totalCost', label: 'Total Cost' },
          { id: 'deliverables', label: 'Deliverables' },
          { id: 'clientCost', label: 'Client Cost' },
          { id: 'contentAnalysis', label: 'Content Analysis', icon: true }
        ];
      case 'platformMetrics':
        return [
          { id: 'followersCount', label: 'Followers Count' },
          { id: 'averageLikes', label: 'Average Likes' },
          { id: 'engagementRate', label: 'Engagement Rate' },
          { id: 'averageComments', label: 'Average Comments' },
          { id: 'averageReelLikes', label: 'Average Reel Likes' },
          { id: 'averageReelComments', label: 'Average Reel Comments' },
          { id: 'averageReelViews', label: 'Average Reel Views' },
          { id: 'reelViewRate', label: 'Reel View Rate' },
          { id: 'reelEngagementRate', label: 'Reel Engagement Rate' },
          { id: 'averageImageLikes', label: 'Average Image Likes' },
          { id: 'averageImageComments', label: 'Average Image Comments' },
          { id: 'imageEngagementRate', label: 'Image Engagement Rate' },
          { id: 'imageCPE', label: 'Image CPE' },
          { id: 'reelsCPE', label: 'Reels CPE' },
          { id: 'cpv', label: 'CPV' },
          { id: 'followerGrowthRate', label: 'Follower Growth Rate' },
          { id: 'marketplaceCost', label: 'Marketplace Cost' },
          { id: 'estimatedReach', label: 'Estimated Reach' }
        ];
      case 'audienceMetrics':
        return [
          { id: 'audienceGender', label: 'Audience Gender' },
          { id: 'audienceAgeGroups', label: 'Audience Age Groups' },
          { id: 'audienceCities', label: 'Audience Cities' },
          { id: 'audienceStates', label: 'Audience States' },
          { id: 'audienceCountries', label: 'Audience Countries' },
          { id: 'audienceCredibility', label: 'Audience Credibility' },
          { id: 'audienceInterests', label: 'Audience Interests' },
          { id: 'audienceLanguages', label: 'Audience Languages' }
        ];
      case 'messengerResponseMetrics':
        return [
          { id: 'messengerAcceptance', label: 'Messenger Acceptance' },
          { id: 'messengerPhoneNumber', label: 'Messenger Phone Number' },
          { id: 'messengerWhatsapp', label: 'Messenger Whatsapp Number' },
          { id: 'messengerEmail', label: 'Messenger Email' },
          { id: 'messengerAddress', label: 'Messenger Address' }
        ];
      case 'paidPartnershipsMetrics':
        return [
          { id: 'averagePostLikes', label: 'Average Post Likes' },
          { id: 'averagePostComments', label: 'Average Post Comments' },
          { id: 'totalPosts', label: 'Total Posts' },
          { id: 'postEngagementRate', label: 'Post Engagement Rate' },
          { id: 'averageReelLikes', label: 'Average Reel Likes' },
          { id: 'averageReelViews', label: 'Average Reel Views' },
          { id: 'averageReelComments', label: 'Average Reel Comments' },
          { id: 'totalReels', label: 'Total Reels' },
          { id: 'reelEngagementRate', label: 'Reel Engagement Rate' },
          { id: 'reelViewRate', label: 'Reel View Rate' }
        ];
      default:
        return [];
    }
  };

  if (!isOpen) return null;

  return (
    <div className="columns-visible-drawer-container">
      <div className="drawer-scrim" onClick={onClose}></div>
      <div 
        ref={drawerRef}
        className="drawer-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="columns-visible-title"
      >
        <div className="drawer-header">
          <h2 id="columns-visible-title">Columns Visible</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close"
          >
            <IoClose size={20} />
          </button>
        </div>

        <div className="drawer-body" ref={bodyRef}>
          {/* Plan Metrics Section */}
          <div className="metrics-section">
            <div className="section-header">
              <h3>Plan Metrics</h3>
              <button 
                className="select-all-btn"
                onClick={() => handleSelectAllToggle('planMetrics')}
              >
                {selectAllStates.planMetrics ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="checkbox-grid">
              {getColumnsByGroup('planMetrics').map(column => (
                <div className="checkbox-item" key={column.id}>
                  <input
                    type="checkbox"
                    id={column.id}
                    checked={isColumnSelected('planMetrics', column.id)}
                    onChange={() => handleCheckboxChange('planMetrics', column.id)}
                  />
                  <label htmlFor={column.id}>
                    {column.label}
                    {column.icon && <IoSettingsOutline className="settings-icon" />}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Metrics Section */}
          <div className="metrics-section">
            <div className="section-header">
              <h3>Platform Metrics</h3>
              <button 
                className="select-all-btn"
                onClick={() => handleSelectAllToggle('platformMetrics')}
              >
                {selectAllStates.platformMetrics ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="checkbox-grid">
              {getColumnsByGroup('platformMetrics').map(column => (
                <div className="checkbox-item" key={column.id}>
                  <input
                    type="checkbox"
                    id={column.id}
                    checked={isColumnSelected('platformMetrics', column.id)}
                    onChange={() => handleCheckboxChange('platformMetrics', column.id)}
                  />
                  <label htmlFor={column.id}>{column.label}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Audience Metrics Section */}
          <div className="metrics-section">
            <div className="section-header">
              <h3>Audience Metrics</h3>
              <button 
                className="select-all-btn"
                onClick={() => handleSelectAllToggle('audienceMetrics')}
              >
                {selectAllStates.audienceMetrics ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="checkbox-grid">
              {getColumnsByGroup('audienceMetrics').map(column => (
                <div className="checkbox-item" key={column.id}>
                  <input
                    type="checkbox"
                    id={column.id}
                    checked={isColumnSelected('audienceMetrics', column.id)}
                    onChange={() => handleCheckboxChange('audienceMetrics', column.id)}
                  />
                  <label htmlFor={column.id}>{column.label}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Influencer Messenger Response Metrics Section */}
          <div className="metrics-section">
            <div className="section-header">
              <h3>Influencer Messenger Response Metrics</h3>
              <button 
                className="select-all-btn"
                onClick={() => handleSelectAllToggle('messengerResponseMetrics')}
              >
                {selectAllStates.messengerResponseMetrics ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="checkbox-grid">
              {getColumnsByGroup('messengerResponseMetrics').map(column => (
                <div className="checkbox-item" key={column.id}>
                  <input
                    type="checkbox"
                    id={column.id}
                    checked={isColumnSelected('messengerResponseMetrics', column.id)}
                    onChange={() => handleCheckboxChange('messengerResponseMetrics', column.id)}
                  />
                  <label htmlFor={column.id}>{column.label}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Paid Partnerships Section */}
          <div className="metrics-section">
            <div className="section-header">
              <h3>Paid Partnerships - Engagement & Views</h3>
              <button 
                className="select-all-btn"
                onClick={() => handleSelectAllToggle('paidPartnershipsMetrics')}
              >
                {selectAllStates.paidPartnershipsMetrics ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="checkbox-grid">
              {getColumnsByGroup('paidPartnershipsMetrics').map(column => (
                <div className="checkbox-item" key={column.id}>
                  <input
                    type="checkbox"
                    id={column.id}
                    checked={isColumnSelected('paidPartnershipsMetrics', column.id)}
                    onChange={() => handleCheckboxChange('paidPartnershipsMetrics', column.id)}
                  />
                  <label htmlFor={column.id}>{column.label}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="drawer-footer">
          <div className="footer-buttons">
            <button className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="apply-button"
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColumnsVisibleDrawer;
