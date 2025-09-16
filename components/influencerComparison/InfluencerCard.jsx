"use client";

import React from "react";
import { AiOutlineClose, AiOutlineInstagram } from "react-icons/ai";
import "./InfluencerCard.scss";

const InfluencerCard = ({ profile, onRemove }) => {
  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className="influencer-card">
      <div className="card-header">
        <div className="platform-icon">
          <AiOutlineInstagram />
        </div>
        <button 
          className="remove-button" 
          onClick={handleRemove}
          aria-label="Remove influencer"
        >
          <AiOutlineClose />
        </button>
      </div>
      <div className="card-content">
        <div className="influencer-avatar">
          <img 
            src={profile.profilePicture || profile.image} 
            alt={profile.name} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/80?text=Profile";
            }}
          />
        </div>
        <h3 className="influencer-name">{profile.name}</h3>
        <div className="influencer-username">@{profile.username}</div>
      </div>
    </div>
  );
};

export default InfluencerCard;
