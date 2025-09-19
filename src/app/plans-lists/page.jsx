"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiArchive, FiUserPlus, FiUpload } from 'react-icons/fi';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { AiOutlinePlus } from 'react-icons/ai';
import { BiChevronDown } from 'react-icons/bi';
import { IoCloseOutline } from 'react-icons/io5';
import { FaInstagram } from 'react-icons/fa';
import Link from 'next/link';
import CollapsibleSidebar from '../../../components/layout/CollapsibleSidebar';
import '../../../components/layout/MainLayout.scss';
import '../../../components/layout/Sidebar.scss';
import '../../../components/layout/CollapsibleSidebar.scss';
import './plans-lists.scss';

const PlansAndLists = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [showModal, setShowModal] = useState(false);
  const [ownershipFilter, setOwnershipFilter] = useState('Owned by anyone');
  const [sortBy, setSortBy] = useState('Recently Opened');
  const [showOwnershipDropdown, setShowOwnershipDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [hoveredRowId, setHoveredRowId] = useState(null);
  const [showAddInfluencersDropdown, setShowAddInfluencersDropdown] = useState(false);
  const [showKebabMenu, setShowKebabMenu] = useState(null);
  
  // Refs for dropdown containers
  const ownershipDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);
  const kebabMenuRef = useRef(null);
  const addInfluencersButtonRef = useRef(null);
  const addInfluencersDropdownRef = useRef(null);
  
  const ownershipOptions = ['Owned by anyone', 'Owned by me', 'Shared with me'];
  const sortOptions = ['Recently opened', 'Recently created', 'Plan name'];
  
  // Sample data for the active tab
  const activePlans = [
    {
      id: 1,
      name: 'Unsaved Plan',
      platforms: ['instagram'],
      totalInfluencers: 4,
      totalLists: 2,
      createdBy: 'Me',
      createdOn: '12 Sep 2025'
    }
  ];
  
  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close ownership dropdown if clicked outside
      if (ownershipDropdownRef.current && !ownershipDropdownRef.current.contains(event.target)) {
        setShowOwnershipDropdown(false);
      }
      
      // Close sort dropdown if clicked outside
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
      
      // Close kebab menu if clicked outside
      if (kebabMenuRef.current && !kebabMenuRef.current.contains(event.target)) {
        setShowKebabMenu(null);
      }
      
      // Close add influencers dropdown if clicked outside both button and dropdown
      if (
        addInfluencersDropdownRef.current && 
        !addInfluencersDropdownRef.current.contains(event.target) &&
        addInfluencersButtonRef.current &&
        !addInfluencersButtonRef.current.contains(event.target)
      ) {
        // Add a small delay to prevent flickering when moving from button to dropdown
        setTimeout(() => {
          if (
            addInfluencersDropdownRef.current &&
            !addInfluencersDropdownRef.current.contains(document.activeElement) &&
            !addInfluencersDropdownRef.current.contains(document.querySelector(':hover'))
          ) {
            setShowAddInfluencersDropdown(false);
          }
        }, 100);
      }
    };
    
    // Handle Escape key press
    const handleEscKeyPress = (event) => {
      if (event.key === 'Escape') {
        setShowOwnershipDropdown(false);
        setShowSortDropdown(false);
        setShowKebabMenu(null);
        setShowAddInfluencersDropdown(false);
        setHoveredRowId(null); // Also clear hovered row on Escape
      }
    };
    
    // Ensure only one dropdown is open at a time
    const handleOpenDropdown = () => {
      if (showAddInfluencersDropdown) {
        setShowOwnershipDropdown(false);
        setShowSortDropdown(false);
        setShowKebabMenu(null);
      }
    };
    
    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKeyPress);
    
    // Watch for dropdown state changes
    handleOpenDropdown();
    
    // Clean up event listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKeyPress);
    };
  }, [showAddInfluencersDropdown, showOwnershipDropdown, showSortDropdown, showKebabMenu]);

  const handleNewPlan = () => {
    setShowModal(true);
  };

  return (
    <div className="plans-lists-container">
      <CollapsibleSidebar activePage="plans-lists" />
      
      <div className="plans-lists-content">
        <div className="plans-lists-header">
          <h1>Plans & Lists</h1>
          <button className="new-plan-btn" onClick={handleNewPlan}>
            <AiOutlinePlus size={16} />
            <span>New Plan</span>
          </button>
        </div>
      
        <div className="plans-lists-tabs">
          <div className="tabs-container">
            <button 
              className={`tab ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              ACTIVE (1)
            </button>
            <button 
              className={`tab ${activeTab === 'archived' ? 'active' : ''}`}
              onClick={() => setActiveTab('archived')}
            >
              ARCHIVED
            </button>
          </div>
          
          {activeTab === 'active' && activePlans.length > 0 && (
            <div className="plans-count">1 plan</div>
          )}
        </div>

        <div className="plans-lists-filters">
          <div className="filter-group">
            <div className="ownership-dropdown" ref={ownershipDropdownRef}>
              <button 
                className="dropdown-btn"
                onClick={() => {
                  setShowOwnershipDropdown(!showOwnershipDropdown);
                  setShowSortDropdown(false);
                  setShowKebabMenu(null);
                }}
              >
                {ownershipFilter} <BiChevronDown />
              </button>
              {showOwnershipDropdown && (
                <div className="dropdown-options">
                  {ownershipOptions.map((option, index) => (
                    <div 
                      key={index} 
                      className="dropdown-option"
                      onClick={() => {
                        setOwnershipFilter(option);
                        setShowOwnershipDropdown(false);
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="search-bar">
              <FiSearch className="search-icon" />
              <input type="text" placeholder="Search plans" />
            </div>
          </div>
          
          <div className="sort-filter">
            <span>Sort by:</span>
            <div className="sort-dropdown" ref={sortDropdownRef}>
              <button 
                className="dropdown-btn"
                onClick={() => {
                  setShowSortDropdown(!showSortDropdown);
                  setShowOwnershipDropdown(false);
                  setShowKebabMenu(null);
                }}
              >
                {sortBy} <BiChevronDown />
              </button>
              {showSortDropdown && (
                <div className="dropdown-options">
                  {sortOptions.map((option, index) => (
                    <div 
                      key={index} 
                      className="dropdown-option"
                      onClick={() => {
                        setSortBy(option);
                        setShowSortDropdown(false);
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="plans-lists-table">
          <div className="table-header">
            <div className="header-cell plan-name">Plan Name</div>
            <div className="header-cell platforms">Platforms</div>
            <div className="header-cell total-influencers">Total Influencers</div>
            <div className="header-cell total-lists">Total Lists</div>
            <div className="header-cell created-by">Created By</div>
            <div className="header-cell created-on">Created On</div>
            <div className="header-cell actions"></div>
          </div>

          {activeTab === 'active' && activePlans.length > 0 ? (
            <div className="table-body">
              {activePlans.map(plan => (
                <div 
                  key={plan.id} 
                  className="table-row" 
                  onMouseEnter={() => setHoveredRowId(plan.id)}
                  onMouseLeave={() => {
                    if (!showAddInfluencersDropdown) {
                      setHoveredRowId(null);
                    }
                  }}
                >
                  <div className="cell plan-name">
                    <div className="avatar"></div>
                    <span>{plan.name}</span>
                  </div>
                  <div className="cell platforms">
                    {plan.platforms.includes('instagram') && <FaInstagram className="platform-icon instagram" />}
                  </div>
                  <div className="cell total-influencers">{plan.totalInfluencers}</div>
                  <div className="cell total-lists">{plan.totalLists}</div>
                  <div className="cell created-by">{plan.createdBy}</div>
                  <div className="cell created-on">{plan.createdOn}</div>
                  
                  {hoveredRowId === plan.id && (
                    <div 
                      className="add-influencers-container"
                      ref={addInfluencersButtonRef}
                    >
                      <button 
                        className="add-influencers-btn"
                        onMouseEnter={() => {
                          setShowAddInfluencersDropdown(true);
                          setShowKebabMenu(null); // Close any open kebab menu
                        }}
                      >
                        <FiUserPlus size={16} />
                        <span>Add Influencers</span>
                      </button>
                    </div>
                  )}
                  
                  <div className="cell actions">
                    <div className="kebab-menu-container" ref={kebabMenuRef}>
                      <HiOutlineDotsVertical 
                        className="action-icon" 
                        onClick={() => {
                          setShowKebabMenu(showKebabMenu === plan.id ? null : plan.id);
                          setShowAddInfluencersDropdown(false);
                        }}
                      />
                      
                      {showKebabMenu === plan.id && (
                        <div className="kebab-menu">
                          <div className="menu-option">
                            <FiArchive className="option-icon" />
                            <span>Archive Plan</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === 'archived' ? (
            <div className="empty-state">
              <div className="empty-state-illustration"></div>
              <p>Plan List not available</p>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-illustration"></div>
              <p>No plans found</p>
            </div>
          )}
        </div>
        
        {/* Render the Add Influencers dropdown outside of the table for proper positioning */}
        {hoveredRowId && showAddInfluencersDropdown && (
          <div 
            className="add-influencers-dropdown"
            ref={addInfluencersDropdownRef}
            style={{
              position: 'fixed',
              top: `${addInfluencersButtonRef.current?.getBoundingClientRect().bottom + 8}px`,
              left: `${addInfluencersButtonRef.current?.getBoundingClientRect().left}px`,
              minWidth: `${addInfluencersButtonRef.current?.offsetWidth}px`,
              maxWidth: '240px',
            }}
            onMouseLeave={() => {
              // Add small delay to prevent flicker
              setTimeout(() => {
                setShowAddInfluencersDropdown(false);
                setHoveredRowId(null);
              }, 120);
            }}
          >
            <div className="dropdown-option">
              <FiSearch className="option-icon" size={16} />
              <span>New Search</span>
            </div>
            <Link href="/plan-summary/unsaved-plan" className="dropdown-option">
              <FiUpload className="option-icon" size={16} />
              <span>Add Manually</span>
            </Link>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay">
            <div className="create-plan-modal">
              <div className="modal-header">
                <h2>Create Plan</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  <IoCloseOutline size={24} />
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Name of the Plan</label>
                  <input type="text" placeholder="Enter Plan Name" />
                </div>
                <div className="form-group">
                  <label>Brand Name</label>
                  <div className="brand-input">
                    <FiSearch className="search-icon" />
                    <input type="text" placeholder="Enter brand name" />
                  </div>
                </div>
                <div className="form-group">
                  <p>I want to add influencers by</p>
                  <div className="radio-group">
                    <div className="radio-option">
                      <input 
                        type="radio" 
                        id="search-influencers" 
                        name="add-method" 
                        defaultChecked 
                      />
                      <label htmlFor="search-influencers">Searching Influencers From Epigroww Global</label>
                    </div>
                    <div className="radio-option">
                      <input 
                        type="radio" 
                        id="add-manually" 
                        name="add-method" 
                      />
                      <label htmlFor="add-manually">Adding Influencers Manually</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="create-plan-btn">Create Plan</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlansAndLists;
