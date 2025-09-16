"use client";

import React from 'react';
import './ProfileSkeletonLoader.scss';

const ProfileSkeletonLoader = () => {
  return (
    <div className="profile-skeleton-loader">
      {/* Sidebar Skeleton */}
      <div className="skeleton-sidebar"></div>
      
      <div className="skeleton-main-content">
        {/* Profile Header Skeleton */}
        <div className="skeleton-profile-header">
          <div className="skeleton-avatar-container">
            <div className="skeleton-avatar pulse"></div>
            <div className="skeleton-profile-details">
              <div className="skeleton-name pulse"></div>
              <div className="skeleton-category pulse"></div>
              <div className="skeleton-bio pulse"></div>
            </div>
          </div>
          <div className="skeleton-actions">
            <div className="skeleton-button pulse"></div>
            <div className="skeleton-button pulse"></div>
          </div>
        </div>

        {/* Profile Navigation Skeleton */}
        <div className="skeleton-navigation">
          <div className="skeleton-tab pulse"></div>
          <div className="skeleton-tab pulse"></div>
        </div>

        {/* Profile Content Layout Skeleton */}
        <div className="skeleton-content-layout">
          {/* Vertical Tabs Skeleton */}
          <div className="skeleton-tabs">
            <div className="skeleton-vertical-tab pulse"></div>
            <div className="skeleton-vertical-tab pulse"></div>
            <div className="skeleton-vertical-tab pulse"></div>
            <div className="skeleton-vertical-tab pulse"></div>
          </div>

          {/* Content Area Skeleton */}
          <div className="skeleton-content-area">
            {/* Overview Card */}
            <div className="skeleton-card">
              <div className="skeleton-card-header pulse"></div>
              <div className="skeleton-metrics-grid">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="skeleton-metric">
                    <div className="skeleton-metric-label pulse"></div>
                    <div className="skeleton-metric-value pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Card */}
            <div className="skeleton-card">
              <div className="skeleton-card-header pulse"></div>
              <div className="skeleton-card-content">
                <div className="skeleton-bar pulse"></div>
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="skeleton-category-item">
                    <div className="skeleton-icon pulse"></div>
                    <div className="skeleton-details">
                      <div className="skeleton-text pulse"></div>
                      <div className="skeleton-bar pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeletonLoader;
