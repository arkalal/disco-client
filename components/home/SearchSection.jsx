"use client";

import { useState, useRef, useEffect } from "react";
import { AiOutlineInstagram } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { BsArrowRight } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import SearchDropdown from "./SearchDropdown";

const SearchSection = () => {
  const [platform, setPlatform] = useState("Instagram");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);

  const toggleDropdown = () => {
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
    }
  };
  
  const handleSearch = () => {
    // Handle search functionality
    console.log("Searching for:", searchQuery);
    console.log("Selected categories:", selectedCategories);
    // Navigate to search results page or perform search
  };
  
  const handleCategorySelect = (category) => {
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
    setIsDropdownOpen(false);
  };
  
  const removeCategory = (category, e) => {
    e.stopPropagation(); // Prevent dropdown from opening
    setSelectedCategories(selectedCategories.filter(cat => cat !== category));
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
        className={`search-container ${isDropdownOpen ? "dropdown-open" : ""} ${selectedCategories.length > 0 ? "has-categories" : ""}`}
        ref={searchContainerRef}
      >
        <div className="platform-selector">
          <AiOutlineInstagram className="platform-icon" />
          <span>{platform}</span>
          <MdKeyboardArrowDown className="arrow-icon" />
        </div>

        <div className="search-input-wrapper" onClick={toggleDropdown}>
          {selectedCategories.length > 0 && (
            <div className="selected-categories">
              {selectedCategories.map((category, index) => (
                <div key={index} className="selected-category">
                  {category.icon && <span className="category-icon">{category.icon}</span>}
                  <span className="category-name">{category.name}</span>
                  <button 
                    className="remove-category" 
                    onClick={(e) => removeCategory(category, e)}
                  >
                    <IoMdClose />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <input
            type="text"
            placeholder={selectedCategories.length > 0 ? "" : "Search Brands, Influencers, Categories and so on"}
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            ref={inputRef}
          />
        </div>
        
        {selectedCategories.length > 0 && (
          <button className="search-button" onClick={handleSearch}>
            <FiSearch />
            <span>Search</span>
          </button>
        )}

        {isDropdownOpen && (
          <SearchDropdown
            isOpen={isDropdownOpen}
            onClose={closeDropdown}
            onCategorySelect={handleCategorySelect}
            searchContainerRef={searchContainerRef}
            searchQuery={searchQuery}
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
