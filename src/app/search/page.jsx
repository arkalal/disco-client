"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import { AiOutlineInstagram, AiOutlineMessage } from "react-icons/ai";
import { MdKeyboardArrowDown, MdOutlineAnalytics } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import {
  BsArrowRight,
  BsLightbulb,
  BsSearch,
  BsBarChart,
} from "react-icons/bs";
import { IconArrowsExchange } from "@tabler/icons-react";
import { RiListCheck2 } from "react-icons/ri";
import { VscGraph } from "react-icons/vsc";
import { BiNotification } from "react-icons/bi";
import { IoHomeOutline } from "react-icons/io5";
import Link from "next/link";
import SearchDropdown from "../../../components/home/SearchDropdown";

import "../../../components/layout/MainLayout.scss";
import "../../../components/layout/Sidebar.scss";
import "../../../components/home/SearchDropdown.scss";
import "./search.scss";

const SearchPage = () => {
  const router = useRouter();
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

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };
  
  const handleCategorySelect = (category) => {
    if (!selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
    setIsDropdownOpen(false);
  };
  
  const removeCategory = (category, e) => {
    e.stopPropagation(); // Prevent dropdown from opening
    setSelectedCategories(selectedCategories.filter(cat => 
      cat.name !== category.name || cat.icon !== category.icon
    ));
  };
  
  const handleSearch = () => {
    // If there are selected categories, navigate to filter page with categories as URL parameters
    if (selectedCategories.length > 0) {
      // Extract category names for the URL - normalize all to lowercase for consistent filtering
      const categoryValues = selectedCategories.map(cat => {
        // If it's an object with a name property, use that
        if (typeof cat === 'object' && cat.name) {
          return cat.name.toLowerCase();
        }
        // Otherwise return the category as is but lowercase
        return typeof cat === 'string' ? cat.toLowerCase() : cat;
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

  useEffect(() => {
    if (isDropdownOpen && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current.focus();
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isDropdownOpen]);

  const categories = [
    {
      id: "bling",
      name: "Exclusive Bling Talents",
      type: "Entertainment",
      count: 54,
      profiles: [
        { id: 1, image: "https://via.placeholder.com/40" },
        { id: 2, image: "https://via.placeholder.com/40" },
        { id: 3, image: "https://via.placeholder.com/40" },
        { id: 4, image: "https://via.placeholder.com/40" },
      ],
    },
    {
      id: "comedians",
      name: "Comedians",
      type: "Entertainment",
      count: 17,
      profiles: [
        { id: 1, image: "https://via.placeholder.com/40" },
        { id: 2, image: "https://via.placeholder.com/40" },
        { id: 3, image: "https://via.placeholder.com/40" },
        { id: 4, image: "https://via.placeholder.com/40" },
      ],
    },
    {
      id: "male-tv",
      name: "Male TV Presenters",
      type: "Entertainment",
      count: 13,
      profiles: [
        { id: 1, image: "https://via.placeholder.com/40" },
        { id: 2, image: "https://via.placeholder.com/40" },
        { id: 3, image: "https://via.placeholder.com/40" },
        { id: 4, image: "https://via.placeholder.com/40" },
      ],
    },
    {
      id: "female-tv",
      name: "Female TV Presenters",
      type: "Entertainment",
      count: 25,
      profiles: [
        { id: 1, image: "https://via.placeholder.com/40" },
        { id: 2, image: "https://via.placeholder.com/40" },
        { id: 3, image: "https://via.placeholder.com/40" },
        { id: 4, image: "https://via.placeholder.com/40" },
      ],
    },
    {
      id: "dancers",
      name: "Dancers",
      type: "Entertainment",
      count: 34,
      profiles: [
        { id: 1, image: "https://via.placeholder.com/40" },
        { id: 2, image: "https://via.placeholder.com/40" },
        { id: 3, image: "https://via.placeholder.com/40" },
        { id: 4, image: "https://via.placeholder.com/40" },
      ],
    },
    {
      id: "female-musicians",
      name: "Female Musicians",
      type: "Entertainment",
      count: 28,
      profiles: [
        { id: 1, image: "https://via.placeholder.com/40" },
        { id: 2, image: "https://via.placeholder.com/40" },
        { id: 3, image: "https://via.placeholder.com/40" },
        { id: 4, image: "https://via.placeholder.com/40" },
      ],
    },
    {
      id: "male-musicians",
      name: "Male Musicians",
      type: "Entertainment",
      count: 26,
      profiles: [
        { id: 1, image: "https://via.placeholder.com/40" },
        { id: 2, image: "https://via.placeholder.com/40" },
        { id: 3, image: "https://via.placeholder.com/40" },
        { id: 4, image: "https://via.placeholder.com/40" },
      ],
    },
    {
      id: "female-rjs",
      name: "Female RJs",
      type: "General",
      count: 32,
      profiles: [
        { id: 1, image: "https://via.placeholder.com/40" },
        { id: 2, image: "https://via.placeholder.com/40" },
        { id: 3, image: "https://via.placeholder.com/40" },
        { id: 4, image: "https://via.placeholder.com/40" },
      ],
    },
    {
      id: "male-rjs",
      name: "Male RJs",
      type: "General",
      count: 18,
      profiles: [
        { id: 1, image: "https://via.placeholder.com/40" },
        { id: 2, image: "https://via.placeholder.com/40" },
        { id: 3, image: "https://via.placeholder.com/40" },
        { id: 4, image: "https://via.placeholder.com/40" },
      ],
    },
    {
      id: "female-actors-andhra",
      name: "Female Actors from Andhra/Telangana",
      type: "Entertainment",
      count: 40,
      profiles: [
        { id: 1, image: "https://via.placeholder.com/40" },
        { id: 2, image: "https://via.placeholder.com/40" },
        { id: 3, image: "https://via.placeholder.com/40" },
        { id: 4, image: "https://via.placeholder.com/40" },
      ],
    },
    {
      id: "female-actors-karnataka",
      name: "Female Actors from Karnataka",
      type: "Entertainment",
      count: 34,
      profiles: [
        { id: 1, image: "https://via.placeholder.com/40" },
        { id: 2, image: "https://via.placeholder.com/40" },
        { id: 3, image: "https://via.placeholder.com/40" },
        { id: 4, image: "https://via.placeholder.com/40" },
      ],
    },
    {
      id: "female-actors-kerala",
      name: "Female Actors from Kerala",
      type: "Entertainment",
      count: 85,
      profiles: [
        { id: 1, image: "https://via.placeholder.com/40" },
        { id: 2, image: "https://via.placeholder.com/40" },
        { id: 3, image: "https://via.placeholder.com/40" },
        { id: 4, image: "https://via.placeholder.com/40" },
      ],
    },
  ];

  return (
    <div className="search-page-container">
      <div className="collapsible-sidebar">
        <div className="logo">
          <Link href="/home">
            <span className="logo-text">disco</span>
          </Link>
        </div>

        <nav className="nav-menu">
          <Link href="/home" className="nav-item">
            <IoHomeOutline className="nav-icon" />
            <span className="nav-label">Home</span>
          </Link>
          <Link href="/campaign-ideas" className="nav-item">
            <BsLightbulb className="nav-icon" />
            <span className="nav-label">Campaign Ideas</span>
          </Link>
          <Link href="/search" className="nav-item active">
            <BsSearch className="nav-icon" />
            <span className="nav-label">Influencer Search</span>
          </Link>
          <Link href="/influencer-comparison" className="nav-item">
            <IconArrowsExchange className="nav-icon" />
            <span className="nav-label">Influencer Comparison</span>
          </Link>
          <Link href="/plans-lists" className="nav-item">
            <RiListCheck2 className="nav-icon" />
            <span className="nav-label">Plans & Lists</span>
          </Link>
          <Link href="/messages" className="nav-item">
            <AiOutlineMessage className="nav-icon" />
            <span className="nav-label">Messages</span>
            <span className="badge">3</span>
          </Link>
          <Link href="/campaign-reports" className="nav-item">
            <BsBarChart className="nav-icon" />
            <span className="nav-label">Campaign Reports</span>
          </Link>
          <Link href="/consolidated-reports" className="nav-item">
            <MdOutlineAnalytics className="nav-icon" />
            <span className="nav-label">Consolidated Reports</span>
          </Link>
          <Link href="/content-research" className="nav-item">
            <VscGraph className="nav-icon" />
            <span className="nav-label">Content Research</span>
            <span className="badge">New</span>
          </Link>
          <Link href="/competitor-analysis" className="nav-item">
            <BsBarChart className="nav-icon" />
            <span className="nav-label">Competitor Analysis</span>
          </Link>
        </nav>

        <div className="notifications">
          <Link href="/notifications" className="nav-item">
            <BiNotification className="nav-icon" />
            <span className="nav-label">Notifications</span>
          </Link>
        </div>

        <div className="try-disco">
          <button className="try-button">
            TRY DISCO
            <span className="credits">3 credits remaining</span>
          </button>
        </div>
      </div>

      <main className="search-content">
        <div className="search-header">
          <h1>Browse from Largest Database of Influencers</h1>

          <div
            className={`search-container ${
              isDropdownOpen ? "dropdown-open" : ""
            } ${selectedCategories.length > 0 ? "has-categories" : ""}`}
            ref={searchContainerRef}
          >
            <div className="platform-selector">
              <AiOutlineInstagram className="platform-icon" />
              <span>Instagram</span>
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
                onClick={toggleDropdown}
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
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

        <div className="influencer-lists-section">
          <div className="section-header">
            <h2>✨ Influencer lists, curated for you!</h2>

            <div className="filters">
              <div className="filter-dropdown">
                <span>All Platforms</span>
                <MdKeyboardArrowDown />
              </div>

              <div className="filter-dropdown">
                <span>All Category</span>
                <MdKeyboardArrowDown />
              </div>

              <button className="search-button">
                <FiSearch />
              </button>
            </div>
          </div>

          <div className="card-grid">
            {categories.map((category) => (
              <div key={category.id} className="category-card">
                <div className="card-tag">
                  {category.type === "Entertainment"
                    ? "🎭 Entertainment"
                    : "📱 General"}
                </div>
                <h3>{category.name}</h3>

                <div className="influencer-avatars">
                  {category.profiles.map((profile) => (
                    <div key={profile.id} className="avatar">
                      <img src={profile.image} alt="Influencer" />
                    </div>
                  ))}
                  <div className="count">+{category.count}</div>
                </div>

                <div className="instagram-badge">
                  <AiOutlineInstagram className="instagram-icon" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
