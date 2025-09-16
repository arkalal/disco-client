// Helper functions for the Influencer Comparison page

/**
 * Fetch profile data for a single influencer
 * @param {string} username - The username of the influencer
 * @returns {Promise} - Promise resolving to profile data
 */
export async function fetchInfluencerData(username) {
  try {
    const response = await fetch(`/api/instagram/${username}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${username}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching data for ${username}:`, error);
    throw error;
  }
}

/**
 * Format badge status based on value
 * @param {number|string} value - The metric value
 * @param {string} metricType - Type of metric for proper formatting
 * @returns {Object} - Badge status and class
 */
export function getBadgeStatus(value, metricType) {
  // Convert string percentage to number if needed
  let numValue = value;
  if (typeof value === 'string' && value.includes('%')) {
    numValue = parseFloat(value);
  }

  switch (metricType) {
    case 'engagementRate':
      if (numValue >= 3) return { label: 'Good', class: 'badge-good' };
      if (numValue >= 1.5) return { label: 'Average', class: 'badge-average' };
      return { label: 'Low', class: 'badge-low' };
    
    case 'influenceScore':
      if (numValue >= 8.5) return { label: 'Top 1%', class: 'badge-excellent' };
      if (numValue >= 7) return { label: 'Top 5%', class: 'badge-good' };
      if (numValue >= 6) return { label: 'Top 10%', class: 'badge-good' };
      return { label: 'Top 20%', class: 'badge-average' };
    
    case 'likesCommentsRatio':
      if (numValue >= 1) return { label: 'Good', class: 'badge-good' };
      if (numValue >= 0.5) return { label: 'Average', class: 'badge-average' };
      return { label: 'Low', class: 'badge-low' };
    
    case 'reelViewsFollowersRatio':
      if (numValue >= 20) return { label: 'Good', class: 'badge-good' };
      if (numValue >= 10) return { label: 'Average', class: 'badge-average' };
      return { label: 'Low', class: 'badge-low' };
    
    case 'postFrequency':
      if (numValue >= 5) return { label: 'Good', class: 'badge-good' };
      if (numValue >= 2) return { label: 'Average', class: 'badge-average' };
      return { label: 'Low', class: 'badge-low' };
    
    default:
      return { label: '', class: '' };
  }
}

/**
 * Get insights list with appropriate icons based on profile data
 * @param {Object} profileData - Profile data object
 * @returns {Array} - Array of insights with type, text and status
 */
export function generateInsights(profileData) {
  const insights = [];
  
  // Parse engagement rate from string (e.g., "1.33%") to number
  const engagementRate = parseFloat(profileData.engagementRate);
  const followersCount = profileData.followersCount || 0;
  
  // Engagement insights
  if (engagementRate >= 3) {
    insights.push({ type: 'positive', text: 'Highly engaging audience' });
  } else if (engagementRate >= 1.5) {
    insights.push({ type: 'average', text: 'Moderately engaging audience' });
  } else {
    insights.push({ type: 'negative', text: 'Low audience engagement' });
  }
  
  // Follower insights - this is just a demo logic
  if (followersCount > 500000) {
    insights.push({ type: 'positive', text: 'High follower growth' });
  } else if (followersCount <= 100000) {
    insights.push({ type: 'negative', text: 'Negative follower growth' });
  }
  
  // Content insights - these would normally come from analyzing content patterns
  insights.push({ type: 'positive', text: 'High reel viewership' });
  insights.push({ type: 'positive', text: 'High ability to drive comments' });
  insights.push({ type: 'positive', text: 'Posts at a healthy pace' });
  
  // Audience insights - normally derived from audience demographics
  insights.push({ type: 'positive', text: 'High Indian follower base' });
  
  return insights;
}

/**
 * Calculate engagement metrics for reels and posts
 * @param {Object} profileData - Profile data object
 * @returns {Object} - Object with calculated metrics
 */
export function calculateEngagementMetrics(profileData) {
  // Helper function to parse number values
  const parseMetric = (value) => {
    if (typeof value === 'string') {
      if (value.includes('k')) {
        return parseFloat(value) * 1000;
      }
      if (value.includes('m')) {
        return parseFloat(value) * 1000000;
      }
      return parseFloat(value);
    }
    return value || 0;
  };
  
  // Get base values
  const avgLikes = parseMetric(profileData.avgLikes);
  const avgComments = parseMetric(profileData.avgComments);
  const followers = parseMetric(profileData.followersCount);
  
  // For demo purposes, create some reel metrics if they don't exist
  const reelViews = followers * 0.5; // 50% of followers view reels (example)
  const reelLikes = reelViews * 0.08; // 8% like rate on views (example)
  const reelComments = reelLikes * 0.02; // 2% of likes leave comments (example)
  
  // Calculate ratios
  const likesCommentsRatio = avgLikes / (avgComments || 1);
  const reelViewsToFollowersRatio = (reelViews / followers) * 100;
  const postFrequency = 7; // Just a placeholder for demo
  
  return {
    images: {
      avgLikes,
      avgComments,
      engagementRate: ((avgLikes + avgComments) / followers) * 100,
    },
    reels: {
      avgViews: reelViews,
      avgLikes: reelLikes,
      avgComments: reelComments,
      engagementRate: ((reelLikes + reelComments) / reelViews) * 100,
      viewRate: (reelViews / followers) * 100,
    },
    ratios: {
      likesCommentsRatio,
      reelViewsToFollowersRatio,
      postFrequency,
    }
  };
}

/**
 * Process categories from profile data to format for display
 * @param {Object} profileData - Profile data object 
 * @returns {Array} - Array of category objects with icon, name, and percentage
 */
export function processContentCategories(profileData) {
  const categories = profileData.categories || [];
  const categoryIcons = {
    'Entertainment': '🎭',
    'Movies': '🎬',
    'Cinema': '🎬',
    'Arts & Entertainment': '🎭',
    'Movies - Arts & Entertainment': '🎬',
    'Sports': '⚽',
    'Cricket': '🏏',
    'Cricket - Sports': '🏏',
    'Fashion': '👗',
    'Beauty': '💄',
    'Business': '💼',
    'Finance': '💰',
    'Health & Fitness': '🏋️',
    'Food': '🍽️',
    'Travel': '✈️',
    'Technology': '💻',
    'Gaming': '🎮',
    'Music': '🎵',
    'Education': '📚',
    'Lifestyle': '✨',
  };

  // Create mock percentages for demo
  return categories.map((category, index) => {
    const basePercentage = 40 - (index * 8);
    const percentage = Math.max(basePercentage, 5).toFixed(2);
    
    // Find appropriate icon or use default
    let icon = '📊'; // Default icon
    for (const [key, value] of Object.entries(categoryIcons)) {
      if (category.toLowerCase().includes(key.toLowerCase())) {
        icon = value;
        break;
      }
    }
    
    return {
      icon,
      name: category,
      percentage: `${percentage}%`,
      value: parseFloat(percentage),
    };
  });
}

/**
 * Get paid partnerships metrics
 * @param {Object} profileData - Profile data object
 * @returns {Object} - Paid partnership metrics
 */
export function getPaidPartnershipMetrics(profileData) {
  // In a real implementation, this would come from the API
  // For demo, we'll generate some reasonable metrics based on the profile data
  
  const followers = profileData.followersCount || 100000;
  
  // Images metrics - higher than regular posts for sponsored content
  const imgLikes = followers * 0.03; // 3% like rate for sponsored images
  const imgComments = imgLikes * 0.01; // 1% of likes leave comments
  const imgCount = 2; // Average 2 sponsored image posts
  
  // Reels metrics - typically higher views but similar engagement rate
  const reelViews = followers * 0.6; // 60% view rate for sponsored reels
  const reelLikes = reelViews * 0.05; // 5% like rate on views
  const reelComments = reelLikes * 0.01; // 1% of likes leave comments
  const reelsCount = 5; // Average 5 sponsored reel posts
  
  return {
    images: {
      avgLikes: imgLikes,
      avgComments: imgComments,
      engagementRate: ((imgLikes + imgComments) / followers) * 100,
      count: imgCount,
    },
    reels: {
      avgViews: reelViews,
      avgLikes: reelLikes,
      avgComments: reelComments,
      engagementRate: ((reelLikes + reelComments) / reelViews) * 100,
      viewRate: (reelViews / followers) * 100,
      count: reelsCount,
    }
  };
}

/**
 * Format number for display (e.g., 1000000 -> 1M)
 * @param {number} num - Number to format
 * @returns {string} - Formatted number string
 */
export function formatNumber(num) {
  if (typeof num !== 'number') {
    return num; // Return as-is if not a number
  }
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
}
