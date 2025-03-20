"use client";

import { useState, useRef, useEffect } from "react";
import { AiOutlineInstagram } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { BsArrowRight } from "react-icons/bs";
import SearchDropdown from "./SearchDropdown";

const SearchSection = () => {
  const [platform, setPlatform] = useState("Instagram");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);

  const toggleDropdown = () => {
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
    }
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Add event listener to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, []);

  // Focus input when dropdown is toggled open
  useEffect(() => {
    if (isDropdownOpen && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current.focus();
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isDropdownOpen]);

  return (
    <div className="search-section">
      <h1>Browse from Largest Database of Influencers</h1>

      <div
        className={`search-container ${isDropdownOpen ? "dropdown-open" : ""}`}
        ref={searchContainerRef}
      >
        <div className="platform-selector">
          <AiOutlineInstagram className="platform-icon" />
          <span>{platform}</span>
          <MdKeyboardArrowDown className="arrow-icon" />
        </div>

        <input
          type="text"
          placeholder="Search Brands, Influencers, Categories and so on"
          className="search-input"
          onClick={toggleDropdown}
          ref={inputRef}
        />

        {isDropdownOpen && (
          <SearchDropdown
            isOpen={isDropdownOpen}
            onClose={closeDropdown}
            searchContainerRef={searchContainerRef}
          />
        )}
      </div>

      <div className="insights-banner">
        <div className="new-badge">NEW</div>
        <span className="banner-text">
          Unlock Insights with Keyword & Hashtag Analysis
        </span>
        <BsArrowRight className="arrow-icon" />
      </div>
    </div>
  );
};

export default SearchSection;
