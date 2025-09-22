import React from 'react';
import { FiEdit2, FiInstagram, FiFileText } from 'react-icons/fi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import './SidebarComponents.scss';

// Loading State Component for the Sidebar
export const SidebarLoader = () => {
  return (
    <div className="sidebar-loader">
      <div className="loader-content">
        <div className="spinner"></div>
        <p>Creating your new plan...</p>
      </div>
    </div>
  );
};

// Unsaved Plan View Component for the Sidebar
export const UnsavedPlanView = ({ selectedCreators, onNewListClick, onSaveAndViewClick }) => {
  return (
    <div className="unsaved-plan-view">
      <div className="back-link">
        <a href="#">&lt; All plans</a>
      </div>
      
      <div className="plan-header">
        <div className="plan-title">
          <h2>Unsaved Plan</h2>
          <button className="edit-button">
            <FiEdit2 size={14} />
          </button>
        </div>
      </div>
      
      <div className="new-list-button-container">
        <button className="new-list-button" onClick={onNewListClick}>
          <span className="plus-icon">+</span>
          <span>New List</span>
        </button>
      </div>
      
      <div className="lists-container">
        <div className="list-item">
          <div className="list-header">
            <h3 className="list-title">List 1</h3>
            <button className="list-menu-button">
              <BsThreeDotsVertical size={14} />
            </button>
          </div>
          
          <div className="influencer-count">
            <span className="count-with-icon">
              <FiInstagram className="list-platform-icon" /> {selectedCreators.length} influencer
            </span>
          </div>
          
          {selectedCreators.map((creator) => (
            <div className="creator-item" key={creator.id}>
              <div className="creator-avatar">
                <img src={creator.profileImg} alt={creator.name} />
              </div>
              <div className="creator-details">
                <div className="creator-name">{creator.name}</div>
                <div className="creator-handle">
                  <FiInstagram size={12} className="platform-icon" /> {creator.handle}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="plan-footer">
        <button className="save-view-plan-button" onClick={onSaveAndViewClick}>
          <FiFileText size={16} className="button-icon" />
          <span>Save & View Plan</span>
        </button>
      </div>
    </div>
  );
};
