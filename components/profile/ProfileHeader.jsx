"use client";

import React from "react";
import Image from "next/image";
import { IoLocationOutline } from "react-icons/io5";
import { FiPlus, FiRefreshCw } from "react-icons/fi";
import "./ProfileHeader.scss";

const ProfileHeader = ({ profileData }) => {
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
            <Image
              src="/images/srkking555_original_1742485823.1608632.JPEG"
              alt={profileData?.name || "Profile Image"}
              width={125}
              height={125}
              className="avatar-image"
              priority
            />
          </div>
          <div className="profile-details">
            <h1 className="profile-name">
              {profileData?.name || "Shah Rukh Khan"}
            </h1>
            <div className="profile-categories">
              <div className="category-tag">Arts & Entertainment</div>
              <div className="category-tag">Movies</div>
            </div>
            <p className="profile-bio">
              {profileData?.bio ||
                "This fan page is dedicated to the Actor SRK. Upcoming movie : King, PATHAAN 2 Upcoming web series : The Ba***ds of Boll..."}
            </p>
            <div className="profile-location">
              <IoLocationOutline className="location-icon" />
              <span>{profileData?.location || "India"}</span>
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
