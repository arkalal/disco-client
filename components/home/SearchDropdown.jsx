"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { AiOutlineInstagram } from "react-icons/ai";
import { BsStars, BsArrowRight, BsCheckCircleFill } from "react-icons/bs";
import { IoIosMusicalNotes, IoIosPeople } from "react-icons/io";
import { MdOutlineSportsBasketball, MdOutlineSchool } from "react-icons/md";
import { PiTelevisionSimpleBold } from "react-icons/pi";
import { FiSearch } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SearchDropdown = ({ isOpen, onClose, onCategorySelect, searchContainerRef, searchQuery = "" }) => {
  const dropdownRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const router = useRouter();
  const [searchTimeout, setSearchTimeout] = useState(null);
  
  // Define categories with icons
  const categories = [
    { name: "Beauty", icon: "💄" },
    { name: "Hair Care", icon: "💇" },
    { name: "Fashion", icon: "👗" },
    { name: "Travel", icon: "🌎" },
    { name: "Fitness", icon: "🏋️" },
    { name: "Health", icon: "⚕️" },
    { name: "Food", icon: "🍽️" },
    { name: "Lifestyle", icon: "✨" },
  ];

  // Mount/unmount handling with a delay for exit animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
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
    loadDefaultProfiles();
  }, []);
  
  // Function to load default popular profiles
  const loadDefaultProfiles = async () => {
    setLoading(true);
    try {
      // Fetch default profiles (using empty query will return defaults)
      const response = await fetch('/api/instagram/search?q=popular');
      if (response.ok) {
        const data = await response.json();
        setProfiles(data.data || []);
      } else {
        console.error('Error fetching default profiles:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch default profiles:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle profile click to navigate to profile page
  const handleProfileClick = (username) => {
    router.push(`/profile/${username}`);
    onClose();
  };
  
  // Handle category selection
  const handleCategoryClick = (category) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  // Calculate and apply position styles before DOM paint
  useLayoutEffect(() => {
    if (!isVisible || !searchContainerRef?.current || !dropdownRef.current)
      return;

    // Find the platform selector to calculate its width
    const platformSelector =
      searchContainerRef.current.querySelector(".platform-selector");
    const platformWidth = platformSelector ? platformSelector.offsetWidth : 0;

    // Apply initial styles directly to DOM
    Object.assign(dropdownRef.current.style, {
      position: "absolute",
      top: "100%",
      left: platformWidth + "px",
      width: `calc(100% - ${platformWidth}px)`,
      willChange: "transform, opacity",
      transform: "translateY(-5px)",
      opacity: "0",
      transition: "opacity 0.3s ease, transform 0.3s ease",
      borderTop: "none",
    });

    // Force browser to process the styles before transition
    document.body.offsetHeight; // Force reflow

    // Apply animation styles
    Object.assign(dropdownRef.current.style, {
      transform: "translateY(0)",
      opacity: "1",
    });
  }, [isVisible, searchContainerRef]);

  if (!isVisible) return null;

  return (
    <div
      className="search-dropdown"
      onClick={(e) => e.stopPropagation()}
      ref={dropdownRef}
    >
      <div className="search-dropdown-header">
        <span>SEARCH SUGGESTIONS</span>
      </div>
      <div className="search-categories">
        {categories.map((category, index) => (
          <div 
            key={index} 
            className="category-item"
            onClick={() => handleCategoryClick(category)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </div>
        ))}
      </div>

      <div className="search-dropdown-section">
        <div className="section-header">INFLUENCER PROFILES</div>
        {loading ? (
          <div className="loading-indicator">Loading profiles...</div>
        ) : profiles.length > 0 ? (
          <div className="influencer-profiles">
            {profiles.map((profile) => (
              <div 
                key={profile.id} 
                className="influencer-profile"
                onClick={() => handleProfileClick(profile.username)}
              >
                <div className="influencer-avatar">
                  <img src={profile.image} alt={profile.name} />
                </div>
                <div className="influencer-info">
                  <div className="influencer-name">
                    {profile.name}
                    {profile.verified && (
                      <BsCheckCircleFill className="verified-badge-icon" />
                    )}
                  </div>
                  <div className="influencer-username">@{profile.username}</div>
                </div>
                <div className="profile-arrow">
                  <BsArrowRight />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">No profiles found</div>
        )}
      </div>
    </div>
  );
};

export default SearchDropdown;
