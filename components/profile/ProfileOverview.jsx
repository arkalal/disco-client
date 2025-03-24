"use client";

import React from "react";
import { FaInstagram } from "react-icons/fa";
import { RiHeartLine } from "react-icons/ri";
import { BsInfoCircle } from "react-icons/bs";
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

        {/* Top Cities, States, Countries, Gender, Age Group */}
        <div className="audience-top-locations">
          <div className="location-card">
            <div className="location-header">TOP CITY</div>
            <div className="location-name">Jakarta</div>
            <div className="location-stat">
              Audience from Jakarta is <span className="stat-value">13.6%</span>
            </div>
          </div>

          <div className="location-card">
            <div className="location-header">TOP STATE</div>
            <div className="location-name">Maharashtra</div>
            <div className="location-stat">
              Audience from Maharashtra is{" "}
              <span className="stat-value">20%</span>
            </div>
          </div>

          <div className="location-card">
            <div className="location-header">TOP COUNTRY</div>
            <div className="location-name">India</div>
            <div className="location-stat">
              Audience from India is <span className="stat-value">56.99%</span>
            </div>
          </div>

          <div className="location-card">
            <div className="location-header">
              AUDIENCE CREDIBILITY <span className="beta-tag">beta</span>
            </div>
            <div className="credibility-score">68.75 %</div>
          </div>

          <div className="location-card">
            <div className="location-header">TOP GENDER</div>
            <div className="location-name">Male</div>
            <div className="location-stat">
              Total male audience is <span className="stat-value">65.04%</span>
            </div>
          </div>

          <div className="location-card">
            <div className="location-header">TOP AGE GROUP</div>
            <div className="location-name">25-34 Years</div>
            <div className="location-stat">
              Total audience in this age group is{" "}
              <span className="stat-value">53.51%</span>
            </div>
          </div>
        </div>

        {/* Audience Geography */}
        <div className="audience-geography">
          <div className="section-header">
            <h3>
              AUDIENCE GEOGRAPHY <BsInfoCircle className="info-icon" />
            </h3>
            <div className="geography-tabs">
              <button className="tab active">Cities</button>
              <button className="tab">States</button>
              <button className="tab">Countries</button>
            </div>
          </div>

          <div className="geography-content">
            <div className="geography-item">
              <div className="geo-name">Jakarta</div>
              <div className="geo-bar-container">
                <div className="geo-bar" style={{ width: "13.6%" }}></div>
              </div>
              <div className="geo-percentage">13.6%</div>
            </div>

            <div className="geography-item">
              <div className="geo-name">Mumbai</div>
              <div className="geo-bar-container">
                <div className="geo-bar" style={{ width: "10.98%" }}></div>
              </div>
              <div className="geo-percentage">10.98%</div>
            </div>

            <div className="geography-item">
              <div className="geo-name">Kolkata</div>
              <div className="geo-bar-container">
                <div className="geo-bar" style={{ width: "7.87%" }}></div>
              </div>
              <div className="geo-percentage">7.87%</div>
            </div>

            <div className="geography-item">
              <div className="geo-name">Delhi</div>
              <div className="geo-bar-container">
                <div className="geo-bar" style={{ width: "6.01%" }}></div>
              </div>
              <div className="geo-percentage">6.01%</div>
            </div>

            <div className="geography-item">
              <div className="geo-name">Bandung</div>
              <div className="geo-bar-container">
                <div className="geo-bar" style={{ width: "4.87%" }}></div>
              </div>
              <div className="geo-percentage">4.87%</div>
            </div>

            <div className="geography-item">
              <div className="geo-name">Ahmedabad</div>
              <div className="geo-bar-container">
                <div className="geo-bar" style={{ width: "4.14%" }}></div>
              </div>
              <div className="geo-percentage">4.14%</div>
            </div>

            <div className="geography-item">
              <div className="geo-name">Pune</div>
              <div className="geo-bar-container">
                <div className="geo-bar" style={{ width: "3.73%" }}></div>
              </div>
              <div className="geo-percentage">3.73%</div>
            </div>

            <div className="geography-item">
              <div className="geo-name">Dhaka</div>
              <div className="geo-bar-container">
                <div className="geo-bar" style={{ width: "3.72%" }}></div>
              </div>
              <div className="geo-percentage">3.71999999999999998%</div>
            </div>
          </div>
        </div>

        {/* Age and Gender */}
        <div className="audience-demographics">
          <div className="audience-age">
            <div className="section-header">
              <h3>
                AUDIENCE AGE GROUP <BsInfoCircle className="info-icon" />
              </h3>
            </div>

            <div className="age-chart">
              <div className="chart-y-axis">
                <div className="y-label">50%</div>
                <div className="y-label">25%</div>
                <div className="y-label">0%</div>
              </div>

              <div className="age-bars">
                <div className="age-bar-container">
                  <div className="age-percentage">2.39%</div>
                  <div className="age-bar" style={{ height: "2.39%" }}></div>
                  <div className="age-label">13-17</div>
                </div>

                <div className="age-bar-container">
                  <div className="age-percentage">27.5%</div>
                  <div className="age-bar" style={{ height: "27.5%" }}></div>
                  <div className="age-label">18-24</div>
                </div>

                <div className="age-bar-container">
                  <div className="age-percentage">53.51%</div>
                  <div className="age-bar" style={{ height: "53.51%" }}></div>
                  <div className="age-label">25-34</div>
                </div>

                <div className="age-bar-container">
                  <div className="age-percentage">13.77%</div>
                  <div className="age-bar" style={{ height: "13.77%" }}></div>
                  <div className="age-label">35-44</div>
                </div>

                <div className="age-bar-container">
                  <div className="age-percentage">2.82%</div>
                  <div className="age-bar" style={{ height: "2.82%" }}></div>
                  <div className="age-label">45-64</div>
                </div>

                <div className="age-bar-container">
                  <div className="age-percentage">0.02%</div>
                  <div className="age-bar" style={{ height: "0.02%" }}></div>
                  <div className="age-label">65+</div>
                </div>
              </div>
            </div>
          </div>

          <div className="audience-gender">
            <div className="section-header">
              <h3>
                AUDIENCE GENDER <BsInfoCircle className="info-icon" />
              </h3>
            </div>

            <div className="gender-legends">
              <div className="gender-legend female">
                <span className="color-dot"></span>
                <span className="gender-label">Female</span>
                <span className="gender-percentage">- 34.96%</span>
              </div>

              <div className="gender-legend male">
                <span className="color-dot"></span>
                <span className="gender-label">Male</span>
                <span className="gender-percentage">- 65.04%</span>
              </div>
            </div>

            <div className="gender-chart">
              <div className="chart-container">
                <div className="gender-donut">
                  <div className="donut-inner">
                    <div className="donut-value">65.04%</div>
                    <div className="donut-label">Male Audience</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audience Interests */}
        <div className="audience-interests">
          <div className="section-header">
            <h3>
              AUDIENCE INTEREST <BsInfoCircle className="info-icon" />
            </h3>
          </div>

          <div className="interests-content">
            <div className="interest-item">
              <div className="interest-name">
                Friends, Family & Relationships
              </div>
              <div className="interest-bar-container">
                <div className="interest-bar" style={{ width: "9.2%" }}></div>
              </div>
              <div className="interest-percentage">9.2%</div>
            </div>

            <div className="interest-item">
              <div className="interest-name">Restaurants, Food & Grocery</div>
              <div className="interest-bar-container">
                <div className="interest-bar" style={{ width: "5.53%" }}></div>
              </div>
              <div className="interest-percentage">5.53%</div>
            </div>

            <div className="interest-item">
              <div className="interest-name">
                Clothes, Shoes, Handbags & Accessories
              </div>
              <div className="interest-bar-container">
                <div className="interest-bar" style={{ width: "8.33%" }}></div>
              </div>
              <div className="interest-percentage">8.33%</div>
            </div>

            <div className="interest-item">
              <div className="interest-name">Travel, Tourism & Aviation</div>
              <div className="interest-bar-container">
                <div className="interest-bar" style={{ width: "5.2%" }}></div>
              </div>
              <div className="interest-percentage">5.2%</div>
            </div>

            <div className="interest-item">
              <div className="interest-name">Camera & Photography</div>
              <div className="interest-bar-container">
                <div className="interest-bar" style={{ width: "8.22%" }}></div>
              </div>
              <div className="interest-percentage">8.22%</div>
            </div>

            <div className="interest-item">
              <div className="interest-name">Art & Design</div>
              <div className="interest-bar-container">
                <div className="interest-bar" style={{ width: "5.03%" }}></div>
              </div>
              <div className="interest-percentage">5.03%</div>
            </div>

            <div className="interest-item">
              <div className="interest-name">Television & Film</div>
              <div className="interest-bar-container">
                <div className="interest-bar" style={{ width: "6.38%" }}></div>
              </div>
              <div className="interest-percentage">6.38%</div>
            </div>

            <div className="interest-item">
              <div className="interest-name">Cars & Motorbikes</div>
              <div className="interest-bar-container">
                <div className="interest-bar" style={{ width: "4.62%" }}></div>
              </div>
              <div className="interest-percentage">4.62%</div>
            </div>

            <div className="interest-item">
              <div className="interest-name">Music</div>
              <div className="interest-bar-container">
                <div className="interest-bar" style={{ width: "6.02%" }}></div>
              </div>
              <div className="interest-percentage">6.02%</div>
            </div>

            <div className="interest-item">
              <div className="interest-name">Electronics & Computers</div>
              <div className="interest-bar-container">
                <div className="interest-bar" style={{ width: "4.23%" }}></div>
              </div>
              <div className="interest-percentage">4.23%</div>
            </div>
          </div>
        </div>

        {/* Audience Language */}
        <div className="audience-language">
          <div className="section-header">
            <h3>
              AUDIENCE LANGUAGE <BsInfoCircle className="info-icon" />
            </h3>
          </div>

          <div className="language-chart-container">
            <div className="language-donut-chart">
              <div className="language-donut">
                <div className="language-label">Audience Language</div>
              </div>
            </div>

            <div className="language-list">
              <div className="language-item">
                <span className="language-color english"></span>
                <span className="language-name">English</span>
                <span className="language-percentage">55%</span>
              </div>

              <div className="language-item">
                <span className="language-color hindi"></span>
                <span className="language-name">Hindi</span>
                <span className="language-percentage">2.88%</span>
              </div>

              <div className="language-item">
                <span className="language-color indonesian"></span>
                <span className="language-name">Indonesian</span>
                <span className="language-percentage">11.59%</span>
              </div>

              <div className="language-item">
                <span className="language-color spanish"></span>
                <span className="language-name">Spanish</span>
                <span className="language-percentage">1.71%</span>
              </div>

              <div className="language-item">
                <span className="language-color arabic"></span>
                <span className="language-name">Arabic</span>
                <span className="language-percentage">7.28%</span>
              </div>

              <div className="language-item">
                <span className="language-color urdu"></span>
                <span className="language-name">Urdu</span>
                <span className="language-percentage">1.71%</span>
              </div>

              <div className="language-item">
                <span className="language-color persian"></span>
                <span className="language-name">Persian</span>
                <span className="language-percentage">5.91%</span>
              </div>

              <div className="language-item">
                <span className="language-color nepali"></span>
                <span className="language-name">Nepali</span>
                <span className="language-percentage">1.55%</span>
              </div>

              <div className="language-item">
                <span className="language-color russian"></span>
                <span className="language-name">Russian</span>
                <span className="language-percentage">4.38%</span>
              </div>

              <div className="language-item">
                <span className="language-color bengali"></span>
                <span className="language-name">Bengali</span>
                <span className="language-percentage">1.32%</span>
              </div>
            </div>
          </div>
        </div>
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
