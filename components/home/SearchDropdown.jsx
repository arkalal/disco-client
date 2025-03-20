"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { AiOutlineInstagram } from "react-icons/ai";
import { BsStars, BsArrowRight, BsCheckCircleFill } from "react-icons/bs";
import { IoIosMusicalNotes, IoIosPeople } from "react-icons/io";
import { MdOutlineSportsBasketball, MdOutlineSchool } from "react-icons/md";
import { PiTelevisionSimpleBold } from "react-icons/pi";
import { FiSearch } from "react-icons/fi";

const SearchDropdown = ({ isOpen, onClose, searchContainerRef }) => {
  const dropdownRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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
        <div className="category-item">
          <span className="category-icon arts">🎭</span>
          <span className="category-name">Arts & Entertainment</span>
        </div>
        <div className="category-item">
          <span className="category-icon fashion">👗</span>
          <span className="category-name">Fashion</span>
        </div>
        <div className="category-item">
          <span className="category-icon family">📱</span>
          <span className="category-name">Family & Parenting</span>
        </div>
        <div className="category-item">
          <span className="category-icon travel">🌎</span>
          <span className="category-name">Travel</span>
        </div>
        <div className="category-item">
          <span className="category-icon fitness">🏋️</span>
          <span className="category-name">Fitness</span>
        </div>
        <div className="category-item">
          <span className="category-icon education">🎓</span>
          <span className="category-name">Education</span>
        </div>
        <div className="category-item">
          <span className="category-icon creator">⭐</span>
          <span className="category-name">Content Creator</span>
        </div>
      </div>

      <div className="search-dropdown-section">
        <div className="section-header">INFLUENCER PROFILES</div>
        <div className="influencer-profiles">
          <div className="influencer-profile">
            <div className="influencer-avatar">
              <img src="https://via.placeholder.com/40" alt="Disha Patani" />
            </div>
            <div className="influencer-info">
              <div className="influencer-name">
                Disha Patani
                <BsCheckCircleFill className="verified-badge-icon" />
              </div>
              <div className="influencer-username">@dishapatani</div>
            </div>
            <div className="profile-arrow">
              <BsArrowRight />
            </div>
          </div>
          <div className="influencer-profile">
            <div className="influencer-avatar">
              <img src="https://via.placeholder.com/40" alt="Anushka Sen" />
            </div>
            <div className="influencer-info">
              <div className="influencer-name">
                Anushka Sen
                <BsCheckCircleFill className="verified-badge-icon" />
              </div>
              <div className="influencer-username">@anushkasen0408</div>
            </div>
            <div className="profile-arrow">
              <BsArrowRight />
            </div>
          </div>
          <div className="influencer-profile">
            <div className="influencer-avatar">
              <img
                src="https://via.placeholder.com/40"
                alt="Manushi Chhillar"
              />
            </div>
            <div className="influencer-info">
              <div className="influencer-name">
                Manushi Chhillar
                <BsCheckCircleFill className="verified-badge-icon" />
              </div>
              <div className="influencer-username">@manushi_chhillar</div>
            </div>
            <div className="profile-arrow">
              <BsArrowRight />
            </div>
          </div>
          <div className="influencer-profile">
            <div className="influencer-avatar">
              <img src="https://via.placeholder.com/40" alt="Valmakry" />
            </div>
            <div className="influencer-info">
              <div className="influencer-name">Valmakry</div>
              <div className="influencer-username">@valmakry</div>
            </div>
            <div className="profile-arrow">
              <BsArrowRight />
            </div>
          </div>
          <div className="influencer-profile">
            <div className="influencer-avatar">
              <img src="https://via.placeholder.com/40" alt="KyatGirl" />
            </div>
            <div className="influencer-info">
              <div className="influencer-name">KyatGirl</div>
              <div className="influencer-username">@kyatgirl</div>
            </div>
            <div className="profile-arrow">
              <BsArrowRight />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchDropdown;
