"use client";

import { useState } from "react";
import { FiInfo } from "react-icons/fi";
import "./ContentPreview.scss";

const ContentPreview = () => {
  const [activeTab, setActiveTab] = useState("recent");

  const recentPosts = [
    {
      id: 1,
      image: "https://placehold.co/300x300/jpeg?text=Post+1",
      engagement: "2.4%",
      date: "2 days ago",
    },
    {
      id: 2,
      image: "https://placehold.co/300x300/jpeg?text=Post+2",
      engagement: "3.1%",
      date: "5 days ago",
    },
    {
      id: 3,
      image: "https://placehold.co/300x300/jpeg?text=Post+3",
      engagement: "1.8%",
      date: "1 week ago",
    },
    {
      id: 4,
      image: "https://placehold.co/300x300/jpeg?text=Post+4",
      engagement: "2.9%",
      date: "2 weeks ago",
    },
  ];

  return (
    <div className="content-preview-section">
      <div className="section-header">
        <h3>
          RECENT POSTS <FiInfo />
        </h3>
      </div>

      <div className="posts-grid">
        {recentPosts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-image-container">
              <img
                src={post.image && post.image.trim() !== "" ? post.image : `https://placehold.co/300x300/jpeg?text=Post+${post.id}`}
                alt={`Post ${post.id}`}
                className="post-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/300x300/jpeg?text=Post+${post.id}`;
                }}
              />
            </div>
            <div className="post-details">
              <div className="post-engagement">
                <span className="engagement-label">Engagement</span>
                <span className="engagement-value">{post.engagement}</span>
              </div>
              <div className="post-date">{post.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentPreview;
