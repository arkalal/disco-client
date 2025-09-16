"use client";

import React from "react";
import "./InfluencerCardSkeletonLoader.scss";

const InfluencerCardSkeletonLoader = () => {
  return (
    <div className="influencer-card-skeleton">
      <div className="skeleton-avatar"></div>
      <div className="skeleton-name"></div>
      <div className="skeleton-username"></div>
      <div className="skeleton-metrics">
        <div className="skeleton-metric"></div>
        <div className="skeleton-metric"></div>
        <div className="skeleton-metric"></div>
        <div className="skeleton-metric"></div>
      </div>
    </div>
  );
};

export default InfluencerCardSkeletonLoader;
