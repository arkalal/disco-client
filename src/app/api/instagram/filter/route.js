import { NextResponse } from "next/server";
// InsightIQ Quick Search integration (no caching)
const INSIGHTIQ_URL =
  "https://api.staging.insightiq.ai/v1/social/creators/profiles/quick-search";
const WORK_PLATFORM_ID = "9bb8913b-ddd9-430b-a66a-d74d846e6c66";
const LOCATION_ID_MAP = {
  india: "8fd1ae5e-87c9-4654-b57d-3d6238d1b0fe",
  "saudi-arabia": "7d4dfa6c-743d-4b52-be3d-05e064421db5",
  "saudi arabia": "7d4dfa6c-743d-4b52-be3d-05e064421db5",
  uae: "9ba395e3-f362-4ba8-b611-e9b7969c0074",
  "united-arab-emirates": "9ba395e3-f362-4ba8-b611-e9b7969c0074",
  "united arab emirates": "9ba395e3-f362-4ba8-b611-e9b7969c0074",
};
const LOCATION_LABEL_MAP = {
  "8fd1ae5e-87c9-4654-b57d-3d6238d1b0fe": "India",
  "7d4dfa6c-743d-4b52-be3d-05e064421db5": "Saudi Arabia",
  "9ba395e3-f362-4ba8-b611-e9b7969c0074": "United Arab Emirates",
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  // Categories from query -> topic_relevance.name (array)
  const rawCategories = (searchParams.get("categories") || "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  const normalizedCategories = rawCategories.map((c) =>
    c.replace(/-/g, " ").replace(/^#/, "").toLowerCase()
  );

  // Location mapping -> UUIDs
  const locationsParam = (searchParams.get("locations") || "")
    .split(",")
    .map((l) => l.trim().toLowerCase())
    .filter(Boolean);
  const creatorLocations = locationsParam
    .map((loc) => LOCATION_ID_MAP[loc])
    .filter(Boolean);

  // Gender mapping m/f -> MALE/FEMALE
  const genderParam = (searchParams.get("genders") || "").trim().toLowerCase();
  const creatorGender =
    genderParam === "m" ? "MALE" : genderParam === "f" ? "FEMALE" : undefined;

  // Followers range
  const minFollowers = searchParams.get("minFollowers") || "";
  const maxFollowers = searchParams.get("maxFollowers") || "";

  // Build InsightIQ payload
  const payload = {
    sort_by: { field: "FOLLOWER_COUNT", order: "DESCENDING" },
    limit: 1, // keep 1 to preserve credits
    offset: 0, // no pagination
    work_platform_id: WORK_PLATFORM_ID,
  };
  if (normalizedCategories.length > 0) {
    payload.topic_relevance = { name: normalizedCategories };
  }
  if (creatorGender) {
    payload.creator_gender = creatorGender;
  }
  if (creatorLocations.length > 0) {
    payload.creator_locations = creatorLocations;
  }
  if (
    (minFollowers && minFollowers !== "0") ||
    (maxFollowers && maxFollowers !== "0")
  ) {
    payload.follower_count = {};
    if (minFollowers && minFollowers !== "0")
      payload.follower_count.min = String(minFollowers);
    if (maxFollowers && maxFollowers !== "0")
      payload.follower_count.max = String(maxFollowers);
  }

  const authHeader =
    process.env.INSIGHTIQ_BASIC_AUTH ||
    "Basic NGY2ZmU2YzEtNjBlZi00MjE5LTlmODItM2NkOWZjMWJmN2NlOmRiNDZjM2JjLWQ0NWEtNDk4Ni05NWI1LWUxMzcxMjQ0YWVkNw==";

  try {
    const response = await fetch(INSIGHTIQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { data: [], error: `Upstream error ${response.status}`, details: text },
        { status: response.status }
      );
    }

    const json = await response.json();

    const selectedLocationLabel =
      (creatorLocations[0] && LOCATION_LABEL_MAP[creatorLocations[0]]) ||
      undefined;

    const processed = processFilterResults(
      json?.data || [],
      selectedLocationLabel
    );

    return NextResponse.json({
      data: processed,
      metadata: json?.metadata || null,
    });
  } catch (error) {
    console.error("InsightIQ request failed:", error);
    return NextResponse.json(
      { data: [], error: error.message },
      { status: 500 }
    );
  }
}

// Process the filter results to match our UI format
function processFilterResults(items, selectedLocationLabel) {
  if (!Array.isArray(items)) return [];

  return items.map((profile) => {
    const topicNames =
      profile?.filter_match?.topic_relevance?.name &&
      Array.isArray(profile.filter_match.topic_relevance.name)
        ? profile.filter_match.topic_relevance.name
        : [];

    const cleanCategories = topicNames
      .map((n) => (typeof n === "string" ? n.replace(/^#/, "") : ""))
      .filter(Boolean)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1));

    const username = profile?.platform_username || "";

    return {
      id:
        profile?.external_id ||
        username ||
        `tmp_${Math.random().toString(36).slice(2, 10)}`,
      name: profile?.full_name || "",
      username,
      handle: username ? `@${username}` : "",
      profileImg:
        profile?.image_url ||
        `https://via.placeholder.com/50?text=${encodeURIComponent(
          (username || "?").charAt(0).toUpperCase()
        )}`,
      verified: !!profile?.is_verified,
      followers: formatFollowers(profile?.follower_count || 0),
      followersCount: profile?.follower_count || 0,
      influenceScore: "", // not provided by API
      avgLikes:
        profile?.average_likes != null
          ? formatNumber(profile.average_likes)
          : "",
      avgReelViews: "UNLOCK", // not provided
      er:
        profile?.engagement_rate != null
          ? (profile.engagement_rate * 100).toFixed(2) + "%"
          : "",
      location: selectedLocationLabel || "UNLOCK",
      categories: cleanCategories.slice(0, 3),
      moreCategories: Math.max(0, cleanCategories.length - 3),
      rawData: profile,
    };
  });
}

// Helper function to get the most relevant location
// Old location helpers removed; not needed in InsightIQ flow

// Format followers count to readable format
function formatFollowers(count) {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + "M";
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + "K";
  }
  return count.toString();
}

// Format numbers for better readability
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

// Generate fallback data for development/testing
// Old fallback/mock data removed entirely to ensure all data is dynamic from API
