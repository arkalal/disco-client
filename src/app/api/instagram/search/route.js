import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Search cache schema
let SearchCache;
try {
  SearchCache = mongoose.model("SearchCache");
} catch {
  const SearchCacheSchema = new mongoose.Schema({
    query: { type: String, required: true, unique: true },
    data: { type: Object, required: true },
    updatedAt: { type: Date, default: Date.now },
  });

  SearchCache = mongoose.model("SearchCache", SearchCacheSchema);
}

export async function GET(request) {
  // Get the search query from URL parameters
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  // Return empty results for empty queries
  if (!query || query.trim().length === 0) {
    return NextResponse.json({ data: [] });
  }

  try {
    console.log("Connecting to database for search...");
    // Direct database connection
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    console.log("Checking for cached search data...");
    // Check if we have cached data less than 6 hours old
    const cachedSearch = await SearchCache.findOne({
      query,
      updatedAt: { $gt: new Date(Date.now() - 6 * 60 * 60 * 1000) }, // 6 hours
    });

    if (cachedSearch) {
      console.log("Returning cached search data");
      return NextResponse.json(cachedSearch.data);
    }

    console.log("Fetching search results from API...");
    // No valid cache, fetch from API
    const apiUrl = `https://instagram-statistics-api.p.rapidapi.com/search?q=${encodeURIComponent(
      query
    )}&page=1&perPage=5&socialTypes=INST`;

    // Log API request details (without sensitive info)
    console.log(`Making search request to: ${apiUrl}`);

    try {
      console.log("API Key present:", !!process.env.RAPIDAPI_KEY);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "x-rapidapi-host": "instagram-statistics-api.p.rapidapi.com",
        },
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

        // Use fallback data for development
        const fallbackData = generateFallbackData(query);
        return NextResponse.json(fallbackData);
      }

      const rawData = await response.json();

      // Process data to match our UI requirements
      const processedData = processSearchResults(rawData);

      // Cache the data
      await SearchCache.findOneAndUpdate(
        { query },
        { data: processedData, updatedAt: new Date() },
        { upsert: true }
      );

      return NextResponse.json(processedData);
    } catch (apiError) {
      console.error("API request failed:", apiError);
      // For development, fall back to demo data
      return NextResponse.json(generateFallbackData(query));
    }
  } catch (error) {
    console.error("Error in Instagram search route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Process the search results to match our UI format
function processSearchResults(rawData) {
  if (!rawData || !rawData.data || !Array.isArray(rawData.data)) {
    return { data: [] };
  }

  const processedResults = rawData.data.map((profile) => ({
    id: profile.cid || `INST:${profile.screenName}`,
    name: profile.name || "",
    username: profile.screenName || "",
    image:
      profile.image ||
      `https://via.placeholder.com/40?text=${encodeURIComponent(
        profile.screenName?.charAt(0) || "?"
      )}`,
    verified: profile.verified || false,
    followers: formatFollowers(profile.usersCount || 0),
    followersCount: profile.usersCount || 0,
    engagementRate: ((profile.avgER || 0) * 100).toFixed(2) + "%",
    category:
      profile.tags && profile.tags.length > 0 ? profile.tags[0] : "influencer",
  }));

  return {
    data: processedResults,
    meta: rawData.meta || { code: 200 },
    pagination: rawData.pagination || { total: processedResults.length },
  };
}

// Format followers count to readable format
function formatFollowers(count) {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + "M";
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + "K";
  }
  return count.toString();
}

// Generate fallback data for development/testing
function generateFallbackData(query) {
  // Define featured influencers as requested by the client
  const featuredInfluencers = [
    {
      id: "INST:dishapatani",
      name: "Disha Patani",
      username: "dishapatani",
      image:
        "https://instagram.fpnq13-1.fna.fbcdn.net/v/t51.2885-19/358829864_1329124541019799_8223809761582188870_n.jpg?stp=dst-jpg_s150x150&_nc_ht=instagram.fpnq13-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=gwJa1dDdevYAX8oaHfj",
      verified: true,
      followers: "54.1M",
      followersCount: 54100000,
      engagementRate: "1.82%",
      category: "entertainment",
    },
    {
      id: "INST:shreyaghoshal",
      name: "Shreya Ghoshal",
      username: "shreyaghoshal",
      image:
        "https://instagram.fpnq13-1.fna.fbcdn.net/v/t51.2885-19/271653271_1188803521530192_5339978536922490664_n.jpg?stp=dst-jpg_s150x150&_nc_ht=instagram.fpnq13-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=VGBMf2TxgXMAX9bccPp",
      verified: true,
      followers: "27.9M",
      followersCount: 27900000,
      engagementRate: "1.25%",
      category: "music",
    },
    {
      id: "INST:anushkasen0408",
      name: "Anushka Sen",
      username: "anushkasen0408",
      image:
        "https://instagram.fpnq13-1.fna.fbcdn.net/v/t51.2885-19/352389908_1337963533518195_1747282549727419475_n.jpg?stp=dst-jpg_s150x150&_nc_ht=instagram.fpnq13-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=CTntxiuyw0gAX80hLiB",
      verified: true,
      followers: "15.2M",
      followersCount: 15200000,
      engagementRate: "2.34%",
      category: "entertainment",
    },
    {
      id: "INST:manushi_chhillar",
      name: "Manushi Chhillar",
      username: "manushi_chhillar",
      image:
        "https://instagram.fpnq13-1.fna.fbcdn.net/v/t51.2885-19/347305477_950551499515575_9174906832820045234_n.jpg?stp=dst-jpg_s150x150&_nc_ht=instagram.fpnq13-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=F06HfuHlLbQAX_fcpam",
      verified: true,
      followers: "6.1M",
      followersCount: 6100000,
      engagementRate: "1.76%",
      category: "entertainment",
    },
    {
      id: "INST:manishmalhotra05",
      name: "Manish Malhotra",
      username: "manishmalhotra05",
      image:
        "https://instagram.fpnq13-1.fna.fbcdn.net/v/t51.2885-19/358080606_300350469257935_3103627363432794776_n.jpg?stp=dst-jpg_s150x150&_nc_ht=instagram.fpnq13-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=L__1nA36PXwAX9wvUmi",
      verified: true,
      followers: "5.3M",
      followersCount: 5300000,
      engagementRate: "0.98%",
      category: "fashion",
    },
  ];

  // Default profiles for other queries
  const defaultProfiles = [
    {
      id: "INST:cristiano",
      name: "Cristiano Ronaldo",
      username: "cristiano",
      image: "https://via.placeholder.com/40?text=CR",
      verified: true,
      followers: "500M",
      followersCount: 500000000,
      engagementRate: "2.5%",
      category: "sports",
    },
    {
      id: "INST:leomessi",
      name: "Leo Messi",
      username: "leomessi",
      image: "https://via.placeholder.com/40?text=LM",
      verified: true,
      followers: "350M",
      followersCount: 350000000,
      engagementRate: "3.2%",
      category: "sports",
    },
    {
      id: "INST:kyliejenner",
      name: "Kylie Jenner",
      username: "kyliejenner",
      image: "https://via.placeholder.com/40?text=KJ",
      verified: true,
      followers: "290M",
      followersCount: 290000000,
      engagementRate: "1.8%",
      category: "fashion",
    },
    {
      id: "INST:selenagomez",
      name: "Selena Gomez",
      username: "selenagomez",
      image: "https://via.placeholder.com/40?text=SG",
      verified: true,
      followers: "270M",
      followersCount: 270000000,
      engagementRate: "2.1%",
      category: "entertainment",
    },
    {
      id: "INST:therock",
      name: "Dwayne Johnson",
      username: "therock",
      image: "https://via.placeholder.com/40?text=DJ",
      verified: true,
      followers: "260M",
      followersCount: 260000000,
      engagementRate: "1.9%",
      category: "entertainment",
    },
  ];

  // Check for featured query
  if (query === "featured" || query === "popular") {
    return {
      data: featuredInfluencers,
      meta: { code: 200 },
      pagination: { total: featuredInfluencers.length },
    };
  }

  // For other queries, use the default profiles and filter by query if provided
  const profiles = defaultProfiles;
  const filteredProfiles = query
    ? profiles.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.username.toLowerCase().includes(query.toLowerCase())
      )
    : profiles;

  return {
    data: filteredProfiles,
    meta: { code: 200 },
    pagination: { total: filteredProfiles.length },
  };
}
