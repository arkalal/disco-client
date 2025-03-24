"use client";

import React from "react";
import { FaInstagram } from "react-icons/fa";
import { RiHeartLine } from "react-icons/ri";
import "./ProfileOverview.scss";

const ProfileOverview = ({ profileData }) => {
  const percentage = (profileData.influenceScore / 10) * 100;
  const scoreGaugeStyle = {
    background: `conic-gradient(#4338CA ${percentage}%, #e9e9e9 0%)`,
  };

  return (
    <div className="profile-overview">
      {/* Overview Section */}
      <div className="announcement-banner">
        <span className="new-badge">NEW</span>
        <p>Introducing Audience Credibility</p>
        <button className="learn-more-btn">Learn More</button>
      </div>

      <div className="metrics-section">
        <div className="metric-row">
          <div className="metric-card">
            <div className="metric-label">FOLLOWERS</div>
            <div className="metric-value">{profileData.followers}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">
              ENGAGEMENT RATE <span className="info-icon">i</span>
            </div>
            <div className="metric-value">
              {profileData.engagementRate}{" "}
              <span className="badge">Average</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">ESTIMATED REACH</div>
            <div className="metric-value">{profileData.estimatedReach}</div>
          </div>
        </div>
      </div>

      <div className="influence-section">
        <div className="influence-header">
          <h3>
            INFLUENCE SCORE <span className="info-icon">i</span>
          </h3>
        </div>
        <div className="score-container">
          <div className="score-gauge" style={scoreGaugeStyle}>
            <div className="score-value">{profileData.influenceScore}</div>
          </div>
          <div className="score-scale">
            <div>1</div>
            <div>10</div>
          </div>
        </div>
      </div>

      <div className="insights-container">
        <h3>INSIGHTS FOR YOU</h3>
        <div className="insights-list">
          <div className="insight-item positive">
            <div className="insight-icon">+</div>
            <div className="insight-text">
              <div className="insight-title">Moderately engaging audience</div>
              <div className="insight-description">
                1.33% of the followers of this creator engages with their
                content.
              </div>
            </div>
          </div>
          <div className="insight-item positive">
            <div className="insight-icon">+</div>
            <div className="insight-text">
              <div className="insight-title">High reel viewership</div>
              <div className="insight-description">
                This Creator generates 33.75 views per 100 followers.
              </div>
            </div>
          </div>
          <div className="insight-item positive">
            <div className="insight-icon">+</div>
            <div className="insight-text">
              <div className="insight-title">
                High ability to drive comments
              </div>
              <div className="insight-description">
                This creator drives 0.61 comments per 100 likes.
              </div>
            </div>
          </div>
          <div className="insight-item negative">
            <div className="insight-icon">-</div>
            <div className="insight-text">
              <div className="insight-title">Posts content aggressively</div>
              <div className="insight-description">
                This creator posts more than 68 times in last 30 days.
              </div>
            </div>
          </div>
          <div className="insight-item neutral">
            <div className="insight-icon">!</div>
            <div className="insight-text">
              <div className="insight-title">Moderate Indian follower base</div>
              <div className="insight-description">
                This creator has about 56.99% follower base from India.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Section */}
      <div className="section-divider"></div>
      <div className="engagement-content">
        <div className="engagement-header">
          <div className="engagement-icon">
            <RiHeartLine />
          </div>
          <h2>ENGAGEMENTS & VIEWS</h2>
        </div>

        <div className="content-types">
          <div className="content-type">
            <div className="instagram-icon">
              <FaInstagram size={20} />
            </div>
            <div className="content-label">Images</div>

            <div className="engagement-stats">
              <div className="stat-item">
                <div className="stat-label">AVG. LIKES</div>
                <div className="stat-value">17.4k</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">AVG. COMMENTS</div>
                <div className="stat-value">108</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">ENGAGEMENT RATE</div>
                <div className="stat-value">1.49%</div>
              </div>
            </div>
          </div>

          <div className="content-type">
            <div className="reels-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"
                  fill="currentColor"
                />
                <path
                  d="M12 3C12.5523 3 13 3.44772 13 4C13 4.55228 12.5523 5 12 5C11.4477 5 11 4.55228 11 4C11 3.44772 11.4477 3 12 3Z"
                  fill="currentColor"
                />
                <path
                  d="M18.3639 5.63604C18.7545 6.02656 18.7545 6.65973 18.3639 7.05025C17.9734 7.44078 17.3402 7.44078 16.9497 7.05025C16.5592 6.65973 16.5592 6.02656 16.9497 5.63604C17.3402 5.24551 17.9734 5.24551 18.3639 5.63604Z"
                  fill="currentColor"
                />
                <path
                  d="M20 12C20 11.4477 20.4477 11 21 11C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13C20.4477 13 20 12.5523 20 12Z"
                  fill="currentColor"
                />
                <path
                  d="M18.3639 16.9497C18.7545 16.5592 19.3877 16.5592 19.7782 16.9497C20.1687 17.3402 20.1687 17.9734 19.7782 18.3639C19.3877 18.7545 18.7545 18.7545 18.3639 18.3639C17.9734 17.9734 17.9734 17.3402 18.3639 16.9497Z"
                  fill="currentColor"
                />
                <path
                  d="M12 19C12.5523 19 13 19.4477 13 20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20C11 19.4477 11.4477 19 12 19Z"
                  fill="currentColor"
                />
                <path
                  d="M5.63604 16.9497C6.02656 16.5592 6.65973 16.5592 7.05025 16.9497C7.44078 17.3402 7.44078 17.9734 7.05025 18.3639C6.65973 18.7545 6.02656 18.7545 5.63604 18.3639C5.24551 17.9734 5.24551 17.3402 5.63604 16.9497Z"
                  fill="currentColor"
                />
                <path
                  d="M3 12C3 11.4477 3.44772 11 4 11C4.55228 11 5 11.4477 5 12C5 12.5523 4.55228 13 4 13C3.44772 13 3 12.5523 3 12Z"
                  fill="currentColor"
                />
                <path
                  d="M5.63604 7.05025C5.24551 6.65973 5.24551 6.02656 5.63604 5.63604C6.02656 5.24551 6.65973 5.24551 7.05025 5.63604C7.44078 6.02656 7.44078 6.65973 7.05025 7.05025C6.65973 7.44078 6.02656 7.44078 5.63604 7.05025Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="content-label">Reels</div>

            <div className="engagement-stats">
              <div className="stat-item">
                <div className="stat-label">AVG. VIEWS</div>
                <div className="stat-value">397.2k</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">AVG. LIKES</div>
                <div className="stat-value">28.1k</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">AVG. COMMENTS</div>
                <div className="stat-value">141</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">ENGAGEMENT RATE</div>
                <div className="stat-value">2.40%</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">VIEW RATE</div>
                <div className="stat-value">33.75%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="engagement-metrics">
          <div className="metric-section">
            <div className="metric-header">
              <h3>LIKES - COMMENTS RATIO</h3>
              <div className="info-icon">i</div>
            </div>

            <div className="metric-value-container">
              <div className="metric-value">0.61</div>
              <div className="metric-badge">Average</div>
            </div>

            <div className="metric-description">
              Average ratio for similar influencers is around 0.96
            </div>
          </div>

          <div className="metric-section">
            <div className="metric-header">
              <h3>REEL VIEWS TO FOLLOWERS RATIO</h3>
              <div className="info-icon">i</div>
            </div>

            <div className="metric-value-container">
              <div className="metric-value">33.75</div>
              <div className="metric-badge good">Good</div>
            </div>

            <div className="metric-description">
              Similar accounts generate around 24.65 views per 100 followers.
            </div>
          </div>
        </div>
      </div>

      {/* Platform Section */}
      <div className="section-divider"></div>
      <div className="platforms-content">
        <div className="platform-user">
          <div className="instagram-icon">
            <FaInstagram size={22} />
          </div>
          <div className="platform-username">@{profileData.username}</div>
          <div className="platform-influence-score">
            {profileData.influenceScore}
          </div>
        </div>

        <div className="platform-metrics">
          <div className="metrics-grid">
            <div className="metric-item">Followers</div>
            <div className="metric-item">Avg. Likes</div>
            <div className="metric-item">Avg. Comments</div>
            <div className="metric-item">Avg. Reel Views</div>
            <div className="metric-item">Estimated Reach</div>
            <div className="metric-item">Engagement Rate</div>

            <div className="metric-value">1.2m</div>
            <div className="metric-value">15.6k</div>
            <div className="metric-value">96</div>
            <div className="metric-value">397.2k</div>
            <div className="metric-value">174.7k</div>
            <div className="metric-value">1.33%</div>
          </div>
        </div>

        <div className="content-section">
          <div className="section-header">
            <h3>CONTENT</h3>
          </div>

          <div className="content-categories">
            <h4>CONTENT CATEGORIES</h4>
            <div className="category-bar">
              <div
                className="category-bar-fill"
                style={{
                  width: "95.92%",
                  backgroundColor: "#4338ca",
                }}
              ></div>
            </div>

            <div className="categories-list">
              <div className="category-item">
                <div className="category-icon">🎭</div>
                <div className="category-details">
                  <div className="category-name">Arts & Entertainment</div>
                  <div className="category-bar">
                    <div
                      className="category-bar-fill"
                      style={{
                        width: "95.92%",
                        backgroundColor: "#4338ca",
                      }}
                    ></div>
                  </div>
                  <div className="category-percentage">95.92%</div>
                </div>
              </div>

              <div className="category-item">
                <div className="category-icon">🎬</div>
                <div className="category-details">
                  <div className="category-name">
                    Movies - Arts & Entertainment
                  </div>
                  <div className="category-bar">
                    <div
                      className="category-bar-fill"
                      style={{
                        width: "93.88%",
                        backgroundColor: "#4338ca",
                      }}
                    ></div>
                  </div>
                  <div className="category-percentage">93.88%</div>
                </div>
              </div>

              <div className="category-item">
                <div className="category-icon">🏋️</div>
                <div className="category-details">
                  <div className="category-name">Health & Fitness</div>
                  <div className="category-bar">
                    <div
                      className="category-bar-fill"
                      style={{
                        width: "2.04%",
                        backgroundColor: "#38bdf8",
                      }}
                    ></div>
                  </div>
                  <div className="category-percentage">2.04%</div>
                </div>
              </div>

              <div className="category-item">
                <div className="category-icon">⚽</div>
                <div className="category-details">
                  <div className="category-name">Sports</div>
                  <div className="category-bar">
                    <div
                      className="category-bar-fill"
                      style={{
                        width: "2.04%",
                        backgroundColor: "#fb7185",
                      }}
                    ></div>
                  </div>
                  <div className="category-percentage">2.04%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="section-divider"></div>
      <div className="content-section-full">
        <h2>CONTENT</h2>
        <p>Content analysis and statistics will be displayed here.</p>
        <div className="placeholder-chart"></div>
      </div>

      {/* Audience Section */}
      <div className="section-divider"></div>
      <div className="audience-section">
        <h2>AUDIENCE</h2>
        <p>Audience demographics and insights will be displayed here.</p>
        <div className="placeholder-demographics"></div>
      </div>

      {/* Growth Section */}
      <div className="section-divider"></div>
      <div className="growth-section">
        <h2>GROWTH</h2>
        <p>Growth metrics and trends will be displayed here.</p>
        <div className="placeholder-growth-chart"></div>
      </div>

      {/* Brands Section */}
      <div className="section-divider"></div>
      <div className="brands-section">
        <h2>BRANDS</h2>
        <p>Brand collaborations and partnerships will be displayed here.</p>
        <div className="brand-collaborations">
          <div className="brand-card">Brand 1</div>
          <div className="brand-card">Brand 2</div>
          <div className="brand-card">Brand 3</div>
        </div>
      </div>

      {/* Download PDF & Instagram Profile Links */}
      <div className="section-divider"></div>
      <div className="action-links">
        <div className="action-link">
          <button className="download-pdf-button">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 16L12 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 13L12 16L15 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 16V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Download PDF
          </button>
        </div>
        <div className="action-link">
          <a
            href={`https://instagram.com/${profileData.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-link"
          >
            <FaInstagram size={16} />
            Go To Instagram Profile
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
