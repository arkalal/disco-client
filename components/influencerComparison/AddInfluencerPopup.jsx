"use client";

import React, { useState, useEffect, useRef } from "react";
import { BsInstagram } from "react-icons/bs";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import "./AddInfluencerPopup.scss";

const AddInfluencerPopup = ({ isOpen, onClose, onAddInfluencer }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const popupRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Search for profiles when query changes
  useEffect(() => {
    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    if (searchQuery && searchQuery.trim().length > 0) {
      // Set a new timeout for debouncing
      const timeout = setTimeout(async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/instagram/search?q=${encodeURIComponent(searchQuery)}`);
          if (response.ok) {
            const data = await response.json();
            setProfiles(data.data || []);
          } else {
            console.error('Error fetching search results:', response.statusText);
            setProfiles([]);
          }
        } catch (error) {
          console.error('Failed to fetch search results:', error);
          setProfiles([]);
        } finally {
          setLoading(false);
        }
      }, 300); // 300ms debounce
      
      setSearchTimeout(timeout);
      
      return () => {
        if (timeout) clearTimeout(timeout);
      };
    } else {
      // If query is empty, load default profiles
      loadDefaultProfiles();
    }
  }, [searchQuery]);

  // Load default profiles when component mounts
  useEffect(() => {
    if (isOpen) {
      loadDefaultProfiles();
    }
  }, [isOpen]);

  // Function to load default popular profiles
  const loadDefaultProfiles = async () => {
    setLoading(true);
    try {
      // Using 'featured' as a special query to request default influencers
      const response = await fetch('/api/instagram/search?q=featured&users=vivekoberoi,cristiano,arkalal,nehakakkar,katrinakaif');
      if (response.ok) {
        const data = await response.json();
        setProfiles(data.data || []);
      } else {
        console.error('Error fetching default profiles:', response.statusText);
        setProfiles([]);
      }
    } catch (error) {
      console.error('Failed to fetch default profiles:', error);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCompare = (profile) => {
    if (onAddInfluencer) {
      onAddInfluencer(profile);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="add-influencer-overlay">
      <div className="add-influencer-popup" ref={popupRef}>
        <div className="popup-header">
          <div className="platform-selector">
            <BsInstagram className="platform-icon" />
            <span>Instagram</span>
            <MdKeyboardArrowDown className="dropdown-icon" />
          </div>
          <div className="search-input">
            <input
              type="text"
              placeholder="Search name or social media handle"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="popup-content">
          <div className="recent-profiles-header">RECENTLY VIEWED PROFILES</div>
          
          {loading ? (
            <div className="skeleton-loader">
              {[1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="skeleton-profile">
                  <div className="skeleton-avatar"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line-lg"></div>
                    <div className="skeleton-line-sm"></div>
                  </div>
                  <div className="skeleton-action"></div>
                </div>
              ))}
            </div>
          ) : profiles.length > 0 ? (
            <div className="influencer-list">
              {profiles.map((profile) => (
                <div key={profile.id} className="influencer-item">
                  <div className="influencer-avatar">
                    <img src={profile.image} alt={profile.name} />
                  </div>
                  <div className="influencer-info">
                    <div className="influencer-name">{profile.name}</div>
                    <div className="influencer-username">@{profile.username}</div>
                  </div>
                  <button 
                    className="add-to-compare-btn"
                    onClick={() => handleAddToCompare(profile)}
                  >
                    Add to Compare
                    <IoMdAdd className="add-icon" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">No profiles found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddInfluencerPopup;
