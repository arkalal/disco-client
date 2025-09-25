import { NextResponse } from "next/server";

// Note: Caching has been removed for now to simplify integration

export async function GET(request, { params }) {
  // Properly await params before accessing properties
  const resolvedParams = await Promise.resolve(params);
  const username = resolvedParams.username;

  try {
    // No DB connection or caching - fetch fresh data every time

    console.log("Fetching from InsightIQ API...");
    // No valid cache, fetch from InsightIQ API
    const insightIQApiUrl =
      "https://api.staging.insightiq.ai/v1/social/creators/profiles/analytics";

    // Log API request details (without sensitive info)
    console.log(`Making request to: ${insightIQApiUrl} for user ${username}`);

    try {
      // Use environment variables for auth credentials in production
      const authCredentials =
        "NGY2ZmU2YzEtNjBlZi00MjE5LTlmODItM2NkOWZjMWJmN2NlOmRiNDZjM2JjLWQ0NWEtNDk4Ni05NWI1LWUxMzcxMjQ0YWVkNw==";

      // Instagram platform ID for work_platform_id
      const instagramPlatformId = "9bb8913b-ddd9-430b-a66a-d74d846e6c66";

      const requestBody = {
        identifier: username,
        work_platform_id: instagramPlatformId,
      };

      const response = await fetch(insightIQApiUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Basic ${authCredentials}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("API Response status:", response.status);

      if (!response.ok) {
        // Log more detailed error information
        console.error(`API Error: ${response.status} ${response.statusText}`);

        try {
          const errorBody = await response.text();
          console.error("API Error response:", errorBody);
        } catch (e) {
          console.error("Could not read error response body");
        }

        return NextResponse.json(
          { error: "Failed to fetch profile data" },
          { status: response.status }
        );
      }

      const rawData = await response.json();

      // Process data to match our UI requirements
      const profileData = transformInsightIQData(rawData);

      return NextResponse.json(profileData);
    } catch (apiError) {
      console.error("API request failed:", apiError);
      return NextResponse.json(
        { error: "API request failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in Instagram profile route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function transformInsightIQData(data) {
  // Helper function to format numbers for display (e.g., 1.2M instead of 1200000)
  const formatNumber = (num) => {
    if (!num && num !== 0) return "0";
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "m";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return num.toString();
  };

  // Extract main data - based on the API example payload
  const profileData = data.profile || {};
  // Audience can come from multiple places depending on the API version
  let audienceData = (data.profile && data.profile.audience)
    ? data.profile.audience
    : (data.audience || {});

  // Fallback to audience_likers (common in some responses) or audience_likes
  if (!audienceData || Object.keys(audienceData).length === 0) {
    if (data.audience_likers && Object.keys(data.audience_likers).length > 0) {
      audienceData = data.audience_likers;
    } else if (data.audience_likes && Object.keys(data.audience_likes).length > 0) {
      audienceData = data.audience_likes;
    }
  }
  const workPlatform = data.work_platform || {};

  // Extract key metrics
  const followerCount = profileData.follower_count || 0;
  const engagementRate = profileData.engagement_rate || 0;

  // Do not synthesize estimated reach; if API does not provide it, keep blank

  // Extract recent posts data
  const recentPosts = [];
  // Aggregators for recent VIDEO posts
  let videoLikeSum = 0;
  let videoCommentSum = 0;
  let videoCount = 0;
  if (profileData.recent_contents?.length > 0) {
    profileData.recent_contents.forEach((post) => {
      // Count video posts for averages
      if (post?.type === "VIDEO") {
        const likeCount = Number(post?.engagement?.like_count) || 0;
        const commentCount = Number(post?.engagement?.comment_count) || 0;
        videoLikeSum += likeCount;
        videoCommentSum += commentCount;
        videoCount += 1;
      }
      recentPosts.push({
        type: post.type?.toLowerCase() || "image",
        image: post.thumbnail_url,
        caption: post.description,
        likes: post.engagement?.like_count,
        comments: post.engagement?.comment_count,
        views: post.engagement?.play_count,
        date: post.published_at,
        url: post.url,
      });
    });
  }

  // Compute averages for video posts
  const avgVideoLikesRaw = videoCount > 0 ? Math.round(videoLikeSum / videoCount) : null;
  const avgVideoCommentsRaw = videoCount > 0 ? Math.round(videoCommentSum / videoCount) : null;

  // Compute posting frequency in the last 30 days
  let postFrequencyLast30 = null;
  if (profileData.recent_contents?.length > 0) {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    postFrequencyLast30 = profileData.recent_contents.filter((p) => {
      const ts = new Date(p.published_at).getTime();
      return !isNaN(ts) && ts >= cutoff;
    }).length;
  }

  // Generate categories with percentages only when real values exist
  const categories = [];
  if (profileData.top_hashtags?.length > 0) {
    profileData.top_hashtags.forEach((tag, index) => {
      if (index < 4 && typeof tag.value === "number" && tag.value >= 0) {
        categories.push({
          name:
            tag.name.charAt(0).toUpperCase() +
            tag.name.slice(1).replace(/_/g, " "),
          percentage: Math.round(tag.value),
        });
      }
    });
  }

  // Map audience age and gender data
  const ageGenderData = {
    gender: { m: 0, f: 0 }, // Initialize with zeros instead of defaults
    ages: [],
  };

  // Process gender distribution from API
  if (audienceData.gender_distribution) {
    // Extract male and female percentages and convert to decimal (0-1 scale)
    const maleValue =
      audienceData.gender_distribution.find((g) => g.gender === "MALE")
        ?.value || 0;
    const femaleValue =
      audienceData.gender_distribution.find((g) => g.gender === "FEMALE")
        ?.value || 0;

    ageGenderData.gender = {
      m: maleValue / 100,
      f: femaleValue / 100,
    };
  }

  // If gender totals are still zero, derive from gender_age_distribution
  if (
    ageGenderData.gender.m === 0 &&
    ageGenderData.gender.f === 0 &&
    audienceData.gender_age_distribution?.length > 0
  ) {
    let maleTotal = 0;
    let femaleTotal = 0;
    audienceData.gender_age_distribution.forEach((item) => {
      if (item.gender === "MALE") maleTotal += item.value || 0;
      else if (item.gender === "FEMALE") femaleTotal += item.value || 0;
    });
    if (maleTotal + femaleTotal > 0) {
      ageGenderData.gender = {
        m: maleTotal / 100,
        f: femaleTotal / 100,
      };
    }
  }

  // Process audience age and gender distribution if available
  if (audienceData.gender_age_distribution?.length > 0) {
    const processedAges = {};

    // Process API age-gender data into our format
    audienceData.gender_age_distribution.forEach((item) => {
      // Extract age range from the API
      const ageRange = item.age_range;
      let category;

      // Map the age ranges to our categories (support both 13-17 and 13-18)
      if (ageRange === "13-17" || ageRange === "13-18") category = "0_18";
      else if (ageRange === "18-24") category = "18_24";
      else if (ageRange === "25-34") category = "25_34";
      else if (ageRange === "35-44") category = "35_44";
      else if (
        ageRange === "45-54" ||
        ageRange === "55-64" ||
        ageRange === "65+"
      )
        category = "45_100";
      else return; // Skip unknown age groups

      // Initialize the category if not exists
      if (!processedAges[category]) {
        processedAges[category] = { m: 0, f: 0 };
      }

      // Add the percentages (convert from 0-100 to 0-1)
      if (item.gender === "MALE") {
        processedAges[category].m += item.value / 100;
      } else if (item.gender === "FEMALE") {
        processedAges[category].f += item.value / 100;
      }
    });

    // Convert the processed ages object to an array
    if (Object.keys(processedAges).length > 0) {
      ageGenderData.ages = Object.entries(processedAges).map(
        ([category, values]) => ({
          category,
          m: values.m,
          f: values.f,
        })
      );
    }
  }

  // Map countries and cities data
  const countries = [];
  const cities = [];

  // Process countries from the API structure
  if (audienceData.countries?.length > 0) {
    audienceData.countries.forEach((country) => {
      const code = (country.code || "").toUpperCase();
      countries.push({
        name: code, // Use uppercase country code for display
        code: code,
        percent: (country.value || 0) / 100, // Convert from 0-100 to 0-1 scale
      });
    });
  }

  // Process cities from the API structure
  // We'll leave cities as an empty array per requirements
  // This data can be used later if needed
  if (audienceData.cities?.length > 0) {
    audienceData.cities.forEach((city) => {
      cities.push({
        name: city.name,
        percent: city.value / 100,
        lat: city.latitude,
        lng: city.longitude,
      });
    });
  }

  // Process languages from the API structure
  const languages = [];
  if (audienceData.languages?.length > 0) {
    audienceData.languages.forEach((lang) => {
      languages.push({
        name: lang.code, // Language code as name
        code: lang.code,
        percent: lang.value / 100, // Convert from 0-100 to 0-1 scale
      });
    });
  }

  // Process interests from the API
  const interests = [];
  if (audienceData.interests?.length > 0) {
    audienceData.interests.forEach((interest) => {
      interests.push({
        name: interest.name,
        percent: (interest.value || 0) / 100,
      });
    });
  }

  // Process brand mentions from sponsored content
  const brandMentions = [];

  // First try to extract from sponsored content mentions
  if (profileData.sponsored_contents?.length > 0) {
    // Use a set to track unique brands
    const brandSet = new Set();

    profileData.sponsored_contents.forEach((content) => {
      if (content.mentions?.length > 0) {
        content.mentions.forEach((mention) => {
          // Only add unique brands
          if (!brandSet.has(mention.name)) {
            brandSet.add(mention.name);

            brandMentions.push({
              name: mention.name,
              url: `https://instagram.com/${mention.name}`,
              image: `https://via.placeholder.com/50?text=${encodeURIComponent(
                mention.name
              )}`,
            });
          }
        });
      }
    });
  }

  // If no brand mentions found, use top mentions from profile
  if (brandMentions.length === 0 && profileData.top_mentions?.length > 0) {
    profileData.top_mentions.slice(0, 5).forEach((mention) => {
      brandMentions.push({
        name: mention.name,
        url: `https://instagram.com/${mention.name}`,
        image: `https://via.placeholder.com/50?text=${encodeURIComponent(
          mention.name
        )}`,
      });
    });
  }

  // As a final fallback, check for brand_affinity data
  if (brandMentions.length === 0 && audienceData.brand_affinity?.length > 0) {
    audienceData.brand_affinity.slice(0, 5).forEach((brand) => {
      brandMentions.push({
        name: brand.name,
        url: `https://instagram.com/${brand.name
          .toLowerCase()
          .replace(/\s+/g, "")}`,
        image: `https://via.placeholder.com/50?text=${encodeURIComponent(
          brand.name
        )}`,
      });
    });
  }

  // Process growth data from reputation history
  const growthData = { followers: [], engagement: [] };
  if (profileData.reputation_history?.length > 0) {
    profileData.reputation_history.forEach((history) => {
      if (history.month && history.follower_count) {
        // Parse the month (format: '2025-03')
        const date = new Date(history.month + "-01");
        growthData.followers.push({
          date: date.toISOString().split("T")[0],
          value: history.follower_count,
        });

        if (history.average_likes) {
          growthData.engagement.push({
            date: date.toISOString().split("T")[0],
            value: history.average_likes,
          });
        }
      }
    });
  }

  // Return the transformed data
  return {
    username: profileData.platform_username || "",
    name: profileData.full_name || profileData.platform_username || "",
    bio: profileData.introduction || "",
    profilePicture: profileData.image_url || null,
    verified: profileData.is_verified || false,
    influenceScore:
      audienceData.credibility_score !== undefined &&
      audienceData.credibility_score !== null
        ? (audienceData.credibility_score * 10).toFixed(1)
        : null,
    url: profileData.url,
    platform: workPlatform.name || "Instagram",
    platformLogo: workPlatform.logo_url,

    // Metrics
    followers: formatNumber(followerCount),
    followersCount: followerCount,
    following: profileData.following_count || 0,
    engagementRate:
      engagementRate !== undefined && engagementRate !== null
        ? (engagementRate * 100).toFixed(2) + "%"
        : null,
    postsCount: profileData.content_count || 0,
    postFrequency: postFrequencyLast30,
    avgLikes: formatNumber(profileData.average_likes || 0),
    avgComments: formatNumber(profileData.average_comments || 0),
    // UI expects avgVideoViews; map from reels/views as available
    avgVideoViews: formatNumber(
      profileData.average_reels_views || profileData.average_views || 0
    ),
    // Raw numeric values for internal calculations
    avgLikesRaw: profileData.average_likes || null,
    avgCommentsRaw: profileData.average_comments || null,
    avgVideoViewsRaw:
      profileData.average_reels_views || profileData.average_views || null,
    avgVideoLikesRaw: avgVideoLikesRaw,
    avgVideoCommentsRaw: avgVideoCommentsRaw,
    // Keep existing keys for backwards compatibility if referenced elsewhere
    avgReelsViews: formatNumber(profileData.average_reels_views || 0),
    avgViews: formatNumber(profileData.average_views || 0),
    // estimatedReach intentionally omitted (no reliable value in API)
    // Formatted video averages if available
    avgVideoLikes:
      avgVideoLikesRaw !== null ? formatNumber(avgVideoLikesRaw) : null,
    avgVideoComments:
      avgVideoCommentsRaw !== null ? formatNumber(avgVideoCommentsRaw) : null,

    // Content
    recentPosts: recentPosts,
    categories: categories.map((cat) => cat.name),
    categoryPercentages: categories,
    location: profileData.location
      ? {
          city: profileData.location.city || "",
          state: profileData.location.state || "",
          country: profileData.location.country || "",
        }
      : null,

    // Top hashtags and mentions
    topHashtags: profileData.top_hashtags
      ? profileData.top_hashtags.slice(0, 10).map((tag) => ({
          name: tag.name,
          count: tag.value,
        }))
      : [],
    topMentions: profileData.top_mentions
      ? profileData.top_mentions.slice(0, 10).map((mention) => ({
          name: mention.name,
          count: mention.value,
        }))
      : [],

    // Audience
    audience: {
      gender: ageGenderData.gender,
      ages: ageGenderData.ages,
      countries: countries,
      cities: cities,
      states: [], // Leaving states blank as per requirements
      languages: languages,
      interests: interests,
      credibility:
        audienceData.credibility_score !== undefined &&
        audienceData.credibility_score !== null
          ? (audienceData.credibility_score * 100).toFixed(0) + "%"
          : null,
    },

    // Brand mentions
    brandMentions: brandMentions,

    // Growth metrics
    growth: {
      fakeFollowersPct:
        audienceData.credibility_score !== undefined &&
        audienceData.credibility_score !== null
          ? ((1 - audienceData.credibility_score) * 100).toFixed(1)
          : null,
      followerHistory: growthData.followers,
      engagementHistory: growthData.engagement,
    },
  };
}
