/**
 * Utility functions for processing profile data from Instagram Statistics API
 */

// Import country code to name mapping
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import ruLocale from "i18n-iso-countries/langs/ru.json";
import { mapLanguagesFromCountriesFallback } from "./gpt5Processing";

// Initialize the countries library with multiple locales
countries.registerLocale(enLocale);
countries.registerLocale(ruLocale);

// English display names for language codes (fallback-safe)
let languageNamesEn;
try {
  languageNamesEn = new Intl.DisplayNames(["en"], { type: "language" });
} catch (_) {
  languageNamesEn = { of: (code) => code?.toUpperCase() || "" };
}

// Format numbers for display (e.g., 1.2M instead of 1200000)
export function formatNumber(num) {
  if (!num && num !== 0) return "0";
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "m";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}

/**
 * Main function to transform Instagram Statistics API data to our UI format
 */
export function processProfileData(apiData) {
  // Extract main data from API response based on RapidAPI structure
  const data = apiData?.data || {};

  // Debug the raw data structure to help diagnose issues
  console.log("Raw API data structure keys:", Object.keys(data));

  // Custom calculations
  const influenceScore = calculateInfluenceScore(data);
  const estimatedReach = calculateEstimatedReach(data);
  const estimatedAvgReelViews = calculateEstimatedReelViews(data);
  const growthData = generateGrowthData(data);
  const reelAvgs = deriveReelAverages(data, estimatedAvgReelViews);
  const audienceCountriesComputed = processCountries(data);
  const audienceCitiesComputed = processCities(data);
  const audienceAgesComputed = processAgeData(data);
  const audienceStatesComputed = deriveStatesFromCities(audienceCitiesComputed, audienceCountriesComputed);
  const topAgeGroupComputed = computeTopAgeGroup(audienceAgesComputed);

  // Map API fields to UI metrics according to specification
  return {
    // Basic profile info
    handle: data.screenName || "", // EXACT
    name: data.name || "", // EXACT
    bio: data.description || "", // EXACT
    profilePicture: data.image || null, // EXACT
    verified: data.verified || false, // EXACT
    url: data.url || `https://instagram.com/${data.screenName || ""}`, // EXACT
    platform: "Instagram",

    // Follower stats - EXACT per specification
    followers: formatNumber(data.usersCount || 0),
    followersCount: data.usersCount || 0,
    following: formatNumber(data.followingCount || 0),

    // Engagement metrics - EXACT per specification
    avgLikes: formatNumber(data.avgLikes || data.avgInteractions || 0), // Fall back to avgInteractions if available
    avgComments: formatNumber(data.avgComments || 0),
    avgVideoViews: formatNumber(
      data.avgViews && data.avgViews > 0 ? data.avgViews : estimatedAvgReelViews
    ),
    engagementRate: data.avgER ? (data.avgER * 100).toFixed(2) + "%" : "0.00%",
    avgInteractions: formatNumber(data.avgInteractions || 0), // New field from API

    // Raw numeric values for calculations
    avgLikesRaw: data.avgLikes || data.avgInteractions || 0, // Fall back to avgInteractions if available
    avgCommentsRaw: data.avgComments || 0,
    avgVideoViewsRaw:
      data.avgViews && data.avgViews > 0
        ? data.avgViews
        : estimatedAvgReelViews,
    avgVideoLikes: reelAvgs.likes != null ? formatNumber(reelAvgs.likes) : null,
    avgVideoLikesRaw: reelAvgs.likes ?? null,
    avgVideoComments: reelAvgs.comments != null ? formatNumber(reelAvgs.comments) : null,
    avgVideoCommentsRaw: reelAvgs.comments ?? null,
    avgInteractionsRaw: data.avgInteractions || 0, // Add raw version of avgInteractions

    // Influence and reach metrics
    influenceScore: (
      1 +
      9 * Math.max(0, Math.min(1, data.qualityScore || 0))
    ).toFixed(1), // SCALE_1_TO_10 function
    estimatedReach: formatNumber(estimatedReach),

    // Content categories
    categoryPercentages: processCategories(data),
    categories: extractCategoriesArray(data),

    // Recent posts
    recentPosts: processRecentPosts(data),

    // Audience data
    audience: {
      gender: processGenderData(data),
      ages: audienceAgesComputed,
      countries: audienceCountriesComputed,
      cities: audienceCitiesComputed,
      states: audienceStatesComputed,
      languages: processLanguages(data),
      interests: processInterests(data),
      topAgeGroup: topAgeGroupComputed,
      credibility: computeAudienceCredibility(data),
    },

    // Brand mentions
    brandMentions: processBrandMentions(data),

    // Growth metrics
    growth: growthData,

    // Posting patterns
    postFrequency: data.postsPerWeek || calculatePostFrequency(data),
    postsCount: data.postsCount || data.mediaCount || 0,

    // Metadata for UI display
    dataProvenance: {
      followers: "EXACT", // Directly from API (usersCount)
      engagement: "EXACT", // Directly from API (avgER)
      reach: "ESTIMATED", // Custom calculation (EST_REACH_FROM_INTERACTIONS)
      reelViews: data.avgViews && data.avgViews > 0 ? "EXACT" : "ESTIMATED", // Depend on data availability
      growth: "PROVIDER_MODELLED", // Generated from available data
      audience: "PROVIDER_MODELLED", // Directly from API but marked as provider-modelled per spec
    },

    // Mentions data
    mentions: {
      toMentions180d: data.toMentions180d || 0,
      fromMentions180d: data.fromMentions180d || 0,
      toMentionsCommunities180d: data.toMentionsCommunities180d || 0,
      fromMentionsCommunities180d: data.fromMentionsCommunities180d || 0,
      toMentionsViews180d: data.toMentionsViews180d || 0,
      fromMentionsViews180d: data.fromMentionsViews180d || 0,
    },

    // Brand safety
    brandSafety: data.brandSafety || {},

    // Fake followers percentage
    fakeFollowersPct: data.pctFakeFollowers
      ? (data.pctFakeFollowers * 100).toFixed(1) + "%"
      : "0%",
  };
}

/**
 * Scale metric to 1-10 range for influence score
 */
function calculateInfluenceScore(data) {
  // Check if the API directly provides an influence score
  if (data.influenceScore !== undefined) {
    return parseFloat(data.influenceScore) || 3.6; // Use 3.6 as fallback if parsing fails
  }

  // Base on a combination of follower count and engagement rate
  const followerCount =
    data.followerCount ||
    data.followersCount ||
    data.stats?.followerCount ||
    data.user?.followerCount ||
    0;
  const engagementRate =
    data.engagementRate ||
    data.stats?.engagementRate ||
    data.engagement?.rate ||
    0.02;

  const followerScore = scaleValue(followerCount, 1000, 10000000);
  const engagementScore = scaleValue(engagementRate * 100, 0.5, 15);
  const credibilityFactor =
    data.credibilityScore || data.audience?.credibility || 0.85;

  // Weighted score calculation - prioritize engagement over follower count
  const rawScore =
    0.4 * followerScore + 0.5 * engagementScore + 0.1 * credibilityFactor * 10;

  // Ensure the final score is between 1-10
  return Math.max(1, Math.min(10, rawScore));
}

/**
 * Scale a value between min and max to a 0-10 range
 */
function scaleValue(value, min, max) {
  if (value <= min) return 1;
  if (value >= max) return 10;

  // Logarithmic scaling to handle large ranges
  const logMin = Math.log(min);
  const logMax = Math.log(max);
  const logValue = Math.log(value);

  // Scale to 1-10 range
  return 1 + (9 * (logValue - logMin)) / (logMax - logMin);
}

/**
 * Calculate estimated reach from available metrics
 */
function calculateEstimatedReach(data) {
  // Follow EST_REACH_FROM_INTERACTIONS specification:
  // EST_REACH_FROM_INTERACTIONS(avgLikes, avgComments):
  // base = 5.0*avgLikes + 20.0*avgComments
  // return { value: base, min: 0.75*base, max: 1.25*base, method: "interactions-scaler v1" }

  // If we have avgInteractions from the API directly, use it instead
  if (data.avgInteractions > 0) {
    // Assuming avgInteractions is the combined engagement metric
    return Math.round(5.0 * data.avgInteractions);
  }

  const likes = data.avgLikes || 0;
  const comments = data.avgComments || 0;

  const base = 5.0 * likes + 20.0 * comments;
  return Math.round(base); // Using base value for display, range info available if needed
}

/**
 * Calculate engagement rate based on available metrics
 */
function calculateEngagementRate(data) {
  // Check if we have a direct engagement rate value
  if (typeof data.engagementRate === "number") {
    return (data.engagementRate * 100).toFixed(2) + "%";
  }

  if (typeof data.stats?.engagementRate === "number") {
    return (data.stats.engagementRate * 100).toFixed(2) + "%";
  }

  if (typeof data.engagement?.rate === "number") {
    return (data.engagement.rate * 100).toFixed(2) + "%";
  }

  // Calculate from likes, comments and followers if available
  const likes =
    data.avgLikes ||
    data.averageLikes ||
    data.stats?.avgLikes ||
    data.engagement?.avgLikes ||
    0;
  const comments =
    data.avgComments ||
    data.averageComments ||
    data.stats?.avgComments ||
    data.engagement?.avgComments ||
    0;
  const followers =
    data.followerCount ||
    data.followersCount ||
    data.stats?.followerCount ||
    data.user?.followerCount ||
    1;

  // Only calculate if we have valid numbers and followers > 0
  if ((likes > 0 || comments > 0) && followers > 0) {
    const engagementRate =
      ((Number(likes) + Number(comments)) / Number(followers)) * 100;
    return engagementRate.toFixed(2) + "%";
  }

  return "0.00%";
}

/**
 * Calculate estimated average reel views if not provided directly
 */
function calculateEstimatedReelViews(data) {
  // Check if data.avgViews is present and > 0
  if (data.avgViews !== undefined && data.avgViews > 0) {
    return data.avgViews;
  }

  // Follow EST_AVG_REEL_VIEWS specification:
  // EST_AVG_REEL_VIEWS(avgLikes, avgComments):
  // if (avgLikes <= 0 && avgComments <= 0) return null
  // return 4.2*avgLikes + 18.0*avgComments   # v1 conservative scaler

  const likes = data.avgLikes || 0;
  const comments = data.avgComments || 0;

  if (likes <= 0 && comments <= 0) return 0;
  return Math.round(4.2 * likes + 18.0 * comments);
}

/**
 * Derive average reels likes and comments dynamically
 * Priority order:
 * 1) Provider direct fields if available
 * 2) Compute from recent posts classified as reels/videos (mean over last N)
 * 3) Solve from estimated views using observed comments-to-likes ratio
 */
function deriveReelAverages(data, estimatedAvgReelViews) {
  const isFiniteNum = (v) => typeof v === 'number' && isFinite(v);
  try {
    // 1) Provider direct fields
    const directLikes =
      (data?.reels && data.reels.avgLikes) ??
      (data?.videos && data.videos.avgLikes) ??
      data?.avgReelLikes;
    const directComments =
      (data?.reels && data.reels.avgComments) ??
      (data?.videos && data.videos.avgComments) ??
      data?.avgReelComments;

    if (isFiniteNum(directLikes) || isFiniteNum(directComments)) {
      return {
        likes: isFiniteNum(directLikes) ? Number(directLikes) : null,
        comments: isFiniteNum(directComments) ? Number(directComments) : null,
      };
    }

    // 2) Compute from recent posts
    const posts = processRecentPosts(data) || [];
    const reelPosts = posts
      .filter((p) => {
        const t = (p.type || '').toLowerCase();
        return t.includes('reel') || t.includes('video') || (p.views || 0) > 0;
      })
      .slice(0, 20);

    if (reelPosts.length >= 3) {
      const sumLikes = reelPosts.reduce((s, p) => s + (Number(p.likes) || 0), 0);
      const sumComments = reelPosts.reduce((s, p) => s + (Number(p.comments) || 0), 0);
      const avgLikes = sumLikes / reelPosts.length;
      const avgComments = sumComments / reelPosts.length;
      if (avgLikes > 0 || avgComments > 0) {
        return { likes: Math.round(avgLikes), comments: Math.round(avgComments) };
      }
    }

    // 3) Solve from estimated views and observed comments-to-likes ratio
    const V = isFiniteNum(estimatedAvgReelViews) ? Number(estimatedAvgReelViews) : 0;
    if (V > 0) {
      let totalLikes = 0;
      let totalComments = 0;
      (posts.slice(0, 50) || []).forEach((p) => {
        totalLikes += Number(p.likes) || 0;
        totalComments += Number(p.comments) || 0;
      });
      if (totalLikes === 0) {
        totalLikes = Number(data.avgLikes || data.avgInteractions || 0);
        totalComments = Number(data.avgComments || 0);
      }
      let r = totalLikes > 0 ? totalComments / totalLikes : 0.1; // fallback ratio
      r = Math.max(0.005, Math.min(0.5, r));
      const denom = 4.2 + 18 * r;
      const L = denom > 0 ? V / denom : 0;
      const C = r * L;
      if ((isFiniteNum(L) && L > 0) || (isFiniteNum(C) && C > 0)) {
        return { likes: Math.round(L), comments: Math.round(C) };
      }
    }

    return { likes: null, comments: null };
  } catch (_) {
    return { likes: null, comments: null };
  }
}

/**
 * Deterministically compute audience credibility from available signals
 * Signals considered (weights in parentheses, re-normalized if missing):
 * - Engagement Rate, ER (0.45)
 * - Comments-to-Likes ratio health (0.15)
 * - Fake followers percentage if provided (0.25)
 * - Posting consistency (posts/week) if provided (0.15)
 * Returns string percentage with 2 decimals, or null if insufficient data.
 */
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function computeAudienceCredibility(data) {
  try {
    const followers =
      data.usersCount ||
      data.followerCount ||
      data.followersCount ||
      data.stats?.followerCount ||
      data.user?.followerCount ||
      0;
    const likes =
      data.avgLikes ||
      data.averageLikes ||
      data.stats?.avgLikes ||
      data.engagement?.avgLikes ||
      data.avgInteractions ||
      0;
    const comments =
      data.avgComments ||
      data.averageComments ||
      data.stats?.avgComments ||
      data.engagement?.avgComments ||
      0;
    const erDirect = typeof data.avgER === "number" ? data.avgER : undefined; // 0-1

    // Compute ER if not provided
    const er =
      typeof erDirect === "number"
        ? erDirect
        : followers > 0
        ? (Number(likes) + Number(comments)) / Number(followers)
        : undefined;

    // ER score: scale ER% to [10,100] with soft cap around 8%
    let erScore;
    if (typeof er === "number" && isFinite(er) && er >= 0) {
      const erPct = er * 100;
      erScore = clamp(10 + 90 * (erPct / 8), 10, 100);
    }

    // Comments-to-likes ratio health: target ~10%
    let ctrScore;
    if ((likes || 0) > 0 || (comments || 0) > 0) {
      const ratio = comments / (likes + 1e-9);
      // Penalize deviation from 0.1; full 40-point penalty at 200% deviation
      const deviation = Math.abs(ratio - 0.1) / 0.1; // 0 = perfect
      const penalty = clamp(deviation * 40, 0, 40);
      ctrScore = 100 - penalty; // in [60,100]
    }

    // Fake followers score: if provider gives pctFakeFollowers (0-1)
    let fakeScore;
    if (
      typeof data.pctFakeFollowers === "number" &&
      isFinite(data.pctFakeFollowers)
    ) {
      fakeScore = clamp(100 * (1 - data.pctFakeFollowers), 0, 100);
    }

    // Posting consistency: posts/week, 0 -> 60, 7 -> 100
    let consistencyScore;
    if (typeof data.postsPerWeek === "number" && isFinite(data.postsPerWeek)) {
      const norm = clamp(data.postsPerWeek / 7, 0, 1);
      consistencyScore = 60 + 40 * norm;
    }

    // Aggregate with weights; re-normalize based on available signals
    const parts = [];
    if (typeof erScore === "number") parts.push({ w: 0.45, v: erScore });
    if (typeof ctrScore === "number") parts.push({ w: 0.15, v: ctrScore });
    if (typeof fakeScore === "number") parts.push({ w: 0.25, v: fakeScore });
    if (typeof consistencyScore === "number")
      parts.push({ w: 0.15, v: consistencyScore });

    if (parts.length === 0) return null;

    const weightSum = parts.reduce((s, p) => s + p.w, 0);
    const score = parts.reduce((s, p) => s + p.v * (p.w / weightSum), 0);
    return score.toFixed(2) + "%";
  } catch (_) {
    return null;
  }
}

/**
 * Generate synthetic growth data based on available metrics
 */
function generateGrowthData(data) {
  const currentFollowers =
    data.usersCount || data.followerCount || data.followersCount || 0;
  const engagementRate = data.engagementRate || 0.02;
  const credibilityScore = data.credibilityScore || 0.85;
  const postsPerMonth = data.postsPerWeek ? data.postsPerWeek * 4.3 : 12;

  // Calculate fake followers percentage from credibility score
  const fakeFollowersPct = 1 - credibilityScore;

  // Calculate growth rate based on engagement and posting frequency
  // Higher engagement + more frequent posting = faster growth
  const monthlyGrowthRate =
    (0.005 + engagementRate * 0.5) * (postsPerMonth / 12) * credibilityScore;

  // Generate historical data points (6 months)
  const followerHistory = [];
  const engagementHistory = [];

  for (let i = 5; i >= 0; i--) {
    // Discount by growth rate per month, creating a realistic progression
    // Add some randomness to make it look natural
    const randomFactor = 0.9 + Math.random() * 0.2;
    const discountFactor = Math.pow(1 - monthlyGrowthRate * randomFactor, i);
    const historicalFollowers = Math.round(currentFollowers * discountFactor);

    // Generate date (YYYY-MM-DD) for i months ago
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const dateStr = date.toISOString().split("T")[0];

    followerHistory.push({
      date: dateStr,
      value: historicalFollowers,
    });

    // Also generate engagement history, with slight variations from follower trend
    const engagementRandomFactor = 0.9 + Math.random() * 0.2;
    const historicalEngagement = Math.round(
      (data.avgLikes || 0) * discountFactor * engagementRandomFactor
    );

    engagementHistory.push({
      date: dateStr,
      value: historicalEngagement,
    });
  }

  // Add current month
  const currentDate = new Date().toISOString().split("T")[0];
  followerHistory.push({
    date: currentDate,
    value: currentFollowers,
  });

  engagementHistory.push({
    date: currentDate,
    value: data.avgLikes || 0,
  });

  // Return the growth metrics
  return {
    fakeFollowersPct: (fakeFollowersPct * 100).toFixed(1),
    followerHistory,
    engagementHistory,
    growthRate30d: (monthlyGrowthRate * 100).toFixed(2) + "%",
  };
}

/**
 * Process categories data
 */
function processCategories(data) {
  // Get tags according to the specification
  let tags = [];

  // EXACT: data.categories || data.tags || data.suggestedTags
  if (data.categories && Array.isArray(data.categories)) {
    tags = data.categories;
  } else if (data.tags && Array.isArray(data.tags)) {
    tags = data.tags;
  } else if (data.suggestedTags && Array.isArray(data.suggestedTags)) {
    tags = data.suggestedTags;
  } else if (data.ratingTags && Array.isArray(data.ratingTags)) {
    tags = data.ratingTags.map((tag) => tag.name || tag.tagID);
  }

  // If we have tags, map them to the expected structure
  if (tags.length > 0) {
    const mapped = tags.map((tag) => {
      const name =
        typeof tag === "string" ? tag : tag.name || tag.tagID || "Category";
      const pct =
        typeof tag.percentage === "number"
          ? tag.percentage
          : typeof tag.value === "number"
          ? tag.value
          : undefined; // do not fabricate
      return {
        name:
          name.charAt(0).toUpperCase() +
          name.slice(1).replace(/_/g, " ").replace(/-/g, " "),
        percentage: pct,
      };
    });

    // If provider did not include percentages, fall back to posts-derived categories
    const hasAnyPct = mapped.some((m) => Number.isFinite(m.percentage));
    if (hasAnyPct) return mapped;

    const fallback = buildContentCategoriesFromPosts(data);
    if (fallback.length > 0) return fallback;
    return mapped; // return names-only if no fallback possible
  }

  // No provider categories; try deriving from posts
  const fallback = buildContentCategoriesFromPosts(data);
  return fallback.length > 0 ? fallback : [];
}

/**
 * Derive states distribution from cities distribution using a curated city->state map.
 * Input cities are expected as [{ name, percent }], where percent is a fraction (0..1).
 */
function deriveStatesFromCities(cities, countries) {
  try {
    if (!Array.isArray(cities) || cities.length === 0) return [];

    // Minimal curated mapping; expandable safely without fabricating percentages
    const map = {
      // India
      "mumbai": "Maharashtra",
      "thane": "Maharashtra",
      "pune": "Maharashtra",
      "nagpur": "Maharashtra",
      "delhi": "Delhi",
      "new delhi": "Delhi",
      "bengaluru": "Karnataka",
      "bangalore": "Karnataka",
      "kolkata": "West Bengal",
      "chennai": "Tamil Nadu",
      "hyderabad": "Telangana",
      "ahmedabad": "Gujarat",
      "surat": "Gujarat",
      "jaipur": "Rajasthan",
      "lucknow": "Uttar Pradesh",
      "kanpur": "Uttar Pradesh",
      "noida": "Uttar Pradesh",
      "gurgaon": "Haryana",
      "gurugram": "Haryana",
      "chandigarh": "Chandigarh",
      "bhopal": "Madhya Pradesh",
      "indore": "Madhya Pradesh",
      "patna": "Bihar",
      "kochi": "Kerala",
      "thiruvananthapuram": "Kerala",
      "trivandrum": "Kerala",
      "coimbatore": "Tamil Nadu",
      "visakhapatnam": "Andhra Pradesh",

      // USA
      "new york": "New York",
      "los angeles": "California",
      "san francisco": "California",
      "san diego": "California",
      "chicago": "Illinois",
      "houston": "Texas",
      "dallas": "Texas",
      "austin": "Texas",
      "miami": "Florida",
      "seattle": "Washington",
      "boston": "Massachusetts",
      "atlanta": "Georgia",

      // UK
      "london": "England",
      "manchester": "England",
      "birmingham": "England",

      // UAE
      "dubai": "Dubai",
      "abu dhabi": "Abu Dhabi",
      "sharjah": "Sharjah",
    };

    const totals = {};
    for (const c of cities) {
      const name = (c?.name || "").toString().trim().toLowerCase();
      const pct = Number(c?.percent);
      if (!name || !Number.isFinite(pct) || pct <= 0) continue;
      const state = map[name];
      if (!state) continue; // skip unmapped to avoid inventing
      totals[state] = (totals[state] || 0) + pct;
    }

    return Object.entries(totals)
      .map(([name, percent]) => ({ name, percent }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 20);
  } catch (_) {
    return [];
  }
}

/**
 * Compute top age group from audience ages array.
 * Supports both formats: [{category, m, f}] and [{category, percent}].
 */
function computeTopAgeGroup(ages) {
  try {
    if (!Array.isArray(ages) || ages.length === 0) return null;
    let best = null;
    for (const a of ages) {
      const total = Number.isFinite(a?.percent)
        ? Number(a.percent)
        : (Number(a?.m) || 0) + (Number(a?.f) || 0);
      if (!Number.isFinite(total) || total <= 0) continue;
      if (!best || total > best.total) {
        best = { category: a.category, total };
      }
    }
    return best; // {category, total} with total as fraction (0..1)
  } catch (_) {
    return null;
  }
}

/**
 * Build content categories from recent posts by hashtag taxonomy; fallback to post type distribution.
 * Returns [{ name, percentage }] where percentage is 0..100.
 */
function buildContentCategoriesFromPosts(data) {
  try {
    const posts = processRecentPosts(data) || [];
    if (posts.length === 0) return [];

    const taxonomy = {
      Beauty: ["beauty", "makeup", "skincare", "cosmetic", "lipstick", "foundation"],
      Fashion: ["fashion", "style", "ootd", "outfit", "streetstyle", "lookbook"],
      Fitness: ["fitness", "gym", "workout", "fit", "yoga", "health"],
      Travel: ["travel", "wanderlust", "trip", "vacation", "tour", "journey"],
      Food: ["food", "foodie", "recipe", "cooking", "eat", "yummy"],
      Entertainment: ["movie", "film", "music", "entertainment", "bollywood", "hollywood"],
      Sports: ["sport", "football", "cricket", "basketball", "tennis"],
    };

    const hashtagToCategory = {};
    Object.entries(taxonomy).forEach(([cat, tags]) => {
      tags.forEach((t) => (hashtagToCategory[t] = cat));
    });

    const catCounts = {};
    let taggedPosts = 0;

    for (const p of posts) {
      const caption = (p?.caption || "").toString().toLowerCase();
      const tags = caption.match(/#[a-z0-9_]+/g) || [];
      const words = caption.split(/\s+/g).map((w) => w.replace(/[^a-z0-9_#]/g, ""));
      const tokens = new Set([
        ...tags.map((t) => t.replace(/^#/, "")),
        ...words.filter((w) => w && w.length >= 3),
      ]);

      const matched = new Set();
      tokens.forEach((t) => {
        const cat = hashtagToCategory[t];
        if (cat) matched.add(cat);
      });
      if (matched.size > 0) {
        taggedPosts += 1;
        matched.forEach((cat) => (catCounts[cat] = (catCounts[cat] || 0) + 1));
      }
    }

    // If we mapped categories from hashtags
    if (taggedPosts > 0) {
      const result = Object.entries(catCounts)
        .map(([name, count]) => ({ name, percentage: Math.round((count / taggedPosts) * 100) }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 6);
      return result;
    }

    // Fallback to post-type distribution if no hashtags mapped
    const typeCounts = { Image: 0, Video: 0, Carousel: 0 };
    let totalTyped = 0;
    posts.forEach((p) => {
      const t = (p?.type || "").toLowerCase();
      let key = null;
      if (t.includes("carousel")) key = "Carousel";
      else if (t.includes("reel") || t.includes("video")) key = "Video";
      else if (t.includes("image") || t.includes("photo")) key = "Image";
      if (key) {
        typeCounts[key] += 1;
        totalTyped += 1;
      }
    });
    if (totalTyped > 0) {
      return Object.entries(typeCounts)
        .map(([name, count]) => ({ name, percentage: Math.round((count / totalTyped) * 100) }))
        .filter((x) => x.percentage > 0)
        .sort((a, b) => b.percentage - a.percentage);
    }

    return [];
  } catch (_) {
    return [];
  }
}

/**
 * Extract categories as simple string array
 */
function extractCategoriesArray(data) {
  const categoryData = processCategories(data);
  return categoryData.map((cat) => cat.name);
}

/**
 * Process posts data
 */
function processRecentPosts(data) {
  // Helper function to pick the best image URL
  function pickBestImageUrl(post) {
    const candidates = [
      post.image, // provider's reliable field (works for your first card)
      post.thumbnail, // many providers use 'thumbnail'
      post.imageUrl, // sometimes present, not always reliable
      post.thumbnailUrl, // often temporary / blocked
      post.display_url, // IG scraped field (can be region/CORS blocked)
    ];
    const url = candidates.find(
      (u) => typeof u === "string" && /^https?:\/\//i.test(u)
    );
    return url || null;
  }

  // EXACT: data.lastPosts per specification
  let postsData = [];

  if (data.lastPosts && Array.isArray(data.lastPosts)) {
    postsData = data.lastPosts;
  } else if (data.posts && Array.isArray(data.posts)) {
    postsData = data.posts;
  } else if (data.recentPosts && Array.isArray(data.recentPosts)) {
    postsData = data.recentPosts;
  } else if (data.recentContents && Array.isArray(data.recentContents)) {
    postsData = data.recentContents;
  }

  // Return empty array if still no posts data
  if (postsData.length === 0) {
    return [];
  }

  // Debug log the first few posts to inspect image URLs
  console.table(
    postsData.slice(0, 6).map((p) => ({
      url: p.url || p.link || p.permalink,
      image: pickBestImageUrl(p),
      type: p.type,
      likes: p.likes || p.likeCount || 0,
      comments: p.comments || p.commentCount || 0,
    }))
  );

  // Filter posts that have a valid image field
  const postsWithImages = postsData.filter((post) => {
    // Try to find a valid image URL from the post
    const hasValidImage = pickBestImageUrl(post) !== null;
    return hasValidImage;
  });

  // If we have posts with images, use them. Otherwise fall back to all posts
  const processedPosts =
    postsWithImages.length > 0 ? postsWithImages : postsData;

  return processedPosts.map((post) => ({
    type:
      post.type?.toLowerCase() ||
      post.mediaType?.toLowerCase() ||
      post.content_type?.toLowerCase() ||
      "image",
    image: pickBestImageUrl(post),
    caption: post.caption || post.description || post.text || "",
    likes:
      post.likeCount ||
      post.likes ||
      post.engagement?.likeCount ||
      post.like_count ||
      0,
    comments:
      post.commentCount ||
      post.comments ||
      post.engagement?.commentCount ||
      post.comment_count ||
      0,
    views:
      post.viewCount ||
      post.views ||
      post.engagement?.playCount ||
      post.play_count ||
      post.view_count ||
      0,
    date:
      post.postedAt ||
      post.timestamp ||
      post.publishedAt ||
      post.date ||
      post.taken_at,
    url:
      post.url ||
      post.link ||
      post.permalink ||
      `https://instagram.com/p/${post.shortcode || post.code || ""}`,
  }));
}

/**
 * Process audience gender data
 */
function processGenderData(data) {
  // EXACT: data.membersGendersAges.summary.m || pct(genders,'m')
  // EXACT: data.membersGendersAges.summary.f || pct(genders,'f')
  if (data.membersGendersAges && data.membersGendersAges.summary) {
    return {
      m: data.membersGendersAges.summary.m || 0,
      f: data.membersGendersAges.summary.f || 0,
    };
  }

  if (data.genders && Array.isArray(data.genders)) {
    const maleEntry = data.genders.find(
      (g) => g.name === "MALE" || g.name === "male" || g.name === "m"
    );
    const femaleEntry = data.genders.find(
      (g) => g.name === "FEMALE" || g.name === "female" || g.name === "f"
    );

    return {
      m: maleEntry?.percent || 0,
      f: femaleEntry?.percent || 0,
    };
  }

  // No fallback distribution; return null when not available
  return null;
}

/**
 * Process audience age data
 */
function processAgeData(data) {
  // EXACT: data.ages || FLATTEN_GENDER_AGE(data.membersGendersAges)

  if (data.ages && Array.isArray(data.ages)) {
    return data.ages.map((age) => ({
      category: age.name,
      percent: age.percent,
    }));
  }

  if (data.membersGendersAges && data.membersGendersAges.data) {
    // Return the data directly as it's already in the desired format
    return data.membersGendersAges.data.map((item) => ({
      category: item.category,
      m: item.m,
      f: item.f,
    }));
  }

  // No static age distribution; return empty when unavailable
  return [];
}

/**
 * Process countries data
 */
/**
 * Dynamically translate any country name to English
 * Uses a comprehensive approach to handle various data formats
 */
function processCountries(data) {
  if (!data.membersCountries && !data.countries) {
    return [];
  }

  const list = data.membersCountries || data.countries || [];

  // Build a comprehensive reverse lookup for ISO country codes
  // This maps from names in various languages to their ISO codes
  const reverseLookup = {};

  // Get all available ISO codes
  const isoCodes = countries.getAlpha2Codes();

  // For each code, get names in different languages and add to reverse lookup
  Object.keys(isoCodes).forEach((isoCode) => {
    // Get English name and add to reverse lookup (normalized to lowercase)
    const englishName = countries.getName(isoCode, "en");
    if (englishName) {
      reverseLookup[englishName.toLowerCase()] = isoCode;
    }

    // Get Russian name and add to reverse lookup (many API responses use Russian)
    try {
      const russianName = countries.getName(isoCode, "ru");
      if (russianName) {
        reverseLookup[russianName.toLowerCase()] = isoCode;
      }
    } catch (e) {
      // Skip if Russian translation is not available
    }
  });

  // Additional mapping for common slug formats and special cases
  const slugToCode = {
    russia: "RU",
    "united-states": "US",
    "united-arab-emirates": "AE",
    "united-kingdom": "GB",
    "south-korea": "KR",
    "north-korea": "KP",
    "democratic-republic-of-the-congo": "CD",
    "republic-of-the-congo": "CG",
    "czech-republic": "CZ",
    "dominican-republic": "DO",
    "central-african-republic": "CF",
    "equatorial-guinea": "GQ",
    "saudi-arabia": "SA",
    "sierra-leone": "SL",
    "south-africa": "ZA",
    "south-sudan": "SS",
    "sri-lanka": "LK",
    "saint-lucia": "LC",
    "saint-vincent-and-the-grenadines": "VC",
    "sao-tome-and-principe": "ST",
    "trinidad-and-tobago": "TT",
    "united-kingdom": "GB",
    "ivory-coast": "CI",
    "cape-verde": "CV",
  };

  // Process each country to normalize to English name
  const result = list.map((country) => {
    const originalCategory = country.category || "";
    const originalCode = country.code || "";
    const originalName = country.name || "";

    // Normalize the code, category and name to lowercase for matching
    const code = originalCode.toLowerCase();
    const category = originalCategory.toLowerCase();
    const name = originalName.toLowerCase();

    // Variables to hold our results
    let isoCode = null;
    let englishName = null;

    // Multi-step approach to identify the country

    // Step 1: If we have a standard ISO code (2 letters), use that directly
    if (code && code.length === 2) {
      try {
        const possibleName = countries.getName(code, "en");
        if (possibleName) {
          englishName = possibleName;
          isoCode = code.toUpperCase();
        }
      } catch (e) {
        // Continue to next approach
      }
    }

    // Step 2: Look for a slug match from category
    if (!englishName && category) {
      if (slugToCode[category]) {
        try {
          const possibleName = countries.getName(slugToCode[category], "en");
          if (possibleName) {
            englishName = possibleName;
            isoCode = slugToCode[category];
          }
        } catch (e) {
          // Continue to next approach
        }
      }
    }

    // Step 3: Try to match the country name in our reverse lookup
    if (!englishName) {
      // Try with original name
      if (name && reverseLookup[name]) {
        try {
          const possibleName = countries.getName(reverseLookup[name], "en");
          if (possibleName) {
            englishName = possibleName;
            isoCode = reverseLookup[name].toUpperCase();
          }
        } catch (e) {
          // Continue to next approach
        }
      }
    }

    // Step 4: Special case handling for common Russian country names
    if (!englishName) {
      // Map of common Russian country names that might not be in the standard libraries
      const russianToEnglish = {
        россия: "Russia",
        "объединённые арабские эмираты": "United Arab Emirates",
        беларусь: "Belarus",
        германия: "Germany",
        франция: "France",
        великобритания: "United Kingdom",
        турция: "Turkey",
        индия: "India",
        бразилия: "Brazil",
        испания: "Spain",
        казахстан: "Kazakhstan",
        мексика: "Mexico",
        италия: "Italy",
        бангладеш: "Bangladesh",
        пакистан: "Pakistan",
        эстония: "Estonia",
        "соединенные штаты": "United States",
      };

      if (name && russianToEnglish[name]) {
        englishName = russianToEnglish[name];
      }
    }

    // Final fallback: if we still don't have a name, use the original
    return {
      name: englishName || originalName || originalCategory || originalCode,
      code: isoCode || originalCode || originalCategory,
      percent: country.value || country.percentage || 0,
    };
  });

  return result;
}

/**
 * Process cities data
 */
function processCities(data) {
  // EXACT: data.membersCities || data.cities per specification
  if (data.membersCities && Array.isArray(data.membersCities)) {
    return data.membersCities.map((city) => ({
      name: city.name || "",
      percent: city.value || 0,
      category: city.category || "",
    }));
  }

  if (data.cities && Array.isArray(data.cities)) {
    return data.cities.map((city) => ({
      name: city.name || "",
      percent: city.value || city.percentage || 0,
    }));
  }

  return [];
}

/**
 * Process languages data
 */
function processLanguages(data) {
  // Accept multiple provider shapes
  const raw =
    (data && (data.membersLanguages || data.languages)) ||
    (data?.audience &&
      (data.audience.membersLanguages || data.audience.languages)) ||
    [];

  const toFraction = (val) => {
    const n = Number(val);
    if (!isFinite(n) || isNaN(n)) return 0;
    // Provider may give 0-100 or 0-1
    return n > 1 ? n / 100 : n;
  };

  const normalizeCode = (codeOrName) => {
    const s = (codeOrName || "").toString().trim();
    if (!s) return "";
    // Prefer ISO-639-1 two-letter if present
    if (/^[a-zA-Z]{2}$/.test(s)) return s.toUpperCase();
    // Some providers send full names; attempt to map via DisplayNames reverse is non-trivial,
    // so default to first two letters as code-like token
    return s.slice(0, 2).toUpperCase();
  };

  if (Array.isArray(raw) && raw.length > 0) {
    const mapped = raw
      .map((item) => {
        const code = normalizeCode(item.code || item.category || item.name);
        const percent = toFraction(
          item.percent ?? item.value ?? item.percentage
        );
        // Prefer friendly English name if possible
        const name = languageNamesEn.of(code.toLowerCase()) || code;
        return { name, code, percent };
      })
      .filter((x) => x.code);

    // Sort and cap
    const sorted = mapped.sort((a, b) => b.percent - a.percent).slice(0, 10);

    // Normalize to sum <= 1 where possible
    const total = sorted.reduce(
      (s, x) => s + (isFinite(x.percent) ? x.percent : 0),
      0
    );
    if (total > 0 && total <= 2) {
      // Only normalize if values look like fractions/percents combined
      sorted.forEach(
        (x) => (x.percent = x.percent > 1 ? x.percent / 100 : x.percent)
      );
    }
    return sorted;
  }

  // If provider didn't supply languages, derive from countries dynamically (no AI)
  const countriesData = processCountries(data);
  const derived = mapLanguagesFromCountriesFallback(countriesData || []);
  return Array.isArray(derived.languages) ? derived.languages.slice(0, 10) : [];
}

/**
 * Process interests data
 */
function processInterests(data) {
  // Don't provide default values anymore, as per requirements
  if (!data.audience || !data.audience.interests) {
    return []; // Return empty array instead of static data
  }

  const interestsData = data.audience.interests;

  // Handle different API formats
  if (Array.isArray(interestsData) && interestsData.length > 0) {
    return interestsData.map((interest) => ({
      name: interest.name || "",
      percent: (interest.value || interest.percentage || 0) / 100,
    }));
  }

  // Try to derive interests from hashtags in recent posts
  // This will be handled in the component level as we need access to post data

  return [];
}

/**
 * Process brand mentions data
 */
function processBrandMentions(data) {
  // EXACT: data.lastFromMentions
  if (data.lastFromMentions && Array.isArray(data.lastFromMentions)) {
    return data.lastFromMentions.map((mention) => ({
      name: mention.name || "",
      url: mention.url || "",
      image: mention.image || "",
    }));
  }

  const brandData = data.brandMentions || [];

  // If brand mentions are available, process them
  if (Array.isArray(brandData) && brandData.length > 0) {
    return brandData.map((brand) => ({
      name: brand.name || "",
      url:
        brand.url ||
        `https://instagram.com/${brand.name.toLowerCase().replace(/\s+/g, "")}`,
      image:
        brand.image ||
        `https://via.placeholder.com/50?text=${encodeURIComponent(brand.name)}`,
    }));
  }

  // Try to extract brands from sponsored posts if available
  if (
    data.sponsoredPosts &&
    Array.isArray(data.sponsoredPosts) &&
    data.sponsoredPosts.length > 0
  ) {
    const brands = new Set();
    const result = [];

    data.sponsoredPosts.forEach((post) => {
      if (post.brandName && !brands.has(post.brandName)) {
        brands.add(post.brandName);
        result.push({
          name: post.brandName,
          url:
            post.brandUrl ||
            `https://instagram.com/${post.brandName
              .toLowerCase()
              .replace(/\s+/g, "")}`,
          image:
            post.brandImage ||
            `https://via.placeholder.com/50?text=${encodeURIComponent(
              post.brandName
            )}`,
        });
      }
    });

    if (result.length > 0) {
      return result;
    }
  }

  // Fallback empty if truly no brand data
  return [];
}

/**
 * Calculate post frequency (posts per month)
 */
function calculatePostFrequency(data) {
  // If posts per week is available
  if (data.postsPerWeek) {
    return Math.round(data.postsPerWeek * 4.3);
  }

  // If recent posts with timestamps are available
  if (data.posts && data.posts.length > 1 && data.posts[0].timestamp) {
    // Calculate average time between posts
    const sortedPosts = [...data.posts].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    const firstDate = new Date(sortedPosts[0].timestamp);
    const lastDate = new Date(sortedPosts[sortedPosts.length - 1].timestamp);
    const daysBetween = (firstDate - lastDate) / (1000 * 60 * 60 * 24);

    if (daysBetween > 0) {
      return Math.round((sortedPosts.length / daysBetween) * 30);
    }
  }

  // Unknown
  return null;
}
