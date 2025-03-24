"use client";

import { MdLocationOn } from "react-icons/md";
import "./ProfileHeader.scss";

const ProfileHeader = ({ profileData }) => {
  return (
    <header className="profile-header">
      <div className="profile-img-container">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrF_us_E4GVwoLVbaCVoSE84B4yA5WUCIUqQ&usqp=CAU"
          alt={profileData.name}
          className="profile-img"
        />
      </div>

      <div className="profile-info">
        <h1 className="profile-name">{profileData.name}</h1>
        <div className="profile-categories">
          {profileData.category &&
            profileData.category.map((cat, index) => (
              <span key={index} className="category-tag">
                {cat}
              </span>
            ))}
        </div>
        <p className="profile-bio">{profileData.bio}</p>
        <div className="profile-location">
          <MdLocationOn />
          <span>{profileData.location}</span>
        </div>
      </div>

      <div className="profile-actions">
        <button className="update-profile-btn">Update Profile</button>
        <div className="action-buttons">
          <button className="action-btn add-to-list-btn">
            <span className="btn-icon">+</span>
            Add to list
          </button>
          <button className="action-btn message-btn">Message</button>
          <button className="action-btn compare-btn">Compare</button>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
