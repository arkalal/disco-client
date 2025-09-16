"use client";

import React from "react";
import { getBadgeStatus, formatNumber } from "../../utils/influencerComparisonHelpers";
import "./MetricsSection.scss";

// Badge component for metric ratings
const Badge = ({ status, label, className }) => {
  if (!label) return null;
  
  return (
    <span className={`metric-badge ${status || ''} ${className || ''}`}>
      {label}
    </span>
  );
};

// Component for displaying insights with color-coded icons
const InsightChip = ({ insight }) => {
  const iconType = insight.type === 'positive' ? '✓' : 
                 insight.type === 'negative' ? '✗' : '•';
  
  return (
    <div className={`insight-chip ${insight.type}`}>
      <span className="insight-icon">{iconType}</span>
      <span className="insight-text">{insight.text}</span>
    </div>
  );
};

// Component for content category chips
const CategoryChip = ({ category }) => {
  return (
    <div className="category-chip">
      <span className="category-icon">{category.icon}</span>
      <span className="category-text">{category.name}</span>
      <span className="category-percentage">({category.percentage})</span>
    </div>
  );
};

// Location item component for audience section
const LocationItem = ({ name, percent }) => {
  return (
    <div className="location-item">
      <span className="location-name">{name}</span>
      <span className="location-percentage">({percent}%)</span>
    </div>
  );
};

// Main metrics section component
const MetricsSection = ({ 
  sectionType, 
  title, 
  icon, 
  influencersData, 
  isOpen,
  loading
}) => {
  // Format a value for display based on its type
  const formatValue = (value, type) => {
    if (value === undefined || value === null) return '-';
    
    if (typeof value === 'number') {
      if (type === 'percentage') {
        return `${value.toFixed(2)}%`;
      }
      return formatNumber(value);
    }
    
    return value;
  };
  
  // Format percentage values with proper decimal precision
  const formatPercentage = (value) => {
    if (value === undefined || value === null) return '-';
    
    // If it's a string that contains a percentage sign
    if (typeof value === 'string' && value.includes('%')) {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return value;
      return `${numValue.toFixed(2)}%`;
    }
    
    // If it's a number, format it
    if (typeof value === 'number') {
      return `${value.toFixed(2)}%`;
    }
    
    return value;
  };
  
  // Render different section content based on section type
  const renderSectionContent = () => {
    switch (sectionType) {
      case 'overview':
        return (
          <div className="metrics-content">
            {/* Followers Row */}
            <div className="metric-row">
              <div className="metric-label">Followers</div>
              {influencersData.map((influencer, index) => (
                <div key={index} className="metric-value">
                  {loading ? (
                    <div className="skeleton-metric"></div>
                  ) : influencer ? (
                    formatValue(influencer.followers)
                  ) : (
                    '-'
                  )}
                </div>
              ))}
            </div>
            
            {/* Engagement Rate Row */}
            <div className="metric-row">
              <div className="metric-label">Engagement Rate</div>
              {influencersData.map((influencer, index) => (
                <div key={index} className="metric-value">
                  {loading ? (
                    <div className="skeleton-metric"></div>
                  ) : influencer ? (
                    <>
                      {influencer.engagementRate}
                      <Badge 
                        status={getBadgeStatus(influencer.engagementRate, 'engagementRate').class} 
                        label={getBadgeStatus(influencer.engagementRate, 'engagementRate').label}
                      />
                    </>
                  ) : (
                    '-'
                  )}
                </div>
              ))}
            </div>
            
            {/* Estimated Reach Row */}
            <div className="metric-row">
              <div className="metric-label">Estimated Reach</div>
              {influencersData.map((influencer, index) => (
                <div key={index} className="metric-value">
                  {loading ? (
                    <div className="skeleton-metric"></div>
                  ) : influencer ? (
                    formatValue(influencer.estimatedReach)
                  ) : (
                    '-'
                  )}
                </div>
              ))}
            </div>
            
            {/* Influence Score Row */}
            <div className="metric-row">
              <div className="metric-label">Influence Score</div>
              {influencersData.map((influencer, index) => (
                <div key={index} className="metric-value">
                  {loading ? (
                    <div className="skeleton-metric"></div>
                  ) : influencer ? (
                    <>
                      <span className="influence-score">{influencer.influenceScore}</span>
                      <Badge 
                        status={getBadgeStatus(influencer.influenceScore, 'influenceScore').class} 
                        label={getBadgeStatus(influencer.influenceScore, 'influenceScore').label}
                      />
                    </>
                  ) : (
                    '-'
                  )}
                </div>
              ))}
            </div>
            
            {/* Insights Row */}
            <div className="metric-row insights-row">
              <div className="metric-label">Insights</div>
              {influencersData.map((influencer, index) => (
                <div key={index} className="metric-value insights-list">
                  {loading ? (
                    <div className="skeleton-metric"></div>
                  ) : influencer && influencer.insights ? (
                    influencer.insights.map((insight, i) => (
                      <InsightChip key={i} insight={insight} />
                    ))
                  ) : (
                    '-'
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'engagements':
        return (
          <div className="metrics-content">
            {/* Images Subsection */}
            <div className="metrics-subsection">
              <h4 className="subsection-title">
                <span className="subsection-icon">🖼️</span> Images
              </h4>
              
              {/* Avg. Likes Row */}
              <div className="metric-row">
                <div className="metric-label">Avg. Likes</div>
                {influencersData.map((influencer, index) => (
                  <div key={index} className="metric-value">
                    {loading ? (
                      <div className="skeleton-metric"></div>
                    ) : influencer && influencer.engagement?.images ? (
                      formatValue(influencer.engagement.images.avgLikes)
                    ) : (
                      '-'
                    )}
                  </div>
                ))}
              </div>
              
              {/* Avg. Comments Row */}
              <div className="metric-row">
                <div className="metric-label">Avg. Comments</div>
                {influencersData.map((influencer, index) => (
                  <div key={index} className="metric-value">
                    {loading ? (
                      <div className="skeleton-metric"></div>
                    ) : influencer && influencer.engagement?.images ? (
                      formatValue(influencer.engagement.images.avgComments)
                    ) : (
                      '-'
                    )}
                  </div>
                ))}
              </div>
              
              {/* Engagement Rate Row */}
              <div className="metric-row">
                <div className="metric-label">Engagement Rate</div>
                {influencersData.map((influencer, index) => (
                  <div key={index} className="metric-value">
                    {loading ? (
                      <div className="skeleton-metric"></div>
                    ) : influencer && influencer.engagement?.images ? (
                      formatValue(influencer.engagement.images.engagementRate, 'percentage')
                    ) : (
                      '-'
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Reels Subsection */}
            <div className="metrics-subsection">
              <h4 className="subsection-title">
                <span className="subsection-icon">📹</span> Reels
              </h4>
              
              {/* Avg. Views Row */}
              <div className="metric-row">
                <div className="metric-label">Avg. Views</div>
                {influencersData.map((influencer, index) => (
                  <div key={index} className="metric-value">
                    {loading ? (
                      <div className="skeleton-metric"></div>
                    ) : influencer && influencer.engagement?.reels ? (
                      formatValue(influencer.engagement.reels.avgViews)
                    ) : (
                      '-'
                    )}
                  </div>
                ))}
              </div>
              
              {/* Avg. Likes Row */}
              <div className="metric-row">
                <div className="metric-label">Avg. Likes</div>
                {influencersData.map((influencer, index) => (
                  <div key={index} className="metric-value">
                    {loading ? (
                      <div className="skeleton-metric"></div>
                    ) : influencer && influencer.engagement?.reels ? (
                      formatValue(influencer.engagement.reels.avgLikes)
                    ) : (
                      '-'
                    )}
                  </div>
                ))}
              </div>
              
              {/* Avg. Comments Row */}
              <div className="metric-row">
                <div className="metric-label">Avg. Comments</div>
                {influencersData.map((influencer, index) => (
                  <div key={index} className="metric-value">
                    {loading ? (
                      <div className="skeleton-metric"></div>
                    ) : influencer && influencer.engagement?.reels ? (
                      formatValue(influencer.engagement.reels.avgComments)
                    ) : (
                      '-'
                    )}
                  </div>
                ))}
              </div>
              
              {/* Engagement Rate Row */}
              <div className="metric-row">
                <div className="metric-label">Engagement Rate</div>
                {influencersData.map((influencer, index) => (
                  <div key={index} className="metric-value">
                    {loading ? (
                      <div className="skeleton-metric"></div>
                    ) : influencer && influencer.engagement?.reels ? (
                      formatValue(influencer.engagement.reels.engagementRate, 'percentage')
                    ) : (
                      '-'
                    )}
                  </div>
                ))}
              </div>
              
              {/* View Rate Row */}
              <div className="metric-row">
                <div className="metric-label">View Rate</div>
                {influencersData.map((influencer, index) => (
                  <div key={index} className="metric-value">
                    {loading ? (
                      <div className="skeleton-metric"></div>
                    ) : influencer && influencer.engagement?.reels ? (
                      formatValue(influencer.engagement.reels.viewRate, 'percentage')
                    ) : (
                      '-'
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Additional Metrics */}
            <div className="metrics-subsection">
              {/* Likes - Comments Ratio Row */}
              <div className="metric-row">
                <div className="metric-label">Likes - Comments Ratio</div>
                {influencersData.map((influencer, index) => (
                  <div key={index} className="metric-value">
                    {loading ? (
                      <div className="skeleton-metric"></div>
                    ) : influencer && influencer.engagement?.ratios ? (
                      <>
                        {formatValue(influencer.engagement.ratios.likesCommentsRatio, 'decimal')}
                        <Badge 
                          status={getBadgeStatus(influencer.engagement.ratios.likesCommentsRatio, 'likesCommentsRatio').class} 
                          label={getBadgeStatus(influencer.engagement.ratios.likesCommentsRatio, 'likesCommentsRatio').label}
                        />
                      </>
                    ) : (
                      '-'
                    )}
                  </div>
                ))}
              </div>
              
              {/* Reel Views To Followers Ratio Row */}
              <div className="metric-row">
                <div className="metric-label">Reel Views To Followers Ratio</div>
                {influencersData.map((influencer, index) => (
                  <div key={index} className="metric-value">
                    {loading ? (
                      <div className="skeleton-metric"></div>
                    ) : influencer && influencer.engagement?.ratios ? (
                      <>
                        {formatValue(influencer.engagement.ratios.reelViewsToFollowersRatio, 'decimal')}
                        <Badge 
                          status={getBadgeStatus(influencer.engagement.ratios.reelViewsToFollowersRatio, 'reelViewsToFollowersRatio').class} 
                          label={getBadgeStatus(influencer.engagement.ratios.reelViewsToFollowersRatio, 'reelViewsToFollowersRatio').label}
                        />
                      </>
                    ) : (
                      '-'
                    )}
                  </div>
                ))}
              </div>
              
              {/* Post Frequency Row */}
              <div className="metric-row">
                <div className="metric-label">Post Frequency</div>
                {influencersData.map((influencer, index) => (
                  <div key={index} className="metric-value">
                    {loading ? (
                      <div className="skeleton-metric"></div>
                    ) : influencer && influencer.engagement?.ratios ? (
                      <>
                        {influencer.engagement.ratios.postFrequency}
                        <Badge 
                          status={getBadgeStatus(influencer.engagement.ratios.postFrequency, 'postFrequency').class} 
                          label={getBadgeStatus(influencer.engagement.ratios.postFrequency, 'postFrequency').label}
                        />
                      </>
                    ) : (
                      '-'
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'paidPartnerships':
        return (
          <div className="metrics-content">
            {/* Images Subsection */}
            <div className="metrics-subsection">
              <h4 className="subsection-title">
                <span className="subsection-icon">🖼️</span> Images
              </h4>
              
              {/* Avg. Likes Row */}
              <div className="metric-row">
                <div className="metric-label">Avg. Likes</div>
                {influencersData.map((influencer, index) => (
                  <div key={index} className="metric-value">
                    {loading ? (
                      <div className="skeleton-metric"></div>
                    ) : influencer && influencer.paidPartnerships?.images ? (
                      formatValue(influencer.paidPartnerships.images.avgLikes)
                    ) : (
                      '-'
                    )}
                  </div>
                ))}
              </div>
              
              {/* Avg. Comments Row */}
              <div className="metric-row">
                <div className="metric-label">Avg. Comments</div>
                {influencersData.map((influencer, index) => (
                  <div key={index} className="metric-value">
                    {loading ? (
                      <div className="skeleton-metric"></div>
                    ) : influencer && influencer.paidPartnerships?.images ? (
                      formatValue(influencer.paidPartnerships.images.avgComments)
                    ) : (
                      '-'
                    )}
                  </div>
                ))}
              </div>
              
              {/* Engagement Rate Row */}
              <div className="metric-row">
                <div className="metric-label">Engagement Rate</div>
                {influencersData.map((influencer, index) => (
                  <div key={index} className="metric-value">
                    {loading ? (
                      <div className="skeleton-metric"></div>
                    ) : influencer && influencer.paidPartnerships?.images ? (
                      formatValue(influencer.paidPartnerships.images.engagementRate, 'percentage')
                    ) : (
                      '-'
                    )}
                  </div>
                ))}
              </div>
              
              {/* Images Count Row */}
              <div className="metric-row">
                <div className="metric-label">Images Count</div>
                {influencersData.map((influencer, index) => (
                  <div key={index} className="metric-value">
                    {loading ? (
                      <div className="skeleton-metric"></div>
                    ) : influencer && influencer.paidPartnerships?.images ? (
                      formatValue(influencer.paidPartnerships.images.count)
                    ) : (
                      '-'
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Reels Subsection */}
            <div className="metrics-subsection">
              <h4 className="subsection-title">
                <span className="subsection-icon">📹</span> Reels
              </h4>
              
              {/* Avg. Views Row */}
              <div className="metric-row">
                <div className="metric-label">Avg. Views</div>
                {influencersData.map((influencer, index) => (
                  <div key={index} className="metric-value">
                    {loading ? (
                      <div className="skeleton-metric"></div>
                    ) : influencer && influencer.paidPartnerships?.reels ? (
                      formatValue(influencer.paidPartnerships.reels.avgViews)
                    ) : (
                      '-'
                    )}
                  </div>
                ))}
              </div>
              
              {/* Avg. Likes Row */}
              <div className="metric-row">
                <div className="metric-label">Avg. Likes</div>
                {influencersData.map((influencer, index) => (
                  <div key={index} className="metric-value">
                    {loading ? (
                      <div className="skeleton-metric"></div>
                    ) : influencer && influencer.paidPartnerships?.reels ? (
                      formatValue(influencer.paidPartnerships.reels.avgLikes)
                    ) : (
                      '-'
                    )}
                  </div>
                ))}
              </div>
              
              {/* Avg. Comments Row */}
              <div className="metric-row">
                <div className="metric-label">Avg. Comments</div>
                {influencersData.map((influencer, index) => (
                  <div key={index} className="metric-value">
                    {loading ? (
                      <div className="skeleton-metric"></div>
                    ) : influencer && influencer.paidPartnerships?.reels ? (
                      formatValue(influencer.paidPartnerships.reels.avgComments)
                    ) : (
                      '-'
                    )}
                  </div>
                ))}
              </div>
              
              {/* Total Reels Row */}
              <div className="metric-row">
                <div className="metric-label">Total Reels</div>
                {influencersData.map((influencer, index) => (
                  <div key={index} className="metric-value">
                    {loading ? (
                      <div className="skeleton-metric"></div>
                    ) : influencer && influencer.paidPartnerships?.reels ? (
                      formatValue(influencer.paidPartnerships.reels.count)
                    ) : (
                      '-'
                    )}
                  </div>
                ))}
              </div>
              
              {/* Engagement Rate Row */}
              <div className="metric-row">
                <div className="metric-label">Engagement Rate</div>
                {influencersData.map((influencer, index) => (
                  <div key={index} className="metric-value">
                    {loading ? (
                      <div className="skeleton-metric"></div>
                    ) : influencer && influencer.paidPartnerships?.reels ? (
                      formatValue(influencer.paidPartnerships.reels.engagementRate, 'percentage')
                    ) : (
                      '-'
                    )}
                  </div>
                ))}
              </div>
              
              {/* View Rate Row */}
              <div className="metric-row">
                <div className="metric-label">View Rate</div>
                {influencersData.map((influencer, index) => (
                  <div key={index} className="metric-value">
                    {loading ? (
                      <div className="skeleton-metric"></div>
                    ) : influencer && influencer.paidPartnerships?.reels ? (
                      formatValue(influencer.paidPartnerships.reels.viewRate, 'percentage')
                    ) : (
                      '-'
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'content':
        return (
          <div className="metrics-content">
            {/* Content Categories Row */}
            <div className="metric-row">
              <div className="metric-label">Content Categories</div>
              {influencersData.map((influencer, index) => (
                <div key={index} className="metric-value category-list">
                  {loading ? (
                    <div className="skeleton-metric"></div>
                  ) : influencer && influencer.contentCategories ? (
                    influencer.contentCategories.map((category, i) => (
                      <CategoryChip key={i} category={category} />
                    ))
                  ) : (
                    '-'
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'audience':
        return (
          <div className="metrics-content">
            {/* Top Cities Subsection */}
            <div className="metrics-subsection">
              <h4 className="subsection-title">Top Cities</h4>
              <div className="audience-table">
                <div className="audience-row header">
                  {influencersData.map((influencer, index) => (
                    <div key={index} className="audience-cell">
                      {influencer ? influencer.name || '-' : '-'}
                    </div>
                  ))}
                </div>
                
                {/* Create 5 rows for cities */}
                {Array.from({ length: 5 }, (_, rowIndex) => (
                  <div key={`city-row-${rowIndex}`} className="audience-row">
                    {influencersData.map((influencer, colIndex) => {
                      const city = influencer?.audience?.cities?.[rowIndex];
                      return (
                        <div key={colIndex} className="audience-cell">
                          {loading ? (
                            <div className="skeleton-metric"></div>
                          ) : city ? (
                            <>
                              <span className="location-name">{city.name}</span>
                              <span className="location-percentage">({formatPercentage(city.percent)})</span>
                            </>
                          ) : (
                            '-'
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Top States Subsection */}
            <div className="metrics-subsection">
              <h4 className="subsection-title">Top States</h4>
              <div className="audience-table">
                <div className="audience-row header">
                  {influencersData.map((influencer, index) => (
                    <div key={index} className="audience-cell">
                      {influencer ? influencer.name || '-' : '-'}
                    </div>
                  ))}
                </div>
                
                {/* Create 5 rows for states */}
                {Array.from({ length: 5 }, (_, rowIndex) => (
                  <div key={`state-row-${rowIndex}`} className="audience-row">
                    {influencersData.map((influencer, colIndex) => {
                      const state = influencer?.audience?.states?.[rowIndex];
                      return (
                        <div key={colIndex} className="audience-cell">
                          {loading ? (
                            <div className="skeleton-metric"></div>
                          ) : state ? (
                            <>
                              <span className="location-name">{state.name}</span>
                              <span className="location-percentage">({formatPercentage(state.percent)})</span>
                            </>
                          ) : (
                            '-'
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Audience Credibility Row */}
            <div className="metrics-subsection credibility-section">
              <h4 className="subsection-title">
                Audience Credibility
                <span className="info-icon">ⓘ</span>
              </h4>
              <div className="audience-table">
                <div className="audience-row">
                  {influencersData.map((influencer, index) => (
                    <div key={index} className="audience-cell credibility-value">
                      {loading ? (
                        <div className="skeleton-metric"></div>
                      ) : influencer && influencer.audience?.credibility ? (
                        formatPercentage(influencer.audience.credibility)
                      ) : (
                        '-'
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Top Countries Subsection */}
            <div className="metrics-subsection">
              <h4 className="subsection-title">Top Countries</h4>
              <div className="audience-table">
                <div className="audience-row header">
                  {influencersData.map((influencer, index) => (
                    <div key={index} className="audience-cell">
                      {influencer ? influencer.name || '-' : '-'}
                    </div>
                  ))}
                </div>
                
                {/* Create 5 rows for countries */}
                {Array.from({ length: 5 }, (_, rowIndex) => (
                  <div key={`country-row-${rowIndex}`} className="audience-row">
                    {influencersData.map((influencer, colIndex) => {
                      const country = influencer?.audience?.countries?.[rowIndex];
                      return (
                        <div key={colIndex} className="audience-cell">
                          {loading ? (
                            <div className="skeleton-metric"></div>
                          ) : country ? (
                            <>
                              <span className="location-name">{country.name}</span>
                              <span className="location-percentage">({formatPercentage(country.percent)})</span>
                            </>
                          ) : (
                            '-'
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Audience Gender Subsection */}
            <div className="metrics-subsection">
              <h4 className="subsection-title">Audience Gender</h4>
              <div className="audience-gender-grid">
                <div className="gender-row header">
                  <div className="gender-cell label">Male</div>
                  {influencersData.map((influencer, index) => (
                    <div key={index} className="gender-cell">
                      {loading ? (
                        <div className="skeleton-metric"></div>
                      ) : influencer && influencer.audience?.gender?.m ? (
                        formatPercentage(influencer.audience.gender.m * 100)
                      ) : (
                        '-'
                      )}
                    </div>
                  ))}
                </div>
                <div className="gender-row">
                  <div className="gender-cell label">Female</div>
                  {influencersData.map((influencer, index) => (
                    <div key={index} className="gender-cell">
                      {loading ? (
                        <div className="skeleton-metric"></div>
                      ) : influencer && influencer.audience?.gender?.f ? (
                        formatPercentage(influencer.audience.gender.f * 100)
                      ) : (
                        '-'
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Audience Age Group Subsection */}
            <div className="metrics-subsection">
              <h4 className="subsection-title">Audience Age Group</h4>
              <div className="age-group-grid">
                {['13-17 years', '18-24 years', '25-34 years', '35-44 years', '45-64 years', '65+ years'].map((ageRange, ageIndex) => (
                  <div key={ageIndex} className="age-row">
                    <div className="age-cell label">{ageRange}</div>
                    {influencersData.map((influencer, index) => {
                      const ageKey = ageRange === '13-17 years' ? '0_18' :
                                    ageRange === '18-24 years' ? '18_24' :
                                    ageRange === '25-34 years' ? '25_34' :
                                    ageRange === '35-44 years' ? '35_44' :
                                    ageRange === '45-64 years' ? '45_100' : '45_100';
                      
                      const ageData = influencer?.audience?.ages?.find(a => a.category === ageKey);
                      const agePercent = ageData ? (ageData.m + ageData.f) * 100 : null;
                      
                      return (
                        <div key={index} className="age-cell">
                          {loading ? (
                            <div className="skeleton-metric"></div>
                          ) : agePercent !== null ? (
                            formatPercentage(agePercent)
                          ) : (
                            '-'
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return <div className="metrics-content">No metrics available</div>;
    }
  };

  return (
    <div className={`metrics-section ${sectionType} ${isOpen ? 'open' : ''}`}>
      <div className="section-header">
        <div className="section-title">
          {icon && <span className="section-icon">{icon}</span>}
          <h3>{title}</h3>
        </div>
      </div>
      {isOpen && renderSectionContent()}
    </div>
  );
};

export default MetricsSection;
