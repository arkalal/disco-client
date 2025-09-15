"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineInstagram } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { BsArrowRight } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import SearchDropdown from "./SearchDropdown";

const SearchSection = () => {
  const router = useRouter();
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
  
  // Format category name for API (lowercase with hyphens)
  const formatCategoryForApi = (categoryName) => {
    if (!categoryName) return "";
    // Convert to lowercase and replace spaces with hyphens
    return categoryName.toLowerCase().replace(/\s+/g, "-");
  };
  
  const handleSearch = () => {
    // If there are selected categories, navigate to filter page with categories as URL parameters
    if (selectedCategories.length > 0) {
      // Extract category names for the URL - normalize all to lowercase with hyphens for consistent filtering
      const categoryValues = selectedCategories.map(cat => {
        // If it's an object with a name property, use that
        if (typeof cat === 'object' && cat.name) {
          return formatCategoryForApi(cat.name);
        }
        // Otherwise return the category as is but properly formatted
        return typeof cat === 'string' ? formatCategoryForApi(cat) : cat;
      });
      
      // Create URL with categories as comma-separated query parameter
      const queryParams = new URLSearchParams();
      queryParams.append('categories', categoryValues.join(','));
      
      // Add search query if available
      if (searchQuery) {
        queryParams.append('q', searchQuery);
      }
      
      // Log what we're navigating with for debugging
      console.log('Navigating to filter page with categories:', categoryValues);
      
      // Navigate to filter page with query parameters
      router.push(`/filterCreators?${queryParams.toString()}`);
    } else if (searchQuery) {
      // If only search query but no categories, still navigate but just with the query
      router.push(`/filterCreators?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const handleCategorySelect = (category) => {
    // Check if this category is already selected
    const isAlreadySelected = selectedCategories.some(cat => 
      (cat === category) || 
      (cat.name && category.name && cat.name === category.name)
    );
    
    // If not already selected, add it to the array
    if (!isAlreadySelected) {
      setSelectedCategories([...selectedCategories, category]);
    }
    
    // Keep dropdown open to allow selecting multiple categories
    // Only close if user clicks outside or presses search
  };
  
  const removeCategory = (category, e) => {
    e.stopPropagation(); // Prevent dropdown from opening
    
    // Handle removal of categories whether they're objects or strings
    setSelectedCategories(selectedCategories.filter(cat => {
      // If both are objects with name property
      if (cat.name && category.name) {
        return cat.name !== category.name;
      }
      // Direct comparison for string categories or identical objects
      return cat !== category;
    }));
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
                    aria-label={`Remove ${category.name} category`}
                  >
                    <IoMdClose />
                  </button>
                </div>
              ))}
              {selectedCategories.length > 1 && (
                <div className="category-count" title="Number of selected categories">
                  {selectedCategories.length} categories
                </div>
              )}
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
            selectedCategories={selectedCategories}
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
