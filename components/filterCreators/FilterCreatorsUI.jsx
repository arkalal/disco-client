"use client"

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IoSearchOutline } from 'react-icons/io5';
import { IoCloseCircle } from 'react-icons/io5';
import { IoChevronDownOutline } from 'react-icons/io5';
import { IoChevronUpOutline } from 'react-icons/io5';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { BsFilterRight } from 'react-icons/bs';
import { FaInstagram } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { RiArrowRightSLine } from 'react-icons/ri';
import { FiSearch } from 'react-icons/fi';
import { BiRadioCircle, BiRadioCircleMarked } from 'react-icons/bi';
import { MdOutlineClose } from 'react-icons/md';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { TbCategory } from 'react-icons/tb';
import { BsPerson } from 'react-icons/bs';
import { FiInfo } from 'react-icons/fi';
import './FilterCreatorsUI.scss';

export default function FilterCreatorsUI() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get search categories from URL parameters
  const categoriesParam = searchParams.get('categories');
  const categories = categoriesParam ? categoriesParam.split(',') : [];
  
  // State for influencers data and loading state
  const [influencers, setInfluencers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  // Filter states
  const [activeDropdown, setActiveDropdown] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [followersFilter, setFollowersFilter] = useState({min: 10000, max: 100000});
  const [selectedInfluencerSize, setSelectedInfluencerSize] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [searchCity, setSearchCity] = useState('');
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    'categories': false,
    'location': true,
    'gender': false,
    'followers': false,
    'influenceScore': false,
    'keywordSearch': false,
    'captionsKeywords': false,
    'bioKeywords': false,
    'contact': false,
    'contactAvailability': false,
    'audience': false,
    'audienceCredibility': false,
    'audienceGender': false,
    'audienceLocation': false,
    'audienceInterest': false,
    'audienceLanguage': false,
    'audienceAgeRange': false,
    'averageFollowerGrowth': false,
    'postPerformance': false,
    'lastPosted': false,
    'engagementRate': false,
    'averageLikes': false,
    'averageComments': false,
    'averageImageLikes': false,
    'averageImageComments': false,
    'averageReelPlays': false,
    'averageReelLikes': false,
    'averageReelComments': false
  });
  
  const [selectedCities, setSelectedCities] = useState(['Mumbai', 'Bengaluru']);
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
  const fetchCreators = async (filters = {}) => {
    setIsLoading(true);
    
    try {
      // Build the query parameters
      const queryParams = new URLSearchParams();
      
      // Add categories from URL or state - always include this filter
      if (categories && categories.length > 0) {
        // Convert all categories to lowercase for consistent filtering
        const normalizedCategories = categories.map(cat => cat.toLowerCase());
        console.log('Adding categories to query:', normalizedCategories);
        queryParams.append('categories', normalizedCategories.join(','));
      }
      
      // Only add location filters if explicitly selected
      if (selectedCountry && selectedCountry !== '' && filters.applyLocationFilter) {
        const locations = [selectedCountry];
        if (selectedCities && selectedCities.length > 0) {
          locations.push(...selectedCities);
        }
        queryParams.append('locations', locations.join(','));
      }
      
      // Only add gender filter if explicitly selected
      if (genderFilter && genderFilter !== '' && filters.applyGenderFilter) {
        queryParams.append('genders', genderFilter);
      }
      
      // Only add followers range if explicitly selected
      if (followersFilter.min && filters.applyFollowersFilter) {
        queryParams.append('minFollowers', followersFilter.min);
      }
      
      if (followersFilter.max && filters.applyFollowersFilter) {
        queryParams.append('maxFollowers', followersFilter.max);
      }
      
      // Add any additional filters from the parameter
      Object.entries(filters).forEach(([key, value]) => {
        if (value && ['categories', 'applyLocationFilter', 'applyGenderFilter', 'applyFollowersFilter'].indexOf(key) === -1) {
          queryParams.append(key, value);
        }
      });
      
      const response = await fetch(`/api/instagram/filter?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching filtered creators: ${response.status}`);
      }
      
      const data = await response.json();
      setInfluencers(data.data || []);
      setTotalResults(data.pagination?.total || data.data?.length || 0);
    } catch (error) {
      console.error('Error fetching filtered creators:', error);
      setInfluencers([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial fetch on component mount
  useEffect(() => {
    console.log('Categories from URL:', categories);
    if (categories.length > 0) {
      console.log('Fetching creators with categories:', categories);
      fetchCreators();
    } else {
      console.log('No categories found, fetching all creators');
      fetchCreators();
    }
  }, [categoriesParam]);
  
  // Handle clicking outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (activeDropdown && 
          dropdownRef.current && 
          !dropdownRef.current.contains(event.target) && 
          !genderButtonRef.current?.contains(event.target) &&
          !locationButtonRef.current?.contains(event.target) &&
          !followersButtonRef.current?.contains(event.target)) {
        setActiveDropdown('');
      }
      
      // Close all filters panel when clicking outside
      if (showAllFilters && 
          allFiltersRef.current && 
          !allFiltersRef.current.contains(event.target) && 
          !allFiltersBtnRef.current?.contains(event.target)) {
        setShowAllFilters(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown, showAllFilters]);
  
  // Add overflow hidden to body when all filters is open
  useEffect(() => {
    if (showAllFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showAllFilters]);
  
  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? '' : dropdown);
  };
  
  // Handle country selection
  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    // Update filters when country changes
    fetchCreators();
  };
  
  // Handle influencer size selection
  const handleInfluencerSizeChange = (size) => {
    setSelectedInfluencerSize(size);
    
    // Map size selection to follower range
    let min = 0;
    let max = 0;
    
    switch (size) {
      case 'nano':
        min = 1000;
        max = 10000;
        break;
      case 'micro':
        min = 10000;
        max = 50000;
        break;
      case 'mid-tier':
        min = 50000;
        max = 500000;
        break;
      case 'macro':
        min = 500000;
        max = 1000000;
        break;
      case 'mega':
        min = 1000000;
        max = 0; // No upper limit
        break;
      default:
        min = 0;
        max = 0;
    }
    
    setFollowersFilter({ min, max });
    // Update filters when influencer size changes
    fetchCreators({ minFollowers: min, maxFollowers: max || '' });
  };
  
  // Toggle all filters sidebar
  const toggleAllFilters = () => {
    setShowAllFilters(!showAllFilters);
  };
  
  // Toggle section expansion in all filters sidebar
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Handle city selection
  const toggleCitySelection = (city) => {
    let newSelectedCities;
    if (selectedCities.includes(city)) {
      newSelectedCities = selectedCities.filter(c => c !== city);
    } else {
      newSelectedCities = [...selectedCities, city];
    }
    setSelectedCities(newSelectedCities);
    
    // Update filters when city selection changes
    setTimeout(() => fetchCreators(), 0);
  };
  
  // Remove city from selection
  const removeCity = (city) => {
    const newSelectedCities = selectedCities.filter(c => c !== city);
    setSelectedCities(newSelectedCities);
    
    // Update filters when city is removed
    setTimeout(() => fetchCreators(), 0);
  };
  
  // Handle gender filter change
  const handleGenderChange = (gender) => {
    setGenderFilter(gender);
    // Close the dropdown after selection
    setActiveDropdown('');
  };
  
  // Apply all filters - called when user clicks Apply button in the filter panel
  const applyAllFilters = () => {
    // Pass filter application flags to indicate these filters should be applied
    fetchCreators({
      applyLocationFilter: true,
      applyGenderFilter: true,
      applyFollowersFilter: true
    });
    setShowAllFilters(false);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setGenderFilter('');
    setLocationFilter('');
    setFollowersFilter({min: 0, max: 0});
    setSelectedInfluencerSize('');
    setSelectedCountry('India');
    setSelectedCities([]);
    
    // Fetch with only categories - reset all other filters
    fetchCreators();
  };

  // Static data removed - we now use dynamic data from the API

  return (
    <div className="filter-creators-container">
      <div className="search-filters-section">
        <div className="filters-row">
          <div className="active-filters">
            <div className="filter-badge">
              <IoCloseCircle className="filter-close-icon" />
              <span>Health & Fitness</span>
            </div>
            <div className="search-input-container">
              <input 
                type="text" 
                placeholder="Add More..." 
                className="search-input" 
              />
            </div>
          </div>
          <div className="search-actions">
            <button className="clear-search-btn">Clear Search</button>
            <button className="search-btn">
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
          <div className="filter-category" onClick={() => toggleDropdown('location')} ref={locationButtonRef}>
            <span>Location</span>
            <IoChevronDownOutline className="dropdown-icon" />
          </div>
          <div className="filter-category" onClick={() => toggleDropdown('gender')} ref={genderButtonRef}>
            <span>Gender</span>
            <IoChevronDownOutline className="dropdown-icon" />
          </div>
          <div className="filter-category" onClick={() => toggleDropdown('followers')} ref={followersButtonRef}>
            <span>Followers</span>
            <IoChevronDownOutline className="dropdown-icon" />
          </div>
          <div className="filter-category">
            <span>Influence Score</span>
            <IoChevronDownOutline className="dropdown-icon" />
          </div>
          <div className="filter-category all-filters" onClick={toggleAllFilters} ref={allFiltersBtnRef}>
            <BsFilterRight className="filter-icon" />
            <span>All Filters</span>
            <span className="filter-count">•</span>
          </div>
          
          {/* Gender Dropdown */}
          {activeDropdown === 'gender' && (
            <div className="dropdown-menu gender-dropdown" ref={dropdownRef} style={{
              top: genderButtonRef.current ? `${genderButtonRef.current.offsetTop + genderButtonRef.current.offsetHeight + 8}px` : '100%',
              left: genderButtonRef.current ? `${genderButtonRef.current.offsetLeft}px` : '0'
            }}>
              <div className="gender-selection dropdown-content" onClick={e => e.stopPropagation()}>
                <div className={`dropdown-item ${genderFilter === '' ? 'selected' : ''}`} onClick={() => handleGenderChange('')}>
                  All
                </div>
                <div className={`dropdown-item ${genderFilter === 'm' ? 'selected' : ''}`} onClick={() => handleGenderChange('m')}>
                  Male
                </div>
                <div className={`dropdown-item ${genderFilter === 'f' ? 'selected' : ''}`} onClick={() => handleGenderChange('f')}>
                  Female
                </div>
              </div>
            </div>
          )}
          
          {/* Followers Dropdown */}
          {activeDropdown === 'followers' && (
            <div className="dropdown-menu followers-dropdown" ref={dropdownRef} style={{
              top: followersButtonRef.current ? `${followersButtonRef.current.offsetTop + followersButtonRef.current.offsetHeight + 8}px` : '100%',
              left: followersButtonRef.current ? `${followersButtonRef.current.offsetLeft}px` : '0'
            }}>
              <h4>Select Followers</h4>
              <div className="slider-container">
                <div className="slider-track">
                  <div className="slider-handle left"></div>
                  <div className="slider-handle right"></div>
                </div>
              </div>
              
              <div className="followers-range">
                <div className="min-followers">
                  <span>Min Followers</span>
                  <div className="followers-input">Eg. 10000</div>
                </div>
                <div className="max-followers">
                  <span>Max Followers</span>
                  <div className="followers-input">Eg. 100000</div>
                </div>
              </div>
              
              <h4>Select By Influencer Size</h4>
              <div className="influencer-size-options">
                <div className="size-option">
                  <input 
                    type="radio" 
                    id="nano" 
                    name="influencerSize" 
                    checked={selectedInfluencerSize === 'nano'}
                    onChange={() => handleInfluencerSizeChange('nano')} 
                  />
                  <label htmlFor="nano">Nano</label>
                  <span className="size-range">1k-10k Followers</span>
                </div>
                <div className="size-option">
                  <input 
                    type="radio" 
                    id="micro" 
                    name="influencerSize" 
                    checked={selectedInfluencerSize === 'micro'}
                    onChange={() => handleInfluencerSizeChange('micro')} 
                  />
                  <label htmlFor="micro">Micro</label>
                  <span className="size-range">10k-100k Followers</span>
                </div>
                <div className="size-option">
                  <input 
                    type="radio" 
                    id="macro" 
                    name="influencerSize" 
                    checked={selectedInfluencerSize === 'macro'}
                    onChange={() => handleInfluencerSizeChange('macro')} 
                  />
                  <label htmlFor="macro">Macro</label>
                  <span className="size-range">100k-500k Followers</span>
                </div>
                <div className="size-option">
                  <input 
                    type="radio" 
                    id="mega" 
                    name="influencerSize" 
                    checked={selectedInfluencerSize === 'mega'}
                    onChange={() => handleInfluencerSizeChange('mega')} 
                  />
                  <label htmlFor="mega">Mega</label>
                  <span className="size-range">500k-1m Followers</span>
                </div>
                <div className="size-option">
                  <input 
                    type="radio" 
                    id="alisters" 
                    name="influencerSize" 
                    checked={selectedInfluencerSize === 'alisters'}
                    onChange={() => handleInfluencerSizeChange('alisters')} 
                  />
                  <label htmlFor="alisters">A-Listers</label>
                  <span className="size-range">1m+ Followers</span>
                </div>
              </div>
              
              <div className="filter-actions">
                <button className="clear-filter">Clear Filter</button>
                <button className="apply-filter">Apply</button>
              </div>
            </div>
          )}
          
          {/* Location Dropdown */}
          {activeDropdown === 'location' && (
            <div className="dropdown-menu location-dropdown" ref={dropdownRef} style={{
              top: locationButtonRef.current ? `${locationButtonRef.current.offsetTop + locationButtonRef.current.offsetHeight + 8}px` : '100%',
              left: locationButtonRef.current ? `${locationButtonRef.current.offsetLeft}px` : '0'
            }}>
              <h4>Select Country</h4>
              <div className="country-options">
                <div className="country-option">
                  <input 
                    type="radio" 
                    id="india" 
                    name="country" 
                    checked={selectedCountry === 'India'} 
                    onChange={() => handleCountryChange('India')} 
                  />
                  <label htmlFor="india">🇮🇳 India</label>
                </div>
                <div className="country-option">
                  <input 
                    type="radio" 
                    id="uae" 
                    name="country" 
                    checked={selectedCountry === 'United Arab Emirates'}
                    onChange={() => handleCountryChange('United Arab Emirates')} 
                  />
                  <label htmlFor="uae">🇦🇪 United Arab Emirates</label>
                </div>
                <div className="country-option">
                  <input 
                    type="radio" 
                    id="saudi" 
                    name="country" 
                    checked={selectedCountry === 'Saudi Arabia'}
                    onChange={() => handleCountryChange('Saudi Arabia')} 
                  />
                  <label htmlFor="saudi">🇸🇦 Saudi Arabia</label>
                </div>
              </div>
              
              <h4>State / City</h4>
              <div className="city-search">
                <div className="search-input-wrapper">
                  <FiSearch className="search-icon" />
                  <input type="text" placeholder="Eg. Mumbai, Delhi" />
                </div>
              </div>
              
              <div className="city-options">
                <div className="city-option">Mumbai</div>
                <div className="city-option">Delhi</div>
                <div className="city-option">Bengaluru</div>
                <div className="city-option">Chennai</div>
                <div className="city-option">Gurgaon</div>
              </div>
              
              <div className="filter-actions">
                <button className="clear-filter">Clear Filter</button>
                <button className="apply-filters">Apply Filters</button>
              </div>
            </div>
          )}
        </div>

        <div className="results-count">
          <span className="count">22,822</span>
          <span className="profiles-text">profiles</span>
          <div className="sort-followers">
            <span>Followers</span>
            <IoChevronDownOutline className="dropdown-icon" />
          </div>
        </div>
      </div>

      {/* All Filters Sidebar */}
      {showAllFilters && (
        <div className="all-filters-overlay">
          <div className="all-filters-sidebar" ref={allFiltersRef}>
            <div className="sidebar-header">
              <h2>ALL FILTERS</h2>
              <button className="close-btn" onClick={() => setShowAllFilters(false)}>
                <MdOutlineClose />
              </button>
            </div>
            
            <div className="sidebar-content">
              <div className="filter-section">
                <div className="section-header basic-filters">
                  <span className="section-icon">✦</span>
                  <span className="section-title">BASIC FILTERS</span>
                </div>
                
                <div className="filter-item" onClick={() => toggleSection('categories')}>
                  <div className="filter-item-header">
                    <div className="filter-item-title">
                      <span className="required">Categories</span>
                      <span className="required-mark">*</span>
                    </div>
                    {expandedSections.categories ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                  </div>
                </div>
                
                <div className="filter-item" onClick={() => toggleSection('location')}>
                  <div className="filter-item-header">
                    <div className="filter-item-title">
                      <span className="required">Location</span>
                      <span className="required-mark">*</span>
                    </div>
                    {expandedSections.location ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
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
                              checked={selectedCountry === 'India'} 
                              onChange={() => handleCountryChange('India')} 
                            />
                            <label htmlFor="filter-india">🇮🇳 India</label>
                          </div>
                          <div className="country-option">
                            <input 
                              type="radio" 
                              id="filter-uae" 
                              name="filter-country" 
                              checked={selectedCountry === 'United Arab Emirates'}
                              onChange={() => handleCountryChange('United Arab Emirates')} 
                            />
                            <label htmlFor="filter-uae">🇦🇪 United Arab Emirates</label>
                          </div>
                          <div className="country-option">
                            <input 
                              type="radio" 
                              id="filter-saudi" 
                              name="filter-country" 
                              checked={selectedCountry === 'Saudi Arabia'}
                              onChange={() => handleCountryChange('Saudi Arabia')} 
                            />
                            <label htmlFor="filter-saudi">🇸🇦 Saudi Arabia</label>
                          </div>
                        </div>
                        
                        <h4>SELECT STATE / CITY</h4>
                        <div className="selected-cities">
                          {selectedCities.map((city, index) => (
                            <div className="selected-city" key={index}>
                              <span>{city}</span>
                              <button className="remove-city" onClick={() => removeCity(city)}>
                                <IoMdClose />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="filter-item" onClick={() => toggleSection('gender')}>
                  <div className="filter-item-header">
                    <div className="filter-item-title">
                      <span className="required">Gender</span>
                      <span className="required-mark">*</span>
                    </div>
                    {expandedSections.gender ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                  </div>
                </div>
                
                <div className="filter-item" onClick={() => toggleSection('followers')}>
                  <div className="filter-item-header">
                    <div className="filter-item-title">
                      <span className="required">Followers</span>
                      <span className="required-mark">*</span>
                    </div>
                    {expandedSections.followers ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                  </div>
                </div>
                
                <div className="filter-item" onClick={() => toggleSection('influenceScore')}>
                  <div className="filter-item-header">
                    <div className="filter-item-title">
                      <span>Influence Score</span>
                      <span className="info-icon"><FiInfo /></span>
                    </div>
                    {expandedSections.influenceScore ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                  </div>
                </div>
                
                <div className="filter-toggle-item">
                  <div className="toggle-item-left">
                    <span className="toggle-title">Faster Responses</span>
                    <span className="required-mark">*</span>
                  </div>
                  <div className={`toggle-switch ${fasterResponses ? 'active' : ''}`} onClick={() => setFasterResponses(!fasterResponses)}>
                    <div className={`toggle-slider ${fasterResponses ? 'active' : ''}`}></div>
                  </div>
                </div>
                
                <div className="filter-toggle-item">
                  <div className="toggle-item-left">
                    <span className="toggle-title">Instagram Verified</span>
                    <span className="verified-icon">✓</span>
                  </div>
                  <div className={`toggle-switch ${instagramVerified ? 'active' : ''}`} onClick={() => setInstagramVerified(!instagramVerified)}>
                    <div className={`toggle-slider ${instagramVerified ? 'active' : ''}`}></div>
                  </div>
                </div>
                
                <div className="filter-toggle-item">
                  <div className="toggle-item-left">
                    <span className="toggle-title">Has YouTube</span>
                  </div>
                  <div className={`toggle-switch ${hasYoutube ? 'active' : ''}`} onClick={() => setHasYoutube(!hasYoutube)}>
                    <div className={`toggle-slider ${hasYoutube ? 'active' : ''}`}></div>
                  </div>
                </div>
              </div>
              
              <div className="filter-section keyword-search">
                <div className="section-header">
                  <span className="section-icon">🔍</span>
                  <span className="section-title">KEYWORD SEARCH</span>
                </div>
                
                <div className="filter-item" onClick={() => toggleSection('captionsKeywords')}>
                  <div className="filter-item-header">
                    <div className="filter-item-title">
                      <span>Captions Keywords & Hashtags</span>
                    </div>
                    {expandedSections.captionsKeywords ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                  </div>
                </div>
                
                <div className="filter-item" onClick={() => toggleSection('bioKeywords')}>
                  <div className="filter-item-header">
                    <div className="filter-item-title">
                      <span>Bio Keywords</span>
                    </div>
                    {expandedSections.bioKeywords ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                  </div>
                </div>
              </div>
              
              <div className="filter-section contact">
                <div className="section-header">
                  <span className="section-icon">✦</span>
                  <span className="section-title">CONTACT</span>
                </div>
                
                <div className="filter-item" onClick={() => toggleSection('contactAvailability')}>
                  <div className="filter-item-header">
                    <div className="filter-item-title">
                      <span>Contact Availability</span>
                    </div>
                    {expandedSections.contactAvailability ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                  </div>
                </div>
              </div>
              
              <div className="filter-section audience">
                <div className="section-header">
                  <span className="section-icon">✦</span>
                  <span className="section-title">AUDIENCE</span>
                </div>
                
                <div className="filter-item" onClick={() => toggleSection('audienceCredibility')}>
                  <div className="filter-item-header">
                    <div className="filter-item-title">
                      <span>Audience Credibility</span>
                    </div>
                    {expandedSections.audienceCredibility ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                  </div>
                </div>
                
                <div className="filter-item" onClick={() => toggleSection('audienceGender')}>
                  <div className="filter-item-header">
                    <div className="filter-item-title">
                      <span>Audience Gender</span>
                    </div>
                    {expandedSections.audienceGender ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                  </div>
                </div>
                
                <div className="filter-item" onClick={() => toggleSection('audienceLocation')}>
                  <div className="filter-item-header">
                    <div className="filter-item-title">
                      <span>Audience Location</span>
                    </div>
                    {expandedSections.audienceLocation ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                  </div>
                </div>
                
                <div className="filter-item" onClick={() => toggleSection('audienceInterest')}>
                  <div className="filter-item-header">
                    <div className="filter-item-title">
                      <span>Audience Interest</span>
                    </div>
                    {expandedSections.audienceInterest ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                  </div>
                </div>
                
                <div className="filter-item" onClick={() => toggleSection('audienceLanguage')}>
                  <div className="filter-item-header">
                    <div className="filter-item-title">
                      <span>Audience Language</span>
                    </div>
                    {expandedSections.audienceLanguage ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                  </div>
                </div>
                
                <div className="filter-item" onClick={() => toggleSection('audienceAgeRange')}>
                  <div className="filter-item-header">
                    <div className="filter-item-title">
                      <span>Audience Age Range</span>
                    </div>
                    {expandedSections.audienceAgeRange ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                  </div>
                </div>
                
                <div className="filter-item" onClick={() => toggleSection('averageFollowerGrowth')}>
                  <div className="filter-item-header">
                    <div className="filter-item-title">
                      <span>Average Follower Growth</span>
                    </div>
                    {expandedSections.averageFollowerGrowth ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                  </div>
                </div>
              </div>
              
              <div className="filter-section post-performance">
                <div className="section-header">
                  <span className="section-icon">📊</span>
                  <span className="section-title">POST PERFORMANCE</span>
                </div>
                
                <div className="filter-item" onClick={() => toggleSection('lastPosted')}>
                  <div className="filter-item-header">
                    <div className="filter-item-title">
                      <span>Last Posted Within</span>
                    </div>
                    {expandedSections.lastPosted ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                  </div>
                </div>
                
                <div className="filter-item" onClick={() => toggleSection('engagementRate')}>
                  <div className="filter-item-header">
                    <div className="filter-item-title">
                      <span>Engagement Rate</span>
                      <span className="info-icon"><FiInfo /></span>
                    </div>
                    {expandedSections.engagementRate ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                  </div>
                </div>
                
                <div className="filter-item" onClick={() => toggleSection('averageLikes')}>
                  <div className="filter-item-header">
                    <div className="filter-item-title">
                      <span>Average Likes</span>
                    </div>
                    {expandedSections.averageLikes ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                  </div>
                </div>
              </div>
              
              <div className="sidebar-actions">
                <button className="reset-btn" onClick={resetFilters}>Reset</button>
                <button className="apply-btn" onClick={applyAllFilters}>SHOW PROFILES ({totalResults})</button>
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
              <div className="table-row" key={index}>
                <div className="checkbox-col">
                  <input type="checkbox" />
                </div>
                <div className="profile-col">
                  <div className="profile-img-container">
                    <div className="profile-img" style={{backgroundImage: `url(${influencer.profileImg})`}}></div>
                  </div>
                  <div className="profile-info">
                    <div className="profile-name">{influencer.name}</div>
                    <div className="profile-handle">{influencer.handle}</div>
                  </div>
                </div>
                <div className="col score">{influencer.influenceScore}</div>
                <div className="col followers">{influencer.followers}</div>
                <div className="col avg-likes">{influencer.avgLikes}</div>
                <div className="col avg-reel-views">{influencer.avgReelViews}</div>
                <div className="col er">{influencer.er}</div>
                <div className="col location">{influencer.location}</div>
                <div className="col categories">
                  {influencer.categories.map((category, idx) => (
                    <span key={idx} className="category-badge">{category}</span>
                  ))}
                  {influencer.moreCategories > 0 && (
                    <span className="more-categories">+{influencer.moreCategories} more</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No influencers found matching your criteria.</p>
              <button onClick={resetFilters} className="reset-btn">Reset Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
