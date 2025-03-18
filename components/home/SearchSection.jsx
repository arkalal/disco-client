"use client";

import { useState } from "react";
import { AiOutlineInstagram } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { BsArrowRight } from "react-icons/bs";

const SearchSection = () => {
  const [platform, setPlatform] = useState("Instagram");

  return (
    <div className="search-section">
      <h1>Browse from Largest Database of Influencers</h1>

      <div className="search-container">
        <div className="platform-selector">
          <AiOutlineInstagram className="platform-icon" />
          <span>{platform}</span>
          <MdKeyboardArrowDown className="arrow-icon" />
        </div>

        <input
          type="text"
          placeholder="Search Brands, Influencers, Categories and so on"
          className="search-input"
        />
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
