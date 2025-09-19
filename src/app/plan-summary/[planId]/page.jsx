"use client";

import React, { useState, useEffect, useRef } from "react";
import AddInfluencersDrawer from "../../../../components/drawers/AddInfluencersDrawer";
import ColumnsVisibleDrawer from "../../../../components/drawers/ColumnsVisibleDrawer";
import CBFIndexDrawer from "../../../../components/drawers/CBFIndexDrawer";
import CreateListDrawer from "../../../../components/drawers/CreateListDrawer";
import EditListDrawer from "../../../../components/drawers/EditListDrawer";
import MessageAllDrawer from "../../../../components/drawers/MessageAllDrawer";
import SummaryEmptyState from "../../../../components/summary/SummaryEmptyState";
import KebabMenu from "../../../../components/menus/KebabMenu";
import SharePlanModal from "../../../../components/modals/SharePlanModal";
import EditPlanModal from "../../../../components/modals/EditPlanModal";
import CBFIndexCard from "../../../../components/hover-cards/CBFIndexCard";
import SectionsVisibleDropdown from "../../../../components/dropdowns/SectionsVisibleDropdown";
import { IoChevronBackOutline, IoShareOutline } from "react-icons/io5";
import { BsThreeDots, BsLink, BsEye, BsLightning } from "react-icons/bs";
import { FiUserPlus, FiCopy, FiDownload } from "react-icons/fi";
import { HiOutlineChatAlt } from "react-icons/hi";
import { FaInstagram } from "react-icons/fa";
import Link from "next/link";
import CollapsibleSidebar from "../../../../components/layout/CollapsibleSidebar";
import "../../../../components/layout/MainLayout.scss";
import "../../../../components/layout/Sidebar.scss";
import "../../../../components/layout/CollapsibleSidebar.scss";
import "./plan-summary.scss";

const PlanSummary = ({ params }) => {
  // State for various UI elements
  const [activeTab, setActiveTab] = useState("list2");
  const [activeView, setActiveView] = useState("list");
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  const [showKebabMenu, setShowKebabMenu] = useState(false);
  const [showAddInfluencersDrawer, setShowAddInfluencersDrawer] = useState(false);
  const [showColumnsDrawer, setShowColumnsDrawer] = useState(false);
  const [showCBFIndexDrawer, setShowCBFIndexDrawer] = useState(false);
  const [showCreateListDrawer, setShowCreateListDrawer] = useState(false);
  const [showEditListDrawer, setShowEditListDrawer] = useState(false);
  const [showMessageAllDrawer, setShowMessageAllDrawer] = useState(false);
  const [showSharePlanModal, setShowSharePlanModal] = useState(false);
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);
  const [currentListData, setCurrentListData] = useState(null);
  const [summaryHasDeliverables, setSummaryHasDeliverables] = useState(false);
  const [hoveredInfluencer, setHoveredInfluencer] = useState(null);
  const [cbfCardPosition, setCbfCardPosition] = useState({ top: 0, left: 0 });
  const [planNameDisplay, setPlanNameDisplay] = useState("Unsaved Plan");
  const [showSectionsDropdown, setShowSectionsDropdown] = useState(false);
  const [selectedSections, setSelectedSections] = useState(['expected-outcomes', 'influencer-category-performance', 'expected-audience-impact']);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const sectionsButtonRef = useRef(null);
  
  // State to track visible columns
  const [visibleColumns, setVisibleColumns] = useState({
    planMetrics: ['cbfIndex', 'totalCost'],
    platformMetrics: ['followersCount', 'averageLikes', 'engagementRate'],
    audienceMetrics: [],
    messengerResponseMetrics: [],
    paidPartnershipsMetrics: []
  });

  // Sample data for the lists
  const lists = [
    {
      id: "list1",
      name: "List 1",
      color: "#1C6AE4",
      platform: "instagram",
      count: 2,
      deliverables: [
        { id: 1, type: "Instagram Post", quantity: 1, cost: "" }
      ]
    },
    {
      id: "list2",
      name: "List 2",
      color: "#FF6A3D",
      platform: "instagram",
      count: 2,
      deliverables: []
    }
  ];

  // Handler to edit list
  const handleEditList = () => {
    const listToEdit = lists.find(list => list.id === activeTab);
    if (listToEdit) {
      setCurrentListData(listToEdit);
      setShowEditListDrawer(true);
    }
  };

  // Handler to update list
  const handleUpdateList = (updatedList) => {
    console.log("List updated:", updatedList);
    // Here you would typically update the list in your data store
    
    // For demo purposes, we'll update the summaryHasDeliverables state if the list has deliverables
    if (activeTab === updatedList.id && activeView === 'summary') {
      setSummaryHasDeliverables(updatedList.deliverables && updatedList.deliverables.length > 0);
    }
  };

  // Handler to delete list
  const handleDeleteList = (listId) => {
    console.log("List deleted:", listId);
    // Here you would typically delete the list from your data store
  };
  
  // Calculate and show CBF hover card
  const handleCBFHover = (influencer, event) => {
    if (!event || !influencer) return;
    
    // Get the element's position
    const rect = event.currentTarget.getBoundingClientRect();
    
    // We want the card to appear to the right
    const position = {
      left: rect.right,
      top: rect.top + rect.height / 2
    };
    
    // Make sure the card doesn't go off-screen
    const rightEdgeSpace = window.innerWidth - position.left;
    if (rightEdgeSpace < 360) { // Card width + some margin
      // If not enough space on right, position differently
      position.left = rect.left + rect.width / 2;
      position.top = rect.top - 10;
    }
    
    // Update state
    setCbfCardPosition(position);
    setHoveredInfluencer(influencer);
  };
  
  const handleCBFHoverEnd = () => {
    // Check if we're hovering the card
    setTimeout(() => {
      if (!document.querySelector('.cbf-index-card:hover')) {
        // If we're not over the card after a small delay, close it
        setHoveredInfluencer(null);
      }
    }, 50);
  };
  
  const handleChangeCBFIndex = (influencer) => {
    setHoveredInfluencer(null);
    setShowCBFIndexDrawer(true);
  };
  
  const handleEditPlanDetails = (data) => {
    setPlanNameDisplay(data.planName);
    console.log("Plan details updated:", data);
  };
  
  const handleSectionsChange = (sections) => {
    setSelectedSections(sections);
  };

  // Sample data for the influencers
  const influencers = [
    {
      id: 1,
      name: "Katrina Kaif",
      avatar: "/images/avatar-placeholder.svg",
      instagram: "@katrinakaif",
      cbfIndex: 5,
      location: "Mumbai",
      cost: "-",
      followers: "80m",
      likes: "1.8m",
      engagementRate: "2.24%",
    },
    {
      id: 2,
      name: "Arka Lal Chakravarty",
      avatar: "/images/avatar-placeholder.svg",
      instagram: "@arkalal",
      cbfIndex: 15,
      location: "Hyderabad",
      cost: "-",
      followers: "349",
      likes: "15",
      engagementRate: "4.44%",
    },
  ];

  // Function to handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    
    // Check if the selected list has deliverables for summary view
    const selectedList = lists.find(list => list.id === tabId);
    if (selectedList && activeView === 'summary') {
      setSummaryHasDeliverables(selectedList.deliverables && selectedList.deliverables.length > 0);
    }
  };

  // Function to handle view change
  const handleViewChange = (view) => {
    setActiveView(view);
    
    // Check if the current list has deliverables when switching to summary view
    if (view === 'summary') {
      const currentList = lists.find(list => list.id === activeTab);
      setSummaryHasDeliverables(currentList && currentList.deliverables && currentList.deliverables.length > 0);
    }
  };

  // Close any dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close kebab menu if clicked outside
      if (
        showKebabMenu &&
        !event.target.closest(".kebab-menu") &&
        !event.target.closest(".icon-button")
      ) {
        setShowKebabMenu(false);
      }

      // Close columns dropdown if clicked outside
      if (
        showColumnsDropdown &&
        !event.target.closest(".columns-dropdown") &&
        !event.target.closest(".columns-visible-btn")
      ) {
        setShowColumnsDropdown(false);
      }
    };

    // Handle Escape key press
    const handleEscKeyPress = (event) => {
      if (event.key === "Escape") {
        setShowKebabMenu(false);
        setShowColumnsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKeyPress);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKeyPress);
    };
  }, [showKebabMenu, showColumnsDropdown]);

  return (
    <div className="plan-summary-container">
      <CollapsibleSidebar activePage="plans-lists" />
      {/* Header bar */}
      <div className="header-bar">
        <div className="left-section">
          <Link href="/plans-lists" className="back-button">
            <IoChevronBackOutline size={24} />
          </Link>
          <div className="plan-avatar"></div>
          <div className="plan-info">
            <h1>{planNameDisplay}</h1>
            <span className="plan-meta">Created on Sep 12, 2025</span>
          </div>
        </div>
        <div className="right-section">
          <div className="kebab-menu-wrapper">
            <KebabMenu 
              onEditDetails={() => setShowEditPlanModal(true)} 
              onArchivePlan={() => console.log('Archive plan clicked')} 
            />    
          </div>
          <button 
            className="icon-button" 
            aria-label="Share"
            onClick={() => setShowSharePlanModal(true)}
          >
            <IoShareOutline size={16} />
          </button>
          <button className="icon-button" aria-label="Export">
            <FiDownload size={16} />
          </button>
          <button 
            className="set-cbf-index-btn"
            onClick={() => setShowCBFIndexDrawer(true)}
          >
            <BsLightning size={16} />
            <span>Set CBF Index</span>
            <span className="new-badge">NEW</span>
          </button>
          <button 
            className="add-influencers-btn"
            onClick={() => setShowAddInfluencersDrawer(true)}
          >
            <FiUserPlus size={16} />
            <span>Add Influencers</span>
          </button>
        </div>
      </div>

      {/* List Tabs Row */}
      <div className="list-tabs-row">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "list2" ? "active" : ""}`}
            onClick={() => handleTabChange("list2")}
          >
            <span className="tab-dot orange"></span>
            <span>List 2</span>
            <span className="count">2</span>
          </button>
          <button
            className={`tab ${activeTab === "list1" ? "active" : ""}`}
            onClick={() => handleTabChange("list1")}
          >
            <span className="tab-dot gray"></span>
            <span>List 1</span>
            <span className="count">2</span>
          </button>
        </div>
        <div className="tabs-actions">
          {activeTab && (
            <button 
              className="edit-tab-btn"
              onClick={handleEditList}
              aria-label={`Edit ${activeTab === "list1" ? "List 1" : "List 2"}`}
            >
              <i className="edit-icon"></i>
            </button>
          )}
          <button 
            className="new-list-btn" 
            onClick={() => setShowCreateListDrawer(true)}
          >
            + New List
          </button>
        </div>
      </div>

      {/* Deliverables helper */}
      <div className="deliverables-helper">
        <span className="helper-label">Deliverables per Influencer:</span>
        <a 
          href="#"
          className="set-deliverables-link"
          onClick={(e) => {
            e.preventDefault();
            const activeListData = lists.find(list => list.id === activeTab);
            if (activeListData) {
              setCurrentListData(activeListData);
              setShowEditListDrawer(true);
            }
          }}
        >
          <BsLink size={12} />
          <span>Set Deliverables</span>
        </a>
      </div>

      {/* View Controls Row */}
      <div className="view-controls-row">
        <div className="view-toggle">
          <button
            className={`toggle-btn ${activeView === "list" ? "active" : ""}`}
            onClick={() => handleViewChange("list")}
          >
            List
          </button>
          <button
            className={`toggle-btn ${activeView === "summary" ? "active" : ""}`}
            onClick={() => handleViewChange("summary")}
          >
            Summary
          </button>
        </div>
        <div className="right-controls">
          <button
            ref={sectionsButtonRef}
            className="columns-visible-btn"
            onClick={() => {
              if (activeView === "summary") {
                if (sectionsButtonRef.current) {
                  const rect = sectionsButtonRef.current.getBoundingClientRect();
                  setDropdownPosition({
                    top: rect.bottom,
                    left: rect.left
                  });
                }
                setShowSectionsDropdown(!showSectionsDropdown);
              } else {
                setShowColumnsDrawer(true);
              }
            }}
          >
            <BsEye size={16} />
            <span>{activeView === "summary" ? "Sections" : "Columns"} Visible</span>
          </button>
          
          {/* Sections Dropdown */}
          {activeView === "summary" && (
            <SectionsVisibleDropdown
              isOpen={showSectionsDropdown}
              onClose={() => setShowSectionsDropdown(false)}
              selectedSections={selectedSections}
              onSectionsChange={handleSectionsChange}
              position={dropdownPosition}
            />
          )}
          {showColumnsDropdown && (
            <div className="columns-dropdown">
              <div className="dropdown-content">
                <div className="checkbox-item">
                  <input type="checkbox" id="col-name" checked readOnly />
                  <label htmlFor="col-name">Influencer Name</label>
                </div>
                <div className="checkbox-item">
                  <input type="checkbox" id="col-cbf" checked readOnly />
                  <label htmlFor="col-cbf">CBF Index</label>
                </div>
                <div className="checkbox-item">
                  <input type="checkbox" id="col-location" checked readOnly />
                  <label htmlFor="col-location">Location</label>
                </div>
                <div className="checkbox-item">
                  <input type="checkbox" id="col-cost" checked readOnly />
                  <label htmlFor="col-cost">Cost</label>
                </div>
                <div className="checkbox-item">
                  <input type="checkbox" id="col-followers" checked readOnly />
                  <label htmlFor="col-followers">Followers</label>
                </div>
                <div className="checkbox-item">
                  <input type="checkbox" id="col-likes" checked readOnly />
                  <label htmlFor="col-likes">Likes (Avg)</label>
                </div>
                <div className="checkbox-item">
                  <input type="checkbox" id="col-er" checked readOnly />
                  <label htmlFor="col-er">Engagement Rate (%)</label>
                </div>
                <div className="checkbox-item">
                  <input type="checkbox" id="col-messenger" checked readOnly />
                  <label htmlFor="col-messenger">Messenger</label>
                </div>
              </div>
              <div className="dropdown-footer">
                <button className="cancel-btn">Cancel</button>
                <button className="apply-btn">Apply</button>
              </div>
            </div>
          )}
          <button 
            className="message-all-btn"
            onClick={() => setShowMessageAllDrawer(true)}
          >
            <HiOutlineChatAlt size={16} />
            <span>Message All</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      {activeView === "list" ? (
        <div className="data-table">
          <div className="table-header">
            <div className="header-cell influencer-name">Influencer Name</div>
            <div className="header-cell cbf-index">CBF Index</div>
            <div className="header-cell location">Location</div>
            <div className="header-cell cost">Cost</div>
            <div className="header-cell followers">Followers</div>
            <div className="header-cell likes">Likes (Avg)</div>
            <div className="header-cell engagement">Engagement Rate (%)</div>
            <div className="header-cell messenger">Messenger</div>
          </div>
          <div className="table-body">
            {influencers.map((influencer) => (
              <div key={influencer.id} className="table-row">
                <div className="cell influencer-name">
                  <div className="avatar">
                    <img
                      src={influencer.avatar}
                      alt="avatar"
                      width="32"
                      height="32"
                    />
                  </div>
                  <div className="influencer-info">
                    <div className="name">{influencer.name}</div>
                    <div className="instagram">
                      <FaInstagram size={12} className="instagram-icon" />
                      <span className="handle">{influencer.instagram}</span>
                    </div>
                  </div>
                </div>
                <div className="cell cbf-index">
                  <div 
                    className="cbf-pill" 
                    onClick={(e) => handleCBFHover(influencer, e)}
                    onMouseEnter={(e) => handleCBFHover(influencer, e)}
                    onMouseLeave={handleCBFHoverEnd}
                    onFocus={(e) => handleCBFHover(influencer, e)}
                  >
                    {influencer.cbfIndex}
                  </div>
                </div>
                <div className="cell location">{influencer.location}</div>
                <div className="cell cost">{influencer.cost}</div>
                <div className="cell followers">{influencer.followers}</div>
                <div className="cell likes">{influencer.likes}</div>
                <div className="cell engagement">
                  {influencer.engagementRate}
                </div>
                <div className="cell messenger">
                  <button className="message-btn">
                    <HiOutlineChatAlt size={14} className="message-icon" />
                    <span>Message</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="table-footer">
            <div className="pagination-info">Showing 1-2 influencers of 2</div>
            <div className="pagination-controls">
              <button className="prev-btn" disabled>
                &lt;
              </button>
              <span className="page-info">1 of 1</span>
              <button className="next-btn" disabled>
                &gt;
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Summary View Content
        <>
          {summaryHasDeliverables ? (
            <div className="summary-view">
              <div className="summary-card">
                <h3>Summary View Content</h3>
                <p>Detailed summary content will appear here.</p>
              </div>
            </div>
          ) : (
            <SummaryEmptyState 
              activeListId={activeTab}
              onSetDeliverables={(listId) => {
                const listToEdit = lists.find(list => list.id === listId);
                if (listToEdit) {
                  setCurrentListData(listToEdit);
                  setShowEditListDrawer(true);
                }
              }} 
            />
          )}
        </>
      )}
      
      {/* Add Influencers Drawer */}
      <AddInfluencersDrawer 
        isOpen={showAddInfluencersDrawer} 
        onClose={() => setShowAddInfluencersDrawer(false)} 
        onSubmit={(data) => {
          console.log("Added influencers:", data);
          // Here you would typically handle the form submission
          // e.g., add the influencers to the current plan
        }} 
      />

      {/* Columns Visible Drawer */}
      <ColumnsVisibleDrawer
        isOpen={showColumnsDrawer}
        onClose={() => setShowColumnsDrawer(false)}
        onApply={(selectedColumns) => {
          console.log("Applied column settings:", selectedColumns);
          setVisibleColumns(selectedColumns);
          setShowColumnsDrawer(false);
        }}
      />

      {/* CBF Index Drawer */}
      <CBFIndexDrawer
        isOpen={showCBFIndexDrawer}
        onClose={() => setShowCBFIndexDrawer(false)}
        onApply={(data) => {
          console.log("Applied CBF Index settings:", data);
          // Here you would typically handle updating the CBF Index
          setShowCBFIndexDrawer(false);
        }}
      />

      {/* Create List Drawer */}
      <CreateListDrawer
        isOpen={showCreateListDrawer}
        onClose={() => setShowCreateListDrawer(false)}
        onCreateList={(data) => {
          console.log("Created new list:", data);
          // Here you would typically handle creating a new list
          setShowCreateListDrawer(false);
        }}
      />

      {/* Edit List Drawer */}
      <EditListDrawer
        isOpen={showEditListDrawer}
        onClose={() => setShowEditListDrawer(false)}
        listData={currentListData}
        onUpdateList={handleUpdateList}
        onDeleteList={handleDeleteList}
      />
      
      {/* Message All Drawer */}
      <MessageAllDrawer 
        isOpen={showMessageAllDrawer}
        onClose={() => setShowMessageAllDrawer(false)}
      />
      
      {/* Share Plan Modal */}
      <SharePlanModal
        isOpen={showSharePlanModal}
        onClose={() => setShowSharePlanModal(false)}
        planName={planNameDisplay}
      />
      
      {/* Edit Plan Modal */}
      <EditPlanModal 
        isOpen={showEditPlanModal}
        onClose={() => setShowEditPlanModal(false)}
        planName={planNameDisplay}
        onSubmit={handleEditPlanDetails}
      />
      
      {/* CBF Index Hover Card */}
      {hoveredInfluencer && (
        <CBFIndexCard
          influencer={hoveredInfluencer}
          onChangeIndex={handleChangeCBFIndex}
          position={cbfCardPosition}
          isVisible={!!hoveredInfluencer}
          onClose={handleCBFHoverEnd}
        />
      )}
    </div>
  );
};

export default PlanSummary;
