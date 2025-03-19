"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./FeatureShowcase.module.scss";

const features = [
  {
    id: 1,
    title: "Link Clicks Tracking",
    description:
      "Introducing a new feature! Generate a unique Brand Link to seamlessly track your influencers' performance across campaigns.",
    badge: "NEW FEATURE",
  },
  {
    id: 2,
    title: "Competitor Analysis",
    description:
      "Uncover key insights into competitor performance, top influencers, content trends, share of voice, and industry benchmarks.",
    badge: "NEW FEATURE",
  },
  {
    id: 3,
    title: "Advanced Filters",
    description:
      "Find the perfect influencers faster with advanced filters like Follower Growth, Keywords, Contact Availability, and more.",
    badge: "NEW FEATURE",
  },
  {
    id: 4,
    title: "Consolidated Reports",
    description:
      "Combine reports, identify top-performing campaigns, and assess their overall impact - all in a single, streamlined report.",
    badge: "NEW FEATURE",
  },
];

const FeatureShowcase = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index) => {
    setActiveFeature(index);
  };

  return (
    <div className={styles.showcaseContainer}>
      <div className={styles.headerContent}>
        <h2 className={styles.mainTitle}>While You Were Away</h2>
        <p className={styles.mainDescription}>
          Catch Up on the Latest with Epigroww Global
        </p>
      </div>

      <div className={styles.featureContent}>
        {features[activeFeature].badge && (
          <div className={styles.featureBadge}>
            {features[activeFeature].badge}
          </div>
        )}
        <h2 className={styles.featureTitle}>{features[activeFeature].title}</h2>
        <p className={styles.featureDescription}>
          {features[activeFeature].description}
        </p>
      </div>

      <div className={styles.featureImage}>
        {activeFeature === 0 && (
          <div className={styles.linkTrackingPreview}>
            <div className={styles.trackingCard}>
              <div className={styles.trackingHeader}>
                <span>Taste the Lightning - Campaign 2024</span>
              </div>
              <div className={styles.trackingContent}>
                <div className={styles.influencerTable}>
                  <div className={styles.tableRow}>
                    <div className={styles.profileCell}>
                      <div className={styles.avatar}></div>
                      <div className={styles.profileInfo}>
                        <div className={styles.name}>John Doe</div>
                        <div className={styles.handle}>@johndoe</div>
                      </div>
                    </div>
                    <div className={styles.costCell}>₹ 162.5k</div>
                    <div className={styles.linkCell}>
                      <div className={styles.linkButton}>Add Brand Link</div>
                    </div>
                    <div className={styles.statsCell}>127.4k</div>
                  </div>
                  <div className={styles.tableRow}>
                    <div className={styles.profileCell}>
                      <div className={styles.avatar}></div>
                      <div className={styles.profileInfo}>
                        <div className={styles.name}>John Doe</div>
                        <div className={styles.handle}>@johndoe</div>
                      </div>
                    </div>
                    <div className={styles.costCell}>₹ 162.5</div>
                    <div className={styles.linkCell}>
                      <div className={styles.generatedLink}>
                        qor.uz/sndkjvn9r
                      </div>
                    </div>
                    <div className={styles.statsCell}>38.7k</div>
                  </div>
                </div>
                <div className={styles.statsPopup}>
                  <div className={styles.popupTitle}>Click Statistics</div>
                  <div className={styles.popupContent}>
                    <div className={styles.clickChart}></div>
                    <div className={styles.totalClicks}>
                      <div className={styles.totalLabel}>Total Clicks</div>
                      <div className={styles.totalValue}>4,192</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeFeature === 1 && (
          <div className={styles.competitorPreview}>
            <div className={styles.competitorCard}>
              <div className={styles.competitorHeader}>
                <span>Beverages India Comparison</span>
              </div>
              <div className={styles.competitorContent}>
                <div className={styles.tabsSection}>
                  <div className={`${styles.competitorTab} ${styles.active}`}>
                    Dashboard
                  </div>
                  <div className={styles.competitorTab}>Influencers</div>
                  <div className={styles.competitorTab}>Content</div>
                  <div className={styles.competitorTab}>Settings</div>
                </div>
                <div className={styles.chartSection}>
                  <div className={styles.chartContainer}>
                    <div className={styles.competitorChart}></div>
                  </div>
                </div>
                <div className={styles.overlapPopup}>
                  <div className={styles.overlapTitle}>Influencer Overlap</div>
                  <div className={styles.overlapContent}>
                    <div className={styles.overlapChart}></div>
                    <div className={styles.overlapStats}>
                      <div className={styles.overlapStat}>
                        <div className={styles.statIndicator}></div>
                        <div className={styles.statValue}>248</div>
                      </div>
                      <div className={styles.overlapStat}>
                        <div className={styles.statIndicator}></div>
                        <div className={styles.statValue}>41</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeFeature === 2 && (
          <div className={styles.filtersPreview}>
            {/* Main filter dialog */}
            <div className={`${styles.filterCard} ${styles.mainFilterCard}`}>
              <div className={styles.allFiltersHeader}>
                <span>All Filters</span>
              </div>
              <div className={styles.filtersListContainer}>
                <div className={styles.filterItem}>
                  <span>Clear Any Selected</span>
                </div>
                <div className={styles.filterItem}>
                  <div className={styles.filterName}>Content Availability</div>
                </div>
                <div className={styles.filterItem}>
                  <div className={styles.filterName}>Audience Credibility</div>
                </div>
                <div className={styles.filterItem}>
                  <div className={styles.filterName}>Audience Gender</div>
                </div>
                <div className={styles.filterItem}>
                  <div className={styles.filterName}>Audience Location</div>
                </div>
                <div className={styles.filterItem}>
                  <div className={styles.filterName}>Audience Age Range</div>
                </div>
                <div className={styles.filterItem}>
                  <div className={styles.filterName}>
                    Average Follower Growth
                  </div>
                </div>
                <div className={styles.filterItem}>
                  <div className={styles.filterName}>Engagement Rate</div>
                </div>
                <div className={styles.filterItem}>
                  <div className={styles.filterName}>Average Image Likes</div>
                </div>
              </div>
            </div>

            {/* Gender filter card */}
            <div className={`${styles.filterCard} ${styles.genderFilterCard}`}>
              <div className={styles.filterHeader}>
                <span>Audience Gender</span>
              </div>
              <div className={styles.filterOptions}>
                <div className={styles.filterOption}>Male</div>
                <div className={`${styles.filterOption} ${styles.selected}`}>
                  Female
                </div>
              </div>
            </div>

            {/* Additional filter card for richer UI */}
            <div
              className={`${styles.filterCard} ${styles.additionalFilterCard}`}
            >
              <div className={styles.filterHeader}>
                <span>Content Availability</span>
              </div>
              <div className={styles.toggleFilters}>
                <div className={styles.toggleItem}>
                  <span>Faster Responses</span>
                  <div
                    className={`${styles.toggleSwitch} ${styles.active}`}
                  ></div>
                </div>
                <div className={styles.toggleItem}>
                  <span>Instagram Verified</span>
                  <div
                    className={`${styles.toggleSwitch} ${styles.active}`}
                  ></div>
                </div>
                <div className={styles.toggleItem}>
                  <span>Has YouTube</span>
                  <div
                    className={`${styles.toggleSwitch} ${styles.active}`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeFeature === 3 && (
          <div className={styles.reportsPreview}>
            <div className={styles.reportCard}>
              <div className={styles.reportHeader}>
                <span>Consolidated Report</span>
              </div>
              <div className={styles.reportContent}>
                <div className={styles.reportTabs}>
                  <div className={`${styles.reportTab} ${styles.active}`}>
                    Dashboard
                  </div>
                  <div className={styles.reportTab}>Influencers</div>
                  <div className={styles.reportTab}>Content</div>
                  <div className={styles.reportTab}>Settings</div>
                </div>

                <div className={styles.reportStats}>
                  <div className={styles.statBox}>
                    <div className={styles.statLabel}>Total Campaigns</div>
                    <div className={styles.statValue}>4</div>
                  </div>
                  <div className={styles.statBox}>
                    <div className={styles.statLabel}>Total Influencers</div>
                    <div className={styles.statValue}>27</div>
                  </div>
                  <div className={styles.statBox}>
                    <div className={styles.statLabel}>Total Posts</div>
                    <div className={styles.statValue}>139</div>
                  </div>
                  <div className={styles.statBox}>
                    <div className={styles.statLabel}>Total Reach</div>
                    <div className={styles.statValue}>9.71m</div>
                  </div>
                </div>

                <div className={styles.chartSection}>
                  <div className={styles.chartTitle}>Posts Timeline</div>
                  <div className={styles.chart}>
                    <div className={styles.chartLine}></div>
                    <div className={styles.chartTooltip}>
                      <div className={styles.tooltipValue}>73 Posts</div>
                      <div className={styles.tooltipDate}>04 July, 2024</div>
                    </div>
                  </div>
                </div>

                <div className={styles.influencerSection}>
                  <div className={styles.influencerTitle}>Top Influencers</div>
                  <div className={styles.influencerCard}>
                    <div className={styles.influencerAvatar}></div>
                    <div className={styles.influencerInfo}>
                      <div className={styles.influencerName}>Vaishnavi Rao</div>
                      <div className={styles.influencerHandle}>
                        @travelwithvaishnavi
                      </div>
                      <div className={styles.influencerStats}>
                        <div className={styles.influencerStat}>
                          <div className={styles.statCount}>437k</div>
                          <div className={styles.statType}>Followers</div>
                        </div>
                        <div className={styles.influencerStat}>
                          <div className={styles.statCount}>04</div>
                          <div className={styles.statType}>Posts</div>
                        </div>
                        <div className={styles.influencerStat}>
                          <div className={styles.statCount}>20.46k</div>
                          <div className={styles.statType}>Engagements</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.dotNavigation}>
        {features.map((_, index) => (
          <div
            key={index}
            className={`${styles.dot} ${
              index === activeFeature ? styles.active : ""
            }`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureShowcase;
