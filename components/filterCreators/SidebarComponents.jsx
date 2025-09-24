import React, { useState, useRef, useEffect } from 'react';
import { FiEdit2, FiInstagram, FiFileText, FiEdit, FiTrash2 } from 'react-icons/fi';
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

// All Plans View Component for the Sidebar
export const AllPlansView = ({ plans = [], onNewPlanClick, onSelectPlan }) => {
  return (
    <div className="all-plans-view">
      <div className="all-plans-header">
        <h2>All Plans</h2>
        <p className="hint">Kindly select a plan from the list below to start adding influencers!</p>
        <button className="new-plan-button" onClick={onNewPlanClick}>
          <span className="plus">+</span> New Plan
        </button>
      </div>

      <div className="plans-list">
        {plans.map((plan) => (
          <div className="plan-card" key={plan.id} onClick={() => onSelectPlan && onSelectPlan(plan)}>
            <div className="plan-card-title">{plan.name}</div>
            <div className="plan-card-meta">
              <span className="meta-item">{plan.lists?.length || 0} {plan.lists?.length === 1 ? 'list' : 'lists'}</span>
              {plan.dateLabel && <span className="meta-sep">•</span>}
              {plan.dateLabel && <span className="meta-item">{plan.dateLabel}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Unsaved Plan View Component for the Sidebar
export const UnsavedPlanView = ({ 
  selectedCreators, 
  onNewListClick, 
  onSaveAndViewClick, 
  onEditListClick, 
  onDeleteListClick, 
  onListClick,
  onBackClick
 }) => {
  const [showListOptions, setShowListOptions] = useState(false);
  
  // Close dropdown when clicking outside
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowListOptions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);
  return (
    <div className="unsaved-plan-view">
      <div className="back-link">
        <a href="#" onClick={(e) => { e.preventDefault(); onBackClick && onBackClick(); }}>&lt; All plans</a>
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
            <h3 className="list-title" onClick={onListClick}>List 1</h3>
            <div className="dropdown-container" ref={dropdownRef}>
              <button 
                className="list-menu-button" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowListOptions(!showListOptions);
                }}
              >
                <BsThreeDotsVertical size={14} />
              </button>
              {showListOptions && (
                <div className="list-options-dropdown">
                  <div className="list-option" onClick={(e) => {
                    e.stopPropagation();
                    setShowListOptions(false);
                    onEditListClick();
                  }}>
                    <FiEdit size={14} className="option-icon" /> Edit List Details
                  </div>
                  <div className="list-option" onClick={(e) => {
                    e.stopPropagation();
                    setShowListOptions(false);
                    onDeleteListClick();
                  }}>
                    <FiTrash2 size={14} className="option-icon" /> Delete List
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="influencer-count">
            <span className="count-with-icon">
              <FiInstagram className="list-platform-icon" /> {selectedCreators.length} influencer
            </span>
          </div>
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
