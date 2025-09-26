"use client";

// Helper function to format location names for API compatibility
const formatLocationForApi = (location) => {
  if (!location) return "";
  // Convert to lowercase and replace spaces with hyphens
  return location.toLowerCase().replace(/\s+/g, "-");
};

// Helper function to safely handle category normalization
const safeCategoryName = (cat) => {
  // Handle various category formats (string, object, null)
  if (cat === null || cat === undefined) return "";
  if (typeof cat === "string") return cat.toLowerCase();
  if (typeof cat === "object" && cat.name) return cat.name.toLowerCase();
  return "";
};

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchDropdown from "../home/SearchDropdown";
import { IoSearchOutline } from "react-icons/io5";
import { IoCloseCircle } from "react-icons/io5";
import { IoChevronDownOutline } from "react-icons/io5";
import { IoChevronUpOutline } from "react-icons/io5";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { BsFilterRight } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { RiArrowRightSLine } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import { BiRadioCircle, BiRadioCircleMarked } from "react-icons/bi";
import { MdOutlineClose } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { TbCategory } from "react-icons/tb";
import { BsPerson } from "react-icons/bs";
import { FiInfo } from "react-icons/fi";
import { AiOutlineEye } from "react-icons/ai";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { HiPlus } from "react-icons/hi";
import {
  FiFilter,
  FiCheck,
  FiX,
  FiUser,
  FiDownload,
  FiEdit2,
  FiInstagram,
  FiArrowLeft,
} from "react-icons/fi";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { BsFileEarmarkPlus } from "react-icons/bs";
import { IoListOutline } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import "./FilterCreatorsUI.scss";
import {
  SidebarLoader,
  UnsavedPlanView,
  AllPlansView,
} from "./SidebarComponents";
import "./SidebarComponents.scss";
import ListDetailView from "./ListDetailView";
import EditListDrawer from "../drawers/EditListDrawer";
import CreateListDrawer from "../drawers/CreateListDrawer";
import SavePlanModal from "./SavePlanModal";
import CreatePlanModal from "./CreatePlanModal.jsx";

// Add to List Dropdown Component
const AddToListDropdown = ({
  isOpen,
  onClose,
  items,
  onItemClick,
  isFirstRow,
  isPlansMode = false,
  plans = [],
  onCreateNewPlan,
  onCreateNewList,
  onSelectPlanList,
  onHoverIn,
  onHoverOut,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  if (isPlansMode) {
    return (
      <div
        className={`add-list-dropdown ${isOpen ? "open" : ""} ${
          isFirstRow ? "first-row" : ""
        }`}
        ref={dropdownRef}
        onMouseEnter={() => onHoverIn && onHoverIn()}
        onMouseLeave={() => onHoverOut && onHoverOut()}
      >
        <div
          className="dropdown-item"
          onClick={() => {
            onClose();
            onCreateNewPlan && onCreateNewPlan();
          }}
        >
          <span className="item-icon">
            <BsFileEarmarkPlus />
          </span>
          To a new plan
        </div>
        <div className="dropdown-section-header">Recent Plans</div>
        {plans.map((plan) => (
          <div className="dropdown-item plan-item" key={plan.id}>
            <span className="item-icon">
              <FiInstagram size={14} />
            </span>
            <span className="plan-name">{plan.name}</span>
            <span className="submenu-arrow">›</span>
            <div className="plan-submenu">
              <div
                className="submenu-item"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                  onCreateNewList && onCreateNewList(plan);
                }}
              >
                To a new list
              </div>
              {plan.lists &&
                plan.lists.map((list) => (
                  <div
                    key={list.id}
                    className="submenu-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                      onSelectPlanList && onSelectPlanList(plan, list);
                    }}
                  >
                    {list.name}
                  </div>
                ))}
            </div>
          </div>
        ))}
        <div
          className="dropdown-item"
          onClick={() => onItemClick("view-plans")}
        >
          View all plans
        </div>
      </div>
    );
  }

  return (
    <div
      className={`add-list-dropdown ${isOpen ? "open" : ""} ${
        isFirstRow ? "first-row" : ""
      }`}
      ref={dropdownRef}
      onMouseEnter={() => onHoverIn && onHoverIn()}
      onMouseLeave={() => onHoverOut && onHoverOut()}
    >
      {items.map((item) => (
        <div
          className="dropdown-item"
          key={item.id}
          onClick={() => onItemClick(item.id)}
        >
          <span className="item-icon">{item.icon}</span>
          {item.label}
        </div>
      ))}
    </div>
  );
};

// Add Profile to Plan Modal Component
const AddProfileModal = ({ isOpen, onClose, onAddToList }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container" ref={modalRef}>
        <div className="modal-header">
          <h3>Add Profile to Plan</h3>
          <button className="close-button" onClick={onClose}>
            <MdClose />
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Select Plan</label>
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Search plan name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <FiSearch className="search-icon" />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="add-to-list-btn"
            disabled={!searchTerm.trim()}
            onClick={() => {
              if (searchTerm.trim()) {
                onAddToList(searchTerm);
              }
            }}
          >
            Add To List
          </button>
        </div>
      </div>
    </div>
  );
};

export default function FilterCreatorsUI() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get search categories from URL parameters
  const categoriesParam = searchParams.get("categories");
  const initialCategories = categoriesParam ? categoriesParam.split(",") : [];

  // State for managing categories
  const [categories, setCategories] = useState(initialCategories);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  // State for influencers data and loading state
  const [influencers, setInfluencers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  // Pagination removed per requirement

  // Filter states
  const [activeDropdown, setActiveDropdown] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [followersFilter, setFollowersFilter] = useState({ min: 0, max: 0 });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);

  // State for add-to-list dropdown and modal
  const [activeRowId, setActiveRowId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  // Robust hover handling for action dropdowns
  const hoverCloseTimer = useRef(null);

  // States for sidebar transitions
  const [sidebarState, setSidebarState] = useState("default"); // 'default', 'loading', 'unsaved-plan', 'list-detail', 'all-plans'
  const [selectedCreators, setSelectedCreators] = useState([]);
  const [dropdownItems, setDropdownItems] = useState([
    { id: "new-plan", label: "To a new plan", icon: <BsFileEarmarkPlus /> },
    { id: "view-plans", label: "View all plans", icon: <IoListOutline /> },
  ]);
  const [createdLists, setCreatedLists] = useState([]);
  const [loadingButtonId, setLoadingButtonId] = useState(null); // To track which button is loading
  const [plans, setPlans] = useState([
    {
      id: "plan-1",
      name: "Unsaved Plan",
      dateLabel: "Sep 23, 2025",
      lists: [{ id: "list-1", name: "List 1" }],
    },
  ]);

  // States for list management UI
  const [showEditListDrawer, setShowEditListDrawer] = useState(false);
  const [showCreateListDrawer, setShowCreateListDrawer] = useState(false);
  const [showSavePlanModal, setShowSavePlanModal] = useState(false);
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [currentListView, setCurrentListView] = useState(null); // To track which list is being viewed
  const [currentListData, setCurrentListData] = useState({
    id: "1",
    name: "List 1",
    color: "#4F46E5",
    platform: "instagram",
    deliverables: [],
  });

  const [selectedInfluencerSize, setSelectedInfluencerSize] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categories: false,
    location: true,
    gender: false,
    followers: false,
    influenceScore: false,
    keywordSearch: false,
    captionsKeywords: false,
    bioKeywords: false,
    contact: false,
    contactAvailability: false,
    audience: false,
    audienceCredibility: false,
    audienceGender: false,
    audienceLocation: false,
    audienceInterest: false,
    audienceLanguage: false,
    audienceAgeRange: false,
    averageFollowerGrowth: false,
    postPerformance: false,
    lastPosted: false,
    engagementRate: false,
    averageLikes: false,
    averageComments: false,
    averageImageLikes: false,
    averageImageComments: false,
    averageReelPlays: false,
    averageReelLikes: false,
    averageReelComments: false,
  });

  const [selectedCities, setSelectedCities] = useState([]);
  const [fasterResponses, setFasterResponses] = useState(true);
  const [instagramVerified, setInstagramVerified] = useState(false);
  const [hasYoutube, setHasYoutube] = useState(false);

  // Refs for each dropdown button to position dropdowns correctly
  const genderButtonRef = useRef(null);
  const locationButtonRef = useRef(null);
  const followersButtonRef = useRef(null);
  const dropdownRef = useRef(null);
  const allFiltersRef = useRef(null);
  const allFiltersBtnRef = useRef(null);

  // Fetch creators based on filters
  const fetchCreators = async (filters = {}, categoriesList = null) => {
    setIsLoading(true);
    console.log("==== Starting fetchCreators ====\n");
    console.log("Current gender filter state:", genderFilter);
    console.log("Filter options:", filters);

    try {
      // Build the query parameters
      const queryParams = new URLSearchParams();
      // No pagination params

      // Use provided categories list if available, otherwise use state
      const categoriesToUse =
        categoriesList !== null ? categoriesList : categories;

      // Add categories - always include this filter
      if (categoriesToUse && categoriesToUse.length > 0) {
        // Convert all categories to lowercase for consistent filtering and handle both string and object formats
        const normalizedCategories = categoriesToUse.map((cat) => {
          const categoryName = typeof cat === "string" ? cat : cat?.name || "";
          return (categoryName || "").toLowerCase();
        });
        console.log("Adding categories to query:", normalizedCategories);
        queryParams.append("categories", normalizedCategories.join(","));
      }

      // Only add location filters if explicitly selected
      if (
        selectedCountry &&
        selectedCountry !== "" &&
        filters.applyLocationFilter
      ) {
        // Ensure all locations are consistently formatted (lowercase)
        const formattedCountry = formatLocationForApi(selectedCountry);
        queryParams.append("locations", formattedCountry);

        // Include cities if selected
        if (selectedCities && selectedCities.length > 0) {
          // Add cities to the locations parameter
          // Convert all locations to lowercase for consistency
          const locations = [
            formattedCountry,
            ...selectedCities.map((city) => formatLocationForApi(city)),
          ];
          queryParams.set("locations", locations.join(","));
        }
      } else if (selectedCountry && selectedCountry !== "") {
        // Always include selectedCountry if it's set, even without explicit filter flag
        // Ensure all locations are consistently formatted (lowercase)
        const formattedCountry = formatLocationForApi(selectedCountry);
        queryParams.append("locations", formattedCountry);

        // Include cities if selected
        if (selectedCities && selectedCities.length > 0) {
          // Add cities to the locations parameter
          // Convert all locations to lowercase for consistency
          const locations = [
            formattedCountry,
            ...selectedCities.map((city) => formatLocationForApi(city)),
          ];
          queryParams.set("locations", locations.join(","));
        }
      }

      // Only add gender filter if it's specifically 'm' or 'f'
      // The empty string '' represents the 'All' option and should not send a parameter
      if (genderFilter === "m" || genderFilter === "f") {
        queryParams.append("genders", genderFilter);
        console.log("Adding gender filter:", genderFilter);
      } else {
        // No gender filter when 'All' is selected
        console.log("No gender filter applied (All selected)");
      }

      // Only add followers range if explicitly selected
      if (followersFilter.min && filters.applyFollowersFilter) {
        queryParams.append("minFollowers", followersFilter.min);
      }

      if (followersFilter.max && filters.applyFollowersFilter) {
        queryParams.append("maxFollowers", followersFilter.max);
      }

      // Add any additional filters from the parameter
      Object.entries(filters).forEach(([key, value]) => {
        if (
          value &&
          [
            "categories",
            "applyLocationFilter",
            "applyGenderFilter",
            "applyFollowersFilter",
          ].indexOf(key) === -1
        ) {
          queryParams.append(key, value);
        }
      });

      // Log the complete URL for debugging
      const requestUrl = `/api/instagram/filter?${queryParams.toString()}`;
      console.log("Sending request to:", requestUrl);

      const response = await fetch(requestUrl);

      if (!response.ok) {
        throw new Error(`Error fetching filtered creators: ${response.status}`);
      }

      const data = await response.json();

      // Update state with creators data
      setInfluencers(data.data || []);

      // Update results count
      setTotalResults(data.metadata?.total_results || data.data?.length || 0);
    } catch (error) {
      console.error("Error fetching filtered creators:", error);
      setInfluencers([]);

      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle category selection from dropdown
  const handleCategorySelect = (category) => {
    // Check if category already exists to prevent duplicates
    const categoryName =
      typeof category === "string" ? category : category?.name || "";
    if (
      !categories.some((cat) => {
        const catName = typeof cat === "string" ? cat : cat?.name || "";
        return (
          (catName || "").toLowerCase() === (categoryName || "").toLowerCase()
        );
      })
    ) {
      // Only update state, don't refresh data yet (wait for search button click)
      const newCategories = [...categories, category];
      setCategories(newCategories);
    }
  };

  // Handle removing a category
  const removeCategory = (category, e) => {
    if (e) e.stopPropagation();

    const categoryName =
      typeof category === "string" ? category : category?.name || "";
    const newCategories = categories.filter((cat) => {
      const catName = typeof cat === "string" ? cat : cat?.name || "";
      return (
        (catName || "").toLowerCase() !== (categoryName || "").toLowerCase()
      );
    });

    setCategories(newCategories);
    // Immediately refresh creators list with updated categories
    setIsLoading(true); // Show loading state

    // Update URL with new categories
    const newUrl =
      newCategories.length > 0
        ? `/filterCreators?categories=${newCategories
            .map((cat) => (typeof cat === "string" ? cat : cat?.name || ""))
            .join(",")}`
        : "/filterCreators";

    window.history.pushState({}, "", newUrl);

    // Fetch with new categories
    fetchCreators({}, newCategories); // Pass categories directly to ensure immediate update
  };

  // Handle clearing all categories
  const clearAllCategories = () => {
    setCategories([]);
    setSearchQuery(""); // Clear search input
    setShowCategoryDropdown(false); // Close dropdown if open
    // Refresh creators list with no categories
    refreshCreatorsWithCategories([]);
  };

  // Function to refresh creators list with updated categories
  const refreshCreatorsWithCategories = (categoryList) => {
    setIsLoading(true);

    // Update URL with new categories (without page navigation)
    const newUrl =
      categoryList.length > 0
        ? `/filterCreators?categories=${categoryList
            .map((cat) => (typeof cat === "string" ? cat : cat?.name || ""))
            .join(",")}`
        : "/filterCreators";

    window.history.pushState({}, "", newUrl);

    // Call fetchCreators
    fetchCreators({});
  };

  // Open category dropdown - only opens it, doesn't toggle
  const toggleCategoryDropdown = () => {
    // Only set to true, never close with this function
    if (!showCategoryDropdown) {
      setShowCategoryDropdown(true);
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 10);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    console.log("Categories from URL:", categories);
    if (categories.length > 0) {
      console.log("Fetching creators with categories:", categories);
      fetchCreators();
    } else {
      console.log("No categories found, fetching all creators");
      fetchCreators();
    }
  }, []);

  // Handle clicking outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      // Close category dropdown when clicking outside
      if (
        showCategoryDropdown &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
      }

      // Close other dropdowns
      if (
        activeDropdown &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !genderButtonRef.current?.contains(event.target) &&
        !locationButtonRef.current?.contains(event.target) &&
        !followersButtonRef.current?.contains(event.target)
      ) {
        setActiveDropdown("");
      }

      // Close all filters panel when clicking outside
      if (
        showAllFilters &&
        allFiltersRef.current &&
        !allFiltersRef.current.contains(event.target) &&
        !allFiltersBtnRef.current?.contains(event.target)
      ) {
        setShowAllFilters(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown, showAllFilters, showCategoryDropdown]);

  // Add overflow hidden to body when all filters or dropdown is open
  useEffect(() => {
    // Only prevent scrolling for all filters overlay, not for small dropdowns
    if (showAllFilters) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showAllFilters]);

  // Update document title with selected categories
  useEffect(() => {
    const categoryLabels = categories
      .map((cat) => (typeof cat === "string" ? cat : cat.name))
      .join(", ");
    document.title = categoryLabels
      ? `Disco - ${categoryLabels}`
      : "Disco - Filter Creators";
  }, [categories]);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? "" : dropdown);
  };

  // Handle country selection
  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    // Immediately fetch with the new location filter
    setTimeout(() => fetchCreators({ applyLocationFilter: true }), 0);
  };

  // Handle influencer size selection
  const handleInfluencerSizeChange = (size) => {
    setSelectedInfluencerSize(size);

    // Map size selection to follower range
    let min = 0;
    let max = 0;

    switch (size) {
      case "nano":
        min = 1000;
        max = 10000;
        break;
      case "micro":
        min = 10000;
        max = 50000;
        break;
      case "mid-tier":
        min = 50000;
        max = 500000;
        break;
      case "macro":
        min = 500000;
        max = 1000000;
        break;
      case "mega":
        min = 1000000;
        max = 0; // No upper limit
        break;
      default:
        min = 0;
        max = 0;
    }

    // Just set the values, don't apply filters yet
    // This will be applied when the user clicks the Apply button
    setFollowersFilter({ min, max });
  };

  // Toggle all filters sidebar
  const toggleAllFilters = () => {
    setShowAllFilters(!showAllFilters);
  };

  // Toggle section expansion in all filters sidebar
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Handle city selection
  const toggleCitySelection = (city) => {
    let newSelectedCities;
    if (selectedCities.includes(city)) {
      newSelectedCities = selectedCities.filter((c) => c !== city);
    } else {
      newSelectedCities = [...selectedCities, city];
    }
    setSelectedCities(newSelectedCities);

    // Update filters when city selection changes
    setTimeout(() => fetchCreators(), 0);
  };

  // Remove city from selection
  const removeCity = (city) => {
    const newSelectedCities = selectedCities.filter((c) => c !== city);
    setSelectedCities(newSelectedCities);

    // Update filters when city is removed
    setTimeout(() => fetchCreators(), 0);
  };

  // Handle gender filter change
  const handleGenderChange = (gender) => {
    console.log("Gender filter selected:", gender);

    // Set loading state immediately
    setIsLoading(true);

    // Update gender filter state
    setGenderFilter(gender);

    // Close the dropdown immediately for better UX
    setActiveDropdown("");

    // Build query with proper gender parameter
    let queryParams = new URLSearchParams();

    // Always include categories
    if (categories && categories.length > 0) {
      const normalizedCategories = categories.map(safeCategoryName);
      queryParams.append("categories", normalizedCategories.join(","));
    }

    // Include location if set
    if (selectedCountry) {
      // Format multi-word locations with hyphens instead of spaces
      // e.g. "United Arab Emirates" -> "united-arab-emirates"
      const formattedCountry = formatLocationForApi(selectedCountry);
      queryParams.append("locations", formattedCountry);

      // Include cities if selected
      if (selectedCities && selectedCities.length > 0) {
        // Format cities with hyphens too
        const locations = [
          formattedCountry,
          ...selectedCities.map((city) => formatLocationForApi(city)),
        ];
        queryParams.set("locations", locations.join(","));
      }
    }

    // Only include gender for 'm' or 'f', not for 'All' (empty string)
    if (gender === "m" || gender === "f") {
      queryParams.append("genders", gender);
      console.log("Adding gender filter parameter:", gender);
    } else {
      console.log("Gender filter set to All - not adding gender parameter");
    }

    // Log the complete URL for debugging
    const requestUrl = `/api/instagram/filter?${queryParams.toString()}`;
    console.log("Sending gender filter request to:", requestUrl);

    // Make the request
    fetch(requestUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error fetching filtered creators: ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log(
          "Gender filter results received:",
          data.data?.length || 0,
          "profiles"
        );
        setInfluencers(data.data || []);
        setTotalResults(data.metadata?.total_results || data.data?.length || 0);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error in gender filter fetch:", error);
        setInfluencers([]);
        setIsLoading(false);
      });
  };

  // Apply all filters - called when user clicks Apply button in the filter panel
  const applyAllFilters = () => {
    // Pass filter application flags to indicate these filters should be applied
    fetchCreators({
      applyLocationFilter: true,
      applyGenderFilter: true,
      applyFollowersFilter: true,
    });
    setShowAllFilters(false);
  };

  // Reset all filters
  const resetFilters = () => {
    console.log("Resetting all filters");

    // Reset gender filter
    setGenderFilter("");

    // Reset location filters
    setLocationFilter("");
    setSelectedCountry("");
    setSelectedCities([]);

    // Reset followers filters
    setFollowersFilter({ min: 0, max: 0 });
    setSelectedInfluencerSize("");

    // Set loading state
    setIsLoading(true);

    // Build clean query with only categories
    let queryParams = new URLSearchParams();

    // Always include categories
    if (categories && categories.length > 0) {
      const normalizedCategories = categories.map(safeCategoryName);
      queryParams.append("categories", normalizedCategories.join(","));
    }

    // Log the complete URL for debugging
    const requestUrl = `/api/instagram/filter?${queryParams.toString()}`;
    console.log("Sending reset filters request to:", requestUrl);

    // Make the request directly to ensure clean state
    fetch(requestUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error fetching filtered creators: ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log(
          "Reset filter results received:",
          data.data?.length || 0,
          "profiles"
        );
        setInfluencers(data.data || []);
        setTotalResults(data.metadata?.total_results || data.data?.length || 0);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error in reset filter fetch:", error);
        setInfluencers([]);

        setTotalResults(0);
        setIsLoading(false);
      });
  };

  // Static data removed - we now use dynamic data from the API

  // Pagination removed

  return (
    <div className="filter-creators-container">
      <div className="main-content">
        <div className="search-filters-section">
          <div className="filters-row">
            <div className="active-filters">
              {categories.length > 0
                ? categories.map((category, index) => (
                    <div className="filter-badge" key={index}>
                      <IoCloseCircle
                        className="filter-close-icon"
                        onClick={(e) => removeCategory(category, e)}
                      />
                      <span>
                        {typeof category === "string"
                          ? category
                          : category.name}
                      </span>
                    </div>
                  ))
                : null}
              <div
                className="search-input-container"
                onClick={toggleCategoryDropdown}
                ref={searchInputRef}
              >
                <input
                  type="text"
                  placeholder="Add More..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() =>
                    !showCategoryDropdown && setShowCategoryDropdown(true)
                  }
                />

                <div
                  className="search-dropdown-container"
                  style={{ display: showCategoryDropdown ? "block" : "none" }}
                >
                  <div className="search-dropdown-custom">
                    <div className="search-dropdown-header">
                      <span>SEARCH SUGGESTIONS</span>
                    </div>
                    <div className="search-categories">
                      {[
                        { name: "Beauty", icon: "💄" },
                        { name: "Hair Care", icon: "💇" },
                        { name: "Fashion", icon: "👗" },
                        { name: "Travel", icon: "🌎" },
                        { name: "Fitness", icon: "🏋️" },
                        { name: "Health", icon: "⚕️" },
                        { name: "Food", icon: "🍽️" },
                        { name: "Lifestyle", icon: "✨" },
                      ].map((category, index) => {
                        // Ensure category has a name property and it's not null/undefined
                        const categoryName = category?.name || "";

                        // Check if this category is already selected
                        const isSelected =
                          Array.isArray(categories) &&
                          categories.some((selectedCat) => {
                            if (!selectedCat) return false;
                            // Handle potential null/undefined values
                            const selectedName =
                              typeof selectedCat === "string"
                                ? selectedCat
                                : selectedCat?.name || "";
                            return (
                              (selectedName || "").toLowerCase() ===
                              categoryName.toLowerCase()
                            );
                          });

                        return (
                          <div
                            key={index}
                            className={`category-item ${
                              isSelected ? "category-selected" : ""
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCategorySelect(category);
                            }}
                          >
                            <span className="category-icon">
                              {category.icon}
                            </span>
                            <span className="category-name">
                              {category.name}
                            </span>
                            {isSelected && (
                              <span className="selected-indicator">✓</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="search-actions">
              <button
                className="clear-search-btn"
                onClick={clearAllCategories}
                disabled={categories.length === 0}
              >
                Clear Search
              </button>
              <button
                className="search-btn"
                onClick={() => {
                  // Close dropdown
                  setShowCategoryDropdown(false);
                  // Apply filters and fetch creators
                  refreshCreatorsWithCategories(categories);
                }}
              >
                <IoSearchOutline className="search-icon" />
              </button>
            </div>
          </div>

          <div className="filter-categories">
            <div className="filter-category instagram">
              <FaInstagram className="instagram-icon" />
              <span>Instagram</span>
              <IoChevronDownOutline className="dropdown-icon" />
            </div>
            <div
              className={`filter-category ${
                selectedCountry ? "has-selection" : ""
              }`}
              onClick={() => toggleDropdown("location")}
              ref={locationButtonRef}
            >
              <span>{selectedCountry || "Location"}</span>
              <IoChevronDownOutline className="dropdown-icon" />
            </div>
            <div
              className={`filter-category ${
                genderFilter ? "has-selection" : ""
              }`}
              onClick={() => toggleDropdown("gender")}
              ref={genderButtonRef}
            >
              <span>
                {genderFilter === "m"
                  ? "Male"
                  : genderFilter === "f"
                  ? "Female"
                  : "Gender"}
              </span>
              <IoChevronDownOutline className="dropdown-icon" />
            </div>
            <div
              className={`filter-category ${
                followersFilter.min > 0 || followersFilter.max > 0
                  ? "has-selection"
                  : ""
              }`}
              onClick={() => toggleDropdown("followers")}
              ref={followersButtonRef}
            >
              <span>
                {followersFilter.min > 0 || followersFilter.max > 0
                  ? `${followersFilter.min.toLocaleString()}${
                      followersFilter.max > 0
                        ? ` - ${followersFilter.max.toLocaleString()}`
                        : "+"
                    }`
                  : "Followers"}
              </span>
              <IoChevronDownOutline className="dropdown-icon" />
            </div>
            {/* Influencer score filter - commented out as requested */}
            {/* <div className="filter-category">
            <span>Influence Score</span>
            <IoChevronDownOutline className="dropdown-icon" />
          </div> */}
            <div
              className="filter-category all-filters"
              onClick={toggleAllFilters}
              ref={allFiltersBtnRef}
            >
              <BsFilterRight className="filter-icon" />
              <span>All Filters</span>
              <span className="filter-count">•</span>
            </div>

            {/* Gender Dropdown */}
            {activeDropdown === "gender" && (
              <div
                className="dropdown-menu gender-dropdown"
                ref={dropdownRef}
                style={{
                  top: genderButtonRef.current
                    ? `${
                        genderButtonRef.current.offsetTop +
                        genderButtonRef.current.offsetHeight +
                        8
                      }px`
                    : "100%",
                  left: genderButtonRef.current
                    ? `${genderButtonRef.current.offsetLeft}px`
                    : "0",
                }}
              >
                <div
                  className="dropdown-options"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className={`dropdown-item ${
                      genderFilter === "" ? "selected" : ""
                    }`}
                    onClick={() => {
                      handleGenderChange("");
                    }}
                  >
                    All
                  </div>
                  <div
                    className={`dropdown-item ${
                      genderFilter === "m" ? "selected" : ""
                    }`}
                    onClick={() => {
                      handleGenderChange("m");
                    }}
                  >
                    Male
                  </div>
                  <div
                    className={`dropdown-item ${
                      genderFilter === "f" ? "selected" : ""
                    }`}
                    onClick={() => {
                      handleGenderChange("f");
                    }}
                  >
                    Female
                  </div>
                </div>
              </div>
            )}

            {/* Followers Dropdown */}
            {activeDropdown === "followers" && (
              <div
                className="dropdown-menu followers-dropdown"
                ref={dropdownRef}
                style={{
                  top: followersButtonRef.current
                    ? `${
                        followersButtonRef.current.offsetTop +
                        followersButtonRef.current.offsetHeight +
                        8
                      }px`
                    : "100%",
                  left: followersButtonRef.current
                    ? `${followersButtonRef.current.offsetLeft}px`
                    : "0",
                }}
              >
                <div
                  className="dropdown-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h4>Select Followers</h4>

                  <div className="slider-container">
                    <div className="slider-track">
                      <span
                        className="slider-handle left"
                        style={{
                          left: `${(followersFilter.min / 1000000) * 100}%`,
                        }}
                        onMouseDown={(e) => {
                          // Logic for dragging the left handle would go here
                          e.stopPropagation();
                        }}
                      />
                      <span
                        className="slider-handle right"
                        style={{
                          left: `${(followersFilter.max / 1000000) * 100}%`,
                        }}
                        onMouseDown={(e) => {
                          // Logic for dragging the right handle would go here
                          e.stopPropagation();
                        }}
                      />
                      <div
                        className="slider-progress"
                        style={{
                          left: `${(followersFilter.min / 1000000) * 100}%`,
                          width: `${
                            ((followersFilter.max - followersFilter.min) /
                              1000000) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="followers-range">
                    <div className="min-followers">
                      <span>Min Followers</span>
                      <input
                        type="text"
                        className="followers-input"
                        placeholder="Eg. 5000"
                        value={
                          followersFilter.min > 0
                            ? followersFilter.min.toLocaleString()
                            : ""
                        }
                        onChange={(e) => {
                          const value =
                            parseInt(e.target.value.replace(/,/g, "")) || 0;
                          setFollowersFilter({
                            ...followersFilter,
                            min: value,
                          });
                        }}
                      />
                    </div>
                    <div className="max-followers">
                      <span>Max Followers</span>
                      <input
                        type="text"
                        className="followers-input"
                        placeholder="Eg. 100000"
                        value={
                          followersFilter.max > 0
                            ? followersFilter.max.toLocaleString()
                            : ""
                        }
                        onChange={(e) => {
                          const value =
                            parseInt(e.target.value.replace(/,/g, "")) || 0;
                          setFollowersFilter({
                            ...followersFilter,
                            max: value,
                          });
                        }}
                      />
                    </div>
                  </div>

                  <h4>Select By Influencer Size</h4>
                  <div className="influencer-size-options">
                    <div className="size-option">
                      <input
                        type="radio"
                        id="nano"
                        name="influencerSize"
                        checked={selectedInfluencerSize === "nano"}
                        onChange={() => handleInfluencerSizeChange("nano")}
                      />
                      <label htmlFor="nano">Nano</label>
                      <span className="size-range">1k-10k Followers</span>
                    </div>
                    <div className="size-option">
                      <input
                        type="radio"
                        id="micro"
                        name="influencerSize"
                        checked={selectedInfluencerSize === "micro"}
                        onChange={() => handleInfluencerSizeChange("micro")}
                      />
                      <label htmlFor="micro">Micro</label>
                      <span className="size-range">10k-100k Followers</span>
                    </div>
                    <div className="size-option">
                      <input
                        type="radio"
                        id="mid-tier"
                        name="influencerSize"
                        checked={selectedInfluencerSize === "mid-tier"}
                        onChange={() => handleInfluencerSizeChange("mid-tier")}
                      />
                      <label htmlFor="mid-tier">Mid-tier</label>
                      <span className="size-range">100k-500k Followers</span>
                    </div>
                    <div className="size-option">
                      <input
                        type="radio"
                        id="macro"
                        name="influencerSize"
                        checked={selectedInfluencerSize === "macro"}
                        onChange={() => handleInfluencerSizeChange("macro")}
                      />
                      <label htmlFor="macro">Macro</label>
                      <span className="size-range">500k-1m Followers</span>
                    </div>
                    <div className="size-option">
                      <input
                        type="radio"
                        id="mega"
                        name="influencerSize"
                        checked={selectedInfluencerSize === "mega"}
                        onChange={() => handleInfluencerSizeChange("mega")}
                      />
                      <label htmlFor="mega">Mega</label>
                      <span className="size-range">1m+ Followers</span>
                    </div>
                  </div>

                  <div className="filter-actions">
                    <button
                      className="clear-filter"
                      onClick={() => {
                        setFollowersFilter({ min: 0, max: 0 });
                        setSelectedInfluencerSize("");
                        setActiveDropdown("");

                        // Immediately fetch results without followers filter
                        setTimeout(() => {
                          console.log(
                            "Clearing followers filter and refreshing results"
                          );
                          setIsLoading(true);

                          // Build clean query without followers filter
                          let queryParams = new URLSearchParams();

                          // Include categories
                          if (categories && categories.length > 0) {
                            const normalizedCategories =
                              categories.map(safeCategoryName);
                            queryParams.append(
                              "categories",
                              normalizedCategories.join(",")
                            );
                          }

                          // Include location if set
                          if (selectedCountry) {
                            const formattedCountry =
                              formatLocationForApi(selectedCountry);
                            queryParams.append("locations", formattedCountry);

                            if (selectedCities && selectedCities.length > 0) {
                              const locations = [
                                formattedCountry,
                                ...selectedCities.map((city) =>
                                  formatLocationForApi(city)
                                ),
                              ];
                              queryParams.set("locations", locations.join(","));
                            }
                          }

                          // Include gender if set
                          if (genderFilter === "m" || genderFilter === "f") {
                            queryParams.append("genders", genderFilter);
                          }

                          // Make direct fetch request
                          fetch(`/api/instagram/filter?${queryParams.toString()}`)
                            .then((response) => response.json())
                            .then((data) => {
                              setInfluencers(data.data || []);
                              setTotalResults(
                                data.metadata?.total_results ||
                                  data.data?.length ||
                                  0
                              );
                              setIsLoading(false);
                            })
                            .catch((error) => {
                              console.error(
                                "Error clearing followers filter:",
                                error
                              );
                              setTotalResults(0);
                              setIsLoading(false);
                            });
                        }, 0);
                      }}
                    >
                      Clear Filter
                    </button>
                    <button
                      className="apply-filter"
                      onClick={() => {
                        fetchCreators({ applyFollowersFilter: true });
                        setActiveDropdown("");
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Location Dropdown */}
            {activeDropdown === "location" && (
              <div
                className="dropdown-menu location-dropdown"
                ref={dropdownRef}
                style={{
                  top: locationButtonRef.current
                    ? `${
                        locationButtonRef.current.offsetTop +
                        locationButtonRef.current.offsetHeight +
                        8
                      }px`
                    : "100%",
                  left: locationButtonRef.current
                    ? `${locationButtonRef.current.offsetLeft}px`
                    : "0",
                }}
              >
                <div
                  className="dropdown-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h4>Select Country</h4>
                  <div className="country-options">
                    <div className="country-option">
                      <input
                        type="checkbox"
                        id="india"
                        checked={selectedCountry === "India"}
                        onChange={() =>
                          setSelectedCountry(
                            selectedCountry === "India" ? "" : "India"
                          )
                        }
                      />
                      <label htmlFor="india">🇮🇳 India</label>
                    </div>
                    <div className="country-option">
                      <input
                        type="checkbox"
                        id="uae"
                        checked={selectedCountry === "United Arab Emirates"}
                        onChange={() =>
                          setSelectedCountry(
                            selectedCountry === "United Arab Emirates"
                              ? ""
                              : "United Arab Emirates"
                          )
                        }
                      />
                      <label htmlFor="uae">🇦🇪 United Arab Emirates</label>
                    </div>
                    <div className="country-option">
                      <input
                        type="checkbox"
                        id="saudi"
                        checked={selectedCountry === "Saudi Arabia"}
                        onChange={() =>
                          setSelectedCountry(
                            selectedCountry === "Saudi Arabia"
                              ? ""
                              : "Saudi Arabia"
                          )
                        }
                      />
                      <label htmlFor="saudi">🇸🇦 Saudi Arabia</label>
                    </div>
                  </div>

                  {selectedCountry && (
                    <div className="cities-section">
                      <h4>State / City</h4>
                      <div className="city-search">
                        <input
                          type="text"
                          placeholder="Eg. Mumbai, Delhi"
                          value={searchCity}
                          onChange={(e) => setSearchCity(e.target.value)}
                        />
                      </div>

                      {selectedCities.length > 0 && (
                        <div className="selected-cities">
                          {selectedCities.map((city) => (
                            <div className="selected-city-tag" key={city}>
                              {city}{" "}
                              <span
                                onClick={() =>
                                  setSelectedCities(
                                    selectedCities.filter((c) => c !== city)
                                  )
                                }
                              >
                                ×
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="city-rows">
                        <div className="city-row">
                          <div
                            className="city-option"
                            onClick={() => {
                              if (selectedCities.includes("Mumbai")) {
                                setSelectedCities(
                                  selectedCities.filter((c) => c !== "Mumbai")
                                );
                              } else {
                                setSelectedCities([
                                  ...selectedCities,
                                  "Mumbai",
                                ]);
                              }
                            }}
                          >
                            Mumbai
                          </div>
                          <div
                            className="city-option"
                            onClick={() => {
                              if (selectedCities.includes("Delhi")) {
                                setSelectedCities(
                                  selectedCities.filter((c) => c !== "Delhi")
                                );
                              } else {
                                setSelectedCities([...selectedCities, "Delhi"]);
                              }
                            }}
                          >
                            Delhi
                          </div>
                          <div
                            className="city-option"
                            onClick={() => {
                              if (selectedCities.includes("Bengaluru")) {
                                setSelectedCities(
                                  selectedCities.filter(
                                    (c) => c !== "Bengaluru"
                                  )
                                );
                              } else {
                                setSelectedCities([
                                  ...selectedCities,
                                  "Bengaluru",
                                ]);
                              }
                            }}
                          >
                            Bengaluru
                          </div>
                        </div>
                        <div className="city-row">
                          <div
                            className="city-option"
                            onClick={() => {
                              if (selectedCities.includes("Chennai")) {
                                setSelectedCities(
                                  selectedCities.filter((c) => c !== "Chennai")
                                );
                              } else {
                                setSelectedCities([
                                  ...selectedCities,
                                  "Chennai",
                                ]);
                              }
                            }}
                          >
                            Chennai
                          </div>
                          <div
                            className="city-option"
                            onClick={() => {
                              if (selectedCities.includes("Gurgaon")) {
                                setSelectedCities(
                                  selectedCities.filter((c) => c !== "Gurgaon")
                                );
                              } else {
                                setSelectedCities([
                                  ...selectedCities,
                                  "Gurgaon",
                                ]);
                              }
                            }}
                          >
                            Gurgaon
                          </div>
                          <div className="city-option">
                            <span className="add-more">Add More...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="filter-actions">
                    <button
                      className="clear-filter"
                      onClick={() => {
                        setSelectedCountry("");
                        setSelectedCities([]);
                        setActiveDropdown("");

                        // Immediately fetch results without location filter
                        setTimeout(() => {
                          console.log(
                            "Clearing location filter and refreshing results"
                          );
                          setIsLoading(true);

                          // Build clean query without location
                          let queryParams = new URLSearchParams();

                          // Include only categories
                          if (categories && categories.length > 0) {
                            const normalizedCategories =
                              categories.map(safeCategoryName);
                            queryParams.append(
                              "categories",
                              normalizedCategories.join(",")
                            );
                          }

                          // Include gender if set
                          if (genderFilter === "m" || genderFilter === "f") {
                            queryParams.append("genders", genderFilter);
                          }

                          // Make direct fetch request
                          fetch(`/api/instagram/filter?${queryParams.toString()}`)
                            .then((response) => response.json())
                            .then((data) => {
                              setInfluencers(data.data || []);
                              setTotalResults(
                                data.metadata?.total_results ||
                                  data.data?.length ||
                                  0
                              );
                              setIsLoading(false);
                            })
                            .catch((error) => {
                              console.error(
                                "Error clearing location filter:",
                                error
                              );
                              setTotalResults(0);
                              setIsLoading(false);
                            });
                        }, 0);
                      }}
                    >
                      Clear Filter
                    </button>
                    <button
                      className="apply-filter"
                      onClick={() => {
                        fetchCreators({ applyLocationFilter: true });
                        setActiveDropdown("");
                      }}
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="results-count">
            {totalResults > 0 && (
              <>
                <span className="count">{totalResults.toLocaleString()}</span>
                <span className="profiles-text">profiles</span>
              </>
            )}
            <div className="sort-followers">
              <span>Followers</span>
              <IoChevronDownOutline className="dropdown-icon" />
            </div>
          </div>
        </div>

        {/* All Filters Sidebar - Shows as overlay */}
        {showAllFilters && (
          <div className="all-filters-overlay">
            <div className="all-filters-sidebar" ref={allFiltersRef}>
              <div className="sidebar-header">
                <h2>ALL FILTERS</h2>
                <button
                  className="close-btn"
                  onClick={() => setShowAllFilters(false)}
                >
                  <MdOutlineClose />
                </button>
              </div>

              <div className="sidebar-content">
                <div className="filter-section">
                  <div className="section-header basic-filters">
                    <span className="section-icon">✦</span>
                    <span className="section-title">BASIC FILTERS</span>
                  </div>

                  <div
                    className="filter-item"
                    onClick={() => toggleSection("categories")}
                  >
                    <div className="filter-item-header">
                      <div className="filter-item-title">
                        <span className="required">Categories</span>
                        <span className="required-mark">*</span>
                      </div>
                      {expandedSections.categories ? (
                        <IoChevronUpOutline />
                      ) : (
                        <IoChevronDownOutline />
                      )}
                    </div>
                  </div>

                  <div
                    className="filter-item"
                    onClick={() => toggleSection("location")}
                  >
                    <div className="filter-item-header">
                      <div className="filter-item-title">
                        <span className="required">Location</span>
                        <span className="required-mark">*</span>
                      </div>
                      {expandedSections.location ? (
                        <IoChevronUpOutline />
                      ) : (
                        <IoChevronDownOutline />
                      )}
                    </div>

                    {expandedSections.location && (
                      <div className="filter-item-content">
                        <div className="location-filter-content">
                          <h4>SELECT COUNTRY</h4>
                          <div className="country-options">
                            <div className="country-option">
                              <input
                                type="radio"
                                id="filter-india"
                                name="filter-country"
                                checked={selectedCountry === "India"}
                                onChange={() => handleCountryChange("India")}
                              />
                              <label htmlFor="filter-india">🇮🇳 India</label>
                            </div>
                            <div className="country-option">
                              <input
                                type="radio"
                                id="filter-uae"
                                name="filter-country"
                                checked={
                                  selectedCountry === "United Arab Emirates"
                                }
                                onChange={() =>
                                  handleCountryChange("United Arab Emirates")
                                }
                              />
                              <label htmlFor="filter-uae">
                                🇦🇪 United Arab Emirates
                              </label>
                            </div>
                            <div className="country-option">
                              <input
                                type="radio"
                                id="filter-saudi"
                                name="filter-country"
                                checked={selectedCountry === "Saudi Arabia"}
                                onChange={() =>
                                  handleCountryChange("Saudi Arabia")
                                }
                              />
                              <label htmlFor="filter-saudi">
                                🇸🇦 Saudi Arabia
                              </label>
                            </div>
                          </div>

                          <h4>SELECT STATE / CITY</h4>
                          <div className="selected-cities">
                            {selectedCities.map((city, index) => (
                              <div className="selected-city" key={index}>
                                <span>{city}</span>
                                <button
                                  className="remove-city"
                                  onClick={() => removeCity(city)}
                                >
                                  <IoMdClose />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    className="filter-item"
                    onClick={() => toggleSection("gender")}
                  >
                    <div className="filter-item-header">
                      <div className="filter-item-title">
                        <span className="required">Gender</span>
                        <span className="required-mark">*</span>
                      </div>
                      {expandedSections.gender ? (
                        <IoChevronUpOutline />
                      ) : (
                        <IoChevronDownOutline />
                      )}
                    </div>
                  </div>

                  <div
                    className="filter-item"
                    onClick={() => toggleSection("followers")}
                  >
                    <div className="filter-item-header">
                      <div className="filter-item-title">
                        <span className="required">Followers</span>
                        <span className="required-mark">*</span>
                      </div>
                      {expandedSections.followers ? (
                        <IoChevronUpOutline />
                      ) : (
                        <IoChevronDownOutline />
                      )}
                    </div>
                  </div>

                  <div
                    className="filter-item"
                    onClick={() => toggleSection("influenceScore")}
                  >
                    <div className="filter-item-header">
                      <div className="filter-item-title">
                        <span>Influence Score</span>
                        <span className="info-icon">
                          <FiInfo />
                        </span>
                      </div>
                      {expandedSections.influenceScore ? (
                        <IoChevronUpOutline />
                      ) : (
                        <IoChevronDownOutline />
                      )}
                    </div>
                  </div>

                  <div className="filter-toggle-item">
                    <div className="toggle-item-left">
                      <span className="toggle-title">Faster Responses</span>
                      <span className="required-mark">*</span>
                    </div>
                    <div
                      className={`toggle-switch ${
                        fasterResponses ? "active" : ""
                      }`}
                      onClick={() => setFasterResponses(!fasterResponses)}
                    >
                      <div
                        className={`toggle-slider ${
                          fasterResponses ? "active" : ""
                        }`}
                      ></div>
                    </div>
                  </div>

                  <div className="filter-toggle-item">
                    <div className="toggle-item-left">
                      <span className="toggle-title">Instagram Verified</span>
                      <span className="verified-icon">✓</span>
                    </div>
                    <div
                      className={`toggle-switch ${
                        instagramVerified ? "active" : ""
                      }`}
                      onClick={() => setInstagramVerified(!instagramVerified)}
                    >
                      <div
                        className={`toggle-slider ${
                          instagramVerified ? "active" : ""
                        }`}
                      ></div>
                    </div>
                  </div>

                  <div className="filter-toggle-item">
                    <div className="toggle-item-left">
                      <span className="toggle-title">Has YouTube</span>
                    </div>
                    <div
                      className={`toggle-switch ${hasYoutube ? "active" : ""}`}
                      onClick={() => setHasYoutube(!hasYoutube)}
                    >
                      <div
                        className={`toggle-slider ${
                          hasYoutube ? "active" : ""
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="filter-section keyword-search">
                  <div className="section-header">
                    <span className="section-icon">🔍</span>
                    <span className="section-title">KEYWORD SEARCH</span>
                  </div>

                  <div
                    className="filter-item"
                    onClick={() => toggleSection("captionsKeywords")}
                  >
                    <div className="filter-item-header">
                      <div className="filter-item-title">
                        <span>Captions Keywords & Hashtags</span>
                      </div>
                      {expandedSections.captionsKeywords ? (
                        <IoChevronUpOutline />
                      ) : (
                        <IoChevronDownOutline />
                      )}
                    </div>
                  </div>

                  <div
                    className="filter-item"
                    onClick={() => toggleSection("bioKeywords")}
                  >
                    <div className="filter-item-header">
                      <div className="filter-item-title">
                        <span>Bio Keywords</span>
                      </div>
                      {expandedSections.bioKeywords ? (
                        <IoChevronUpOutline />
                      ) : (
                        <IoChevronDownOutline />
                      )}
                    </div>
                  </div>
                </div>

                <div className="filter-section contact">
                  <div className="section-header">
                    <span className="section-icon">✦</span>
                    <span className="section-title">CONTACT</span>
                  </div>

                  <div
                    className="filter-item"
                    onClick={() => toggleSection("contactAvailability")}
                  >
                    <div className="filter-item-header">
                      <div className="filter-item-title">
                        <span>Contact Availability</span>
                      </div>
                      {expandedSections.contactAvailability ? (
                        <IoChevronUpOutline />
                      ) : (
                        <IoChevronDownOutline />
                      )}
                    </div>
                  </div>
                </div>

                <div className="filter-section audience">
                  <div className="section-header">
                    <span className="section-icon">✦</span>
                    <span className="section-title">AUDIENCE</span>
                  </div>

                  <div
                    className="filter-item"
                    onClick={() => toggleSection("audienceCredibility")}
                  >
                    <div className="filter-item-header">
                      <div className="filter-item-title">
                        <span>Audience Credibility</span>
                      </div>
                      {expandedSections.audienceCredibility ? (
                        <IoChevronUpOutline />
                      ) : (
                        <IoChevronDownOutline />
                      )}
                    </div>
                  </div>

                  <div
                    className="filter-item"
                    onClick={() => toggleSection("audienceGender")}
                  >
                    <div className="filter-item-header">
                      <div className="filter-item-title">
                        <span>Audience Gender</span>
                      </div>
                      {expandedSections.audienceGender ? (
                        <IoChevronUpOutline />
                      ) : (
                        <IoChevronDownOutline />
                      )}
                    </div>
                  </div>

                  <div
                    className="filter-item"
                    onClick={() => toggleSection("audienceLocation")}
                  >
                    <div className="filter-item-header">
                      <div className="filter-item-title">
                        <span>Audience Location</span>
                      </div>
                      {expandedSections.audienceLocation ? (
                        <IoChevronUpOutline />
                      ) : (
                        <IoChevronDownOutline />
                      )}
                    </div>
                  </div>

                  <div
                    className="filter-item"
                    onClick={() => toggleSection("audienceInterest")}
                  >
                    <div className="filter-item-header">
                      <div className="filter-item-title">
                        <span>Audience Interest</span>
                      </div>
                      {expandedSections.audienceInterest ? (
                        <IoChevronUpOutline />
                      ) : (
                        <IoChevronDownOutline />
                      )}
                    </div>
                  </div>

                  <div
                    className="filter-item"
                    onClick={() => toggleSection("audienceLanguage")}
                  >
                    <div className="filter-item-header">
                      <div className="filter-item-title">
                        <span>Audience Language</span>
                      </div>
                      {expandedSections.audienceLanguage ? (
                        <IoChevronUpOutline />
                      ) : (
                        <IoChevronDownOutline />
                      )}
                    </div>
                  </div>

                  <div
                    className="filter-item"
                    onClick={() => toggleSection("audienceAgeRange")}
                  >
                    <div className="filter-item-header">
                      <div className="filter-item-title">
                        <span>Audience Age Range</span>
                      </div>
                      {expandedSections.audienceAgeRange ? (
                        <IoChevronUpOutline />
                      ) : (
                        <IoChevronDownOutline />
                      )}
                    </div>
                  </div>

                  <div
                    className="filter-item"
                    onClick={() => toggleSection("averageFollowerGrowth")}
                  >
                    <div className="filter-item-header">
                      <div className="filter-item-title">
                        <span>Average Follower Growth</span>
                      </div>
                      {expandedSections.averageFollowerGrowth ? (
                        <IoChevronUpOutline />
                      ) : (
                        <IoChevronDownOutline />
                      )}
                    </div>
                  </div>
                </div>

                <div className="filter-section post-performance">
                  <div className="section-header">
                    <span className="section-icon">📊</span>
                    <span className="section-title">POST PERFORMANCE</span>
                  </div>

                  <div
                    className="filter-item"
                    onClick={() => toggleSection("lastPosted")}
                  >
                    <div className="filter-item-header">
                      <div className="filter-item-title">
                        <span>Last Posted Within</span>
                      </div>
                      {expandedSections.lastPosted ? (
                        <IoChevronUpOutline />
                      ) : (
                        <IoChevronDownOutline />
                      )}
                    </div>
                  </div>

                  <div
                    className="filter-item"
                    onClick={() => toggleSection("engagementRate")}
                  >
                    <div className="filter-item-header">
                      <div className="filter-item-title">
                        <span>Engagement Rate</span>
                        <span className="info-icon">
                          <FiInfo />
                        </span>
                      </div>
                      {expandedSections.engagementRate ? (
                        <IoChevronUpOutline />
                      ) : (
                        <IoChevronDownOutline />
                      )}
                    </div>
                  </div>

                  <div
                    className="filter-item"
                    onClick={() => toggleSection("averageLikes")}
                  >
                    <div className="filter-item-header">
                      <div className="filter-item-title">
                        <span>Average Likes</span>
                      </div>
                      {expandedSections.averageLikes ? (
                        <IoChevronUpOutline />
                      ) : (
                        <IoChevronDownOutline />
                      )}
                    </div>
                  </div>
                </div>

                <div className="sidebar-actions">
                  <button className="reset-btn" onClick={resetFilters}>
                    Reset
                  </button>
                  <button className="apply-btn" onClick={applyAllFilters}>
                    SHOW PROFILES ({totalResults})
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="results-table">
          <div className="table-header">
            <div className="profile-col">Instagram Profiles</div>
            <div className="col with-info">
              <span>Influence Score</span>
              <AiOutlineInfoCircle className="info-icon" />
            </div>
            <div className="col with-sort">
              <span>Followers</span>
              <IoChevronDownOutline className="sort-icon" />
            </div>
            <div className="col">Avg Likes</div>
            <div className="col">Avg Reel Views</div>
            <div className="col with-info">
              <span>ER</span>
              <AiOutlineInfoCircle className="info-icon" />
            </div>
            <div className="col">Location</div>
            <div className="col">Categories</div>
          </div>

          <div className="table-body">
            {isLoading ? (
              // Skeleton loader while loading
              Array.from({ length: 5 }).map((_, index) => (
                <div className="table-row skeleton" key={index}>
                  <div className="checkbox-col skeleton-box"></div>
                  <div className="profile-col">
                    <div className="profile-img-container">
                      <div className="profile-img skeleton-circle"></div>
                    </div>
                    <div className="profile-info">
                      <div className="profile-name skeleton-box"></div>
                      <div className="profile-handle skeleton-box"></div>
                    </div>
                  </div>
                  <div className="col score skeleton-box"></div>
                  <div className="col followers skeleton-box"></div>
                  <div className="col avg-likes skeleton-box"></div>
                  <div className="col avg-reel-views skeleton-box"></div>
                  <div className="col er skeleton-box"></div>
                  <div className="col location skeleton-box"></div>
                  <div className="col categories">
                    <span className="category-badge skeleton-box"></span>
                    <span className="category-badge skeleton-box"></span>
                  </div>
                </div>
              ))
            ) : influencers.length > 0 ? (
              influencers.map((influencer, index) => (
                <div
                  className={`table-row ${
                    dropdownOpen && activeRowId === influencer.id
                      ? "dropdown-open"
                      : ""
                  }`}
                  key={index}
                  onMouseEnter={() => {
                    // Cancel any pending close when entering the row area
                    if (hoverCloseTimer.current) {
                      clearTimeout(hoverCloseTimer.current);
                      hoverCloseTimer.current = null;
                    }
                  }}
                >
                  <div className="checkbox-col">
                    <input type="checkbox" />
                  </div>
                  <div className="profile-col">
                    <div className="profile-img-container">
                      <div
                        className="profile-img"
                        style={{
                          backgroundImage: `url(${influencer.profileImg})`,
                        }}
                      ></div>
                    </div>
                    <div className="profile-info">
                      <div className="profile-name">{influencer.name}</div>
                      <div className="profile-handle">{influencer.handle}</div>
                    </div>
                  </div>
                  <div className="col score">{influencer.influenceScore}</div>
                  <div className="col followers">{influencer.followers}</div>
                  <div className="col avg-likes">{influencer.avgLikes}</div>
                  <div className="col avg-reel-views">
                    {influencer.avgReelViews}
                  </div>
                  <div className="col er">{influencer.er}</div>
                  <div className="col location">{influencer.location}</div>
                  <div className="col categories">
                    {influencer.categories.map((category, idx) => (
                      <span key={idx} className="category-badge">
                        {category}
                      </span>
                    ))}
                    {influencer.moreCategories > 0 && (
                      <span className="more-categories">
                        +{influencer.moreCategories} more
                      </span>
                    )}
                  </div>
                  <div
                    className="row-actions"
                    onMouseEnter={() => {
                      setActiveRowId(influencer.id);
                      setSelectedProfile(influencer);
                      // Do not forcibly close dropdown here to prevent flicker
                    }}
                  >
                    <button
                      className="action-button"
                      aria-label="Preview profile"
                    >
                      <AiOutlineEye />
                    </button>
                    <button className="action-button" aria-label="Message">
                      <BiMessageRoundedDetail />
                    </button>
                    <div
                      className="dropdown-container"
                      onMouseEnter={() => {
                        setActiveRowId(influencer.id);
                        setSelectedProfile(influencer);
                        // Cancel scheduled close and open immediately for aggressive hover
                        if (hoverCloseTimer.current) {
                          clearTimeout(hoverCloseTimer.current);
                          hoverCloseTimer.current = null;
                        }
                        setDropdownOpen(true);
                      }}
                      onMouseLeave={() => {
                        // Only close dropdown if we're not in loading state for this row
                        if (loadingButtonId !== influencer.id) {
                          // Delay the close slightly to allow cursor travel to the dropdown
                          hoverCloseTimer.current = setTimeout(() => {
                            setDropdownOpen(false);
                            hoverCloseTimer.current = null;
                          }, 220);
                        }
                      }}
                    >
                      <button
                        className={`action-button add-to-list ${
                          loadingButtonId === influencer.id ? "loading" : ""
                        }`}
                        aria-label="Add to list"
                      >
                        {loadingButtonId === influencer.id ? (
                          <span className="button-loader"></span>
                        ) : (
                          <>
                            <span className="plus-icon">+</span>Add to list
                          </>
                        )}
                      </button>
                      <AddToListDropdown
                        isOpen={dropdownOpen && activeRowId === influencer.id}
                        // In All Plans view, also treat the 2nd row like first to avoid clipping under header
                        isFirstRow={
                          index === 0 ||
                          (sidebarState === "all-plans" && index === 1)
                        }
                        isPlansMode={sidebarState === "all-plans"}
                        plans={plans}
                        items={
                          sidebarState === "unsaved-plan"
                            ? [
                                {
                                  id: "list-1",
                                  label: "List 1",
                                  icon: <FiInstagram size={14} />,
                                },
                                {
                                  id: "new-list",
                                  label: "To a new list",
                                  icon: <BsFileEarmarkPlus />,
                                },
                              ]
                            : dropdownItems
                        }
                        onCreateNewPlan={() => setShowCreatePlanModal(true)}
                        onCreateNewList={(plan) => {
                          setShowCreateListDrawer(true);
                        }}
                        onSelectPlanList={(plan, list) => {
                          console.log(
                            `Add ${influencer.name} to ${plan.name} -> ${list.name}`
                          );
                        }}
                        onClose={() => {
                          // Only close the dropdown if not in loading state for this influencer
                          if (loadingButtonId !== influencer.id) {
                            if (hoverCloseTimer.current) {
                              clearTimeout(hoverCloseTimer.current);
                              hoverCloseTimer.current = null;
                            }
                            hoverCloseTimer.current = setTimeout(() => {
                              setDropdownOpen(false);
                              hoverCloseTimer.current = null;
                            }, 180);
                          }
                        }}
                        onHoverIn={() => {
                          if (hoverCloseTimer.current) {
                            clearTimeout(hoverCloseTimer.current);
                            hoverCloseTimer.current = null;
                          }
                        }}
                        onHoverOut={() => {
                          if (loadingButtonId !== influencer.id) {
                            hoverCloseTimer.current = setTimeout(() => {
                              setDropdownOpen(false);
                              hoverCloseTimer.current = null;
                            }, 220);
                          }
                        }}
                        onItemClick={(itemId) => {
                          if (itemId === "new-plan") {
                            // Don't close dropdown, just show loading in both places
                            setSidebarState("loading");
                            setLoadingButtonId(influencer.id);

                            // Simulate backend request with a timeout
                            setTimeout(() => {
                              // Add the selected profile to the creators list
                              setSelectedCreators([influencer]);
                              setSidebarState("unsaved-plan");
                              // Reset loading button state after a brief delay to show transition
                              setTimeout(() => {
                                setLoadingButtonId(null);
                              }, 500);
                            }, 1500);
                          } else if (itemId === "view-plans") {
                            setDropdownOpen(false);
                            setSidebarState("all-plans");
                          } else if (itemId === "view-all-plans") {
                            setDropdownOpen(false);
                            setSidebarState("all-plans");
                          } else if (itemId === "list-1") {
                            // Simulate adding to an existing list
                            console.log(`Adding ${influencer.name} to List 1`);
                          } else if (itemId === "new-list") {
                            // Simulate creating a new list
                            console.log(
                              `Creating a new list with ${influencer.name}`
                            );
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>No influencers found matching your criteria.</p>
                <button onClick={resetFilters} className="reset-btn">
                  Reset Filters
                </button>
              </div>
            )}
          </div>
          {influencers.length > 0 && totalResults > 0 && (
            <div className="results-count-container">
              <div className="results-count">
                Showing {Math.min(influencers.length, totalResults)} of {totalResults} creators
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right sidebar with dynamic content based on state */}
      <div className="creators-sidebar">
        {sidebarState === "default" && (
          <>
            <h2 className="sidebar-title">
              Improve your efficiency with
              <span className="bold-text">Epigroww Global!</span>
            </h2>

            <div className="sidebar-content">
              {/* Add influencer button */}
              <div className="sidebar-action-btn add-influencer">
                <div className="btn-icon">
                  <FiUser size={18} />
                </div>
                <div className="btn-content">
                  <div className="btn-title">Add Influencers</div>
                  <div className="btn-description">
                    Maybe a way to communicate plan & list hierarchy.
                  </div>
                </div>
              </div>

              {/* Get costs button */}
              <div className="sidebar-action-btn get-costs">
                <div className="btn-icon">
                  <HiOutlineCurrencyRupee size={18} />
                </div>
                <div className="btn-content">
                  <div className="btn-title">Get Costs</div>
                  <div className="btn-description">
                    Reach out to influencers & get their updated costs.
                  </div>
                </div>
              </div>

              {/* Download lists button */}
              <div className="sidebar-action-btn download-lists">
                <div className="btn-icon">
                  <FiDownload size={18} />
                </div>
                <div className="btn-content">
                  <div className="btn-title">Download Lists</div>
                  <div className="btn-description">
                    Download influencer lists with their metrics on an excel
                    sheet!
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed bottom footer with Create List button */}
            <div className="sidebar-footer">
              <button className="create-list-btn">
                <span className="btn-icon">+</span>
                <span>Create List</span>
              </button>
            </div>
          </>
        )}

        {sidebarState === "loading" && <SidebarLoader />}

        {sidebarState === "unsaved-plan" && (
          <UnsavedPlanView
            selectedCreators={selectedCreators}
            onNewListClick={() => {
              setShowCreateListDrawer(true);
            }}
            onSaveAndViewClick={() => {
              setShowSavePlanModal(true);
            }}
            onEditListClick={() => {
              setShowEditListDrawer(true);
            }}
            onDeleteListClick={() => {
              // In a real implementation, this would delete the list
              console.log("Delete list clicked");
            }}
            onListClick={() => {
              // Switch to list detail view
              setCurrentListView("List 1");
              setSidebarState("list-detail");
            }}
            onBackClick={() => {
              setSidebarState("all-plans");
            }}
          />
        )}

        {sidebarState === "all-plans" && (
          <AllPlansView
            plans={plans}
            onNewPlanClick={() => setShowCreatePlanModal(true)}
            onSelectPlan={(plan) => {
              setSidebarState("unsaved-plan");
            }}
          />
        )}

        {sidebarState === "list-detail" && (
          <ListDetailView
            listName={currentListView}
            influencers={selectedCreators}
            onBackClick={() => setSidebarState("unsaved-plan")}
          />
        )}
      </div>

      {/* Modal for adding profile to plan */}
      <AddProfileModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddToList={(planName) => {
          // Handle adding profile to list logic
          console.log(`Adding ${selectedProfile?.name} to plan: ${planName}`);
          setModalOpen(false);
        }}
      />

      {/* Edit List Drawer */}
      <EditListDrawer
        isOpen={showEditListDrawer}
        onClose={() => setShowEditListDrawer(false)}
        onUpdateList={(updatedList) => {
          console.log("List updated:", updatedList);
          setShowEditListDrawer(false);
        }}
        onDeleteList={() => {
          console.log("List deleted");
          setShowEditListDrawer(false);
          // In a real implementation, this would delete the list
          // For now, go back to default sidebar state
          setSidebarState("default");
        }}
        listData={currentListData}
      />

      {/* Create New List Drawer */}
      <CreateListDrawer
        isOpen={showCreateListDrawer}
        onClose={() => setShowCreateListDrawer(false)}
        onCreateList={(newList) => {
          console.log("New list created:", newList);
          setShowCreateListDrawer(false);
          // In a real implementation, this would add the list to the UI
        }}
      />

      {/* Save Plan Modal */}
      {showSavePlanModal && (
        <SavePlanModal
          isOpen={true}
          onClose={() => setShowSavePlanModal(false)}
          onSave={(planData) => {
            console.log("Plan saved:", planData);
            setShowSavePlanModal(false);
            // In a real implementation, this would save the plan and redirect
            // For demo purposes, we'll go back to default state
            setTimeout(() => {
              setSidebarState("default");
              setSelectedCreators([]);
              setLoadingButtonId(null);
            }, 500);
          }}
        />
      )}

      {/* Create Plan Modal */}
      {showCreatePlanModal && (
        <CreatePlanModal
          isOpen={true}
          onClose={() => setShowCreatePlanModal(false)}
          onCreate={(newPlan) => {
            setPlans((prev) => [
              {
                id: `plan-${prev.length + 1}`,
                name: newPlan.planName || "New Plan",
                dateLabel: new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                }),
                lists: [],
              },
              ...prev,
            ]);
            setShowCreatePlanModal(false);
            setSidebarState("all-plans");
          }}
        />
      )}
    </div>
  );
}
