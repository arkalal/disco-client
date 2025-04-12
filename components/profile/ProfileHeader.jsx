"use client";

import React from "react";
import Image from "next/image";
import { IoLocationOutline } from "react-icons/io5";
import { FiPlus, FiRefreshCw } from "react-icons/fi";
import { FaGlobe, FaInstagram } from "react-icons/fa";
import "./ProfileHeader.scss";

const ProfileHeader = ({ profileData }) => {
  // Extract the country name from the tags or default to a location
  const getLocation = () => {
    if (
      profileData.audience?.countries &&
      profileData.audience.countries.length > 0
    ) {
      return profileData.audience.countries[0].name.replace(/^(\w)/, (m) =>
        m.toUpperCase()
      );
    }
    return profileData.country || "Global";
  };

  // Get categories as array
  const getCategories = () => {
    if (profileData.categories && profileData.categories.length > 0) {
      return profileData.categories.slice(0, 2).map((cat) =>
        cat
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      );
    }
    return ["Arts & Entertainment", "Influencer"];
  };

  return (
    <div className="profile-header-container">
      <div className="header-top">
        <button className="update-profile-btn">
          <span>Update Profile</span>
          <FiRefreshCw className="refresh-icon" />
        </button>
      </div>

      <div className="header-main">
        <div className="left-content">
          <div className="profile-avatar">
            {profileData.profilePicture ? (
              <div className="avatar-wrapper">
                <Image
                  src={profileData.profilePicture}
                  alt={profileData?.name || "Profile Image"}
                  width={125}
                  height={125}
                  className="avatar-image"
                  priority
                  unoptimized={true}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/125?text=Profile";
                  }}
                />
              </div>
            ) : (
              <div className="fallback-avatar">
                <FaInstagram size={50} />
              </div>
            )}
          </div>
          <div className="profile-details">
            <h1 className="profile-name">
              {profileData?.name || "Instagram User"}
              {profileData.verified && (
                <span className="verified-badge" title="Verified Account">
                  ✓
                </span>
              )}
            </h1>
            <div className="profile-categories">
              {getCategories().map((category, index) => (
                <div className="category-tag" key={index}>
                  {category}
                </div>
              ))}
            </div>
            <p className="profile-bio">
              {profileData?.bio || "No bio available"}
            </p>
            <div className="profile-meta">
              <div className="profile-location">
                <IoLocationOutline className="location-icon" />
                <span>{getLocation()}</span>
              </div>
              {profileData.website && (
                <div className="profile-website">
                  <FaGlobe className="website-icon" />
                  <a
                    href={
                      profileData.website.startsWith("http")
                        ? profileData.website
                        : `https://${profileData.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {profileData.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="add-to-list-btn">
            <FiPlus />
            <span>Add to list</span>
          </button>
          <button className="message-btn">Message</button>
          <button className="compare-btn">Compare</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
