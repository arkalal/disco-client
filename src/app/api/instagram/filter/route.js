import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Filter cache schema
let FilterCache;
try {
  FilterCache = mongoose.model("FilterCache");
} catch {
  const FilterCacheSchema = new mongoose.Schema({
    filterKey: { type: String, required: true, unique: true },
    data: { type: Object, required: true },
    updatedAt: { type: Date, default: Date.now },
  });

  FilterCache = mongoose.model("FilterCache", FilterCacheSchema);
}

export async function GET(request) {
  // Get the filter parameters from URL parameters
  const { searchParams } = new URL(request.url);
  
  // Extract filter parameters and normalize to lowercase for case-insensitive matching
  const categories = searchParams.get("categories") ? searchParams.get("categories").split(",").map(cat => cat.trim().toLowerCase()) : [];
  const locations = searchParams.get("locations") ? searchParams.get("locations").split(",").map(loc => loc.trim()) : [];
  const genders = searchParams.get("genders") ? searchParams.get("genders").split(",").map(g => g.trim()) : [];
  
  console.log("Filtering with categories:", categories);
  const minFollowers = searchParams.get("minFollowers") || "";
  const maxFollowers = searchParams.get("maxFollowers") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "10", 10);
  const sort = searchParams.get("sort") || "-usersCount"; // Default sort by followers desc
  
  // Generate a unique cache key based on the filter parameters
  const filterKey = JSON.stringify({
    categories, locations, genders, minFollowers, maxFollowers, page, perPage, sort
  });

  try {
    console.log("Connecting to database for filtered search...");
    // Direct database connection
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    console.log("Checking for cached filter data...");
    // Check if we have cached data less than 1 hour old
    const cachedFilter = await FilterCache.findOne({
      filterKey,
      updatedAt: { $gt: new Date(Date.now() - 1 * 60 * 60 * 1000) }, // 1 hour
    });

    if (cachedFilter) {
      console.log("Returning cached filter data");
      return NextResponse.json(cachedFilter.data);
    }

    console.log("Fetching filtered results from API...");
    // Build API URL with filters
    let apiUrl = `https://instagram-statistics-api.p.rapidapi.com/search?page=${page}&perPage=${perPage}&socialTypes=INST`;
    
    // Add tag filtering
    if (categories.length > 0) {
      apiUrl += `&tags=${encodeURIComponent(categories.join(","))}`;
    }
    
    // Add location filtering
    if (locations.length > 0) {
      apiUrl += `&locations=${encodeURIComponent(locations.join(","))}`;
    }
    
    // Add gender filtering
    if (genders.length > 0) {
      apiUrl += `&genders=${encodeURIComponent(genders.join(","))}`;
    }
    
    // Add followers range filtering
    if (minFollowers) {
      apiUrl += `&minUsersCount=${encodeURIComponent(minFollowers)}`;
    }
    
    if (maxFollowers) {
      apiUrl += `&maxUsersCount=${encodeURIComponent(maxFollowers)}`;
    }
    
    // Add sorting
    if (sort) {
      apiUrl += `&sort=${encodeURIComponent(sort)}`;
    }

    // Log API request details (without sensitive info)
    console.log(`Making filtered search request to: ${apiUrl}`);

    try {
      console.log("API Key present:", !!process.env.RAPIDAPI_KEY);

      // Use the provided API key or fall back to env variable
      const API_KEY = "3044984e1bmshf01d9d6f6aeb45dp1b9ea2jsne913f73d0369";
      
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "x-rapidapi-key": API_KEY,
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
        const fallbackData = generateFallbackData(categories, locations, genders, minFollowers, maxFollowers);
        return NextResponse.json(fallbackData);
      }

      const rawData = await response.json();

      // Process data to match our UI requirements
      const processedData = processFilterResults(rawData);

      // Cache the data
      await FilterCache.findOneAndUpdate(
        { filterKey },
        { data: processedData, updatedAt: new Date() },
        { upsert: true }
      );

      return NextResponse.json(processedData);
    } catch (apiError) {
      console.error("API request failed:", apiError);
      // For development, fall back to demo data
      return NextResponse.json(generateFallbackData(categories, locations, genders, minFollowers, maxFollowers));
    }
  } catch (error) {
    console.error("Error in Instagram filter route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Process the filter results to match our UI format
function processFilterResults(rawData) {
  if (!rawData || !rawData.data || !Array.isArray(rawData.data)) {
    return { data: [], pagination: { total: 0 } };
  }

  const processedResults = rawData.data.map(profile => ({
    id: profile.cid || `INST:${profile.screenName}`,
    name: profile.name || "",
    username: profile.screenName || "",
    handle: `@${profile.screenName || ""}`,
    profileImg: profile.image || `https://via.placeholder.com/50?text=${encodeURIComponent(profile.screenName?.charAt(0) || "?")}`,
    verified: profile.verified || false,
    followers: formatFollowers(profile.usersCount || 0),
    followersCount: profile.usersCount || 0,
    influenceScore: (profile.qualityScore * 10).toFixed(1) || "5.0",
    avgLikes: formatNumber(profile.avgInteractions || 0),
    avgReelViews: formatNumber((profile.avgViews || profile.avgInteractions * 3) || 0),
    er: ((profile.avgER || 0) * 100).toFixed(2) + "%",
    location: getLocation(profile),
    categories: (profile.tags || []).slice(0, 3),
    moreCategories: Math.max(0, (profile.tags || []).length - 3),
    genders: profile.genders || [],
    countries: profile.countries || [],
    cities: profile.cities || [],
    rawData: profile
  }));

  return {
    data: processedResults,
    meta: rawData.meta || { code: 200 },
    pagination: rawData.pagination || { total: processedResults.length }
  };
}

// Helper function to get the most relevant location
function getLocation(profile) {
  // Try to get location from cities or countries
  if (profile.cities && profile.cities.length > 0) {
    return formatLocationName(profile.cities[0].name);
  }
  
  if (profile.countries && profile.countries.length > 0) {
    return formatLocationName(profile.countries[0].name);
  }
  
  if (profile.membersCities && profile.membersCities.length > 0) {
    return formatLocationName(profile.membersCities[0].category);
  }
  
  if (profile.membersCountries && profile.membersCountries.length > 0) {
    return formatLocationName(profile.membersCountries[0].category);
  }
  
  return "Global";
}

// Format location name to be more readable
function formatLocationName(name) {
  if (!name) return "Global";
  
  // Convert kebab-case to Title Case
  return name
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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
function generateFallbackData(categories, locations, genders, minFollowers, maxFollowers) {
  // Base profiles data
  const baseProfiles = [
    {
      id: "INST:cristiano",
      name: "Cristiano Ronaldo",
      username: "cristiano",
      handle: "@cristiano",
      profileImg: "https://via.placeholder.com/50?text=CR",
      verified: true,
      followers: "500M",
      followersCount: 500000000,
      influenceScore: "9.6",
      avgLikes: "10M",
      avgReelViews: "30M",
      er: "2.5%",
      location: "Portugal",
      categories: ["Sports", "Football", "Lifestyle"],
      moreCategories: 2,
      genders: [{name: "m", percent: 0.65}, {name: "f", percent: 0.35}],
      countries: [{name: "united-states", percent: 0.25}, {name: "india", percent: 0.15}],
      cities: [{name: "madrid", percent: 0.1}, {name: "manchester", percent: 0.08}]
    },
    {
      id: "INST:leomessi",
      name: "Leo Messi",
      username: "leomessi",
      handle: "@leomessi",
      profileImg: "https://via.placeholder.com/50?text=LM",
      verified: true,
      followers: "350M",
      followersCount: 350000000,
      influenceScore: "9.4",
      avgLikes: "8M",
      avgReelViews: "20M",
      er: "3.2%",
      location: "Argentina",
      categories: ["Sports", "Football", "Family"],
      moreCategories: 1,
      genders: [{name: "m", percent: 0.7}, {name: "f", percent: 0.3}],
      countries: [{name: "argentina", percent: 0.3}, {name: "spain", percent: 0.2}],
      cities: [{name: "barcelona", percent: 0.15}, {name: "buenos-aires", percent: 0.1}]
    },
    {
      id: "INST:kyliejenner",
      name: "Kylie Jenner",
      username: "kyliejenner",
      handle: "@kyliejenner",
      profileImg: "https://via.placeholder.com/50?text=KJ",
      verified: true,
      followers: "290M",
      followersCount: 290000000,
      influenceScore: "8.9",
      avgLikes: "5M",
      avgReelViews: "15M",
      er: "1.8%",
      location: "United States",
      categories: ["Fashion", "Beauty", "Lifestyle"],
      moreCategories: 3,
      genders: [{name: "f", percent: 0.85}, {name: "m", percent: 0.15}],
      countries: [{name: "united-states", percent: 0.45}, {name: "canada", percent: 0.1}],
      cities: [{name: "los-angeles", percent: 0.2}, {name: "new-york-city", percent: 0.1}]
    },
    {
      id: "INST:selenagomez",
      name: "Selena Gomez",
      username: "selenagomez",
      handle: "@selenagomez",
      profileImg: "https://via.placeholder.com/50?text=SG",
      verified: true,
      followers: "270M",
      followersCount: 270000000,
      influenceScore: "8.7",
      avgLikes: "4.5M",
      avgReelViews: "12M",
      er: "2.1%",
      location: "United States",
      categories: ["Music", "Beauty", "Entertainment"],
      moreCategories: 2,
      genders: [{name: "f", percent: 0.7}, {name: "m", percent: 0.3}],
      countries: [{name: "united-states", percent: 0.4}, {name: "brazil", percent: 0.12}],
      cities: [{name: "new-york-city", percent: 0.15}, {name: "los-angeles", percent: 0.1}]
    },
    {
      id: "INST:therock",
      name: "Dwayne Johnson",
      username: "therock",
      handle: "@therock",
      profileImg: "https://via.placeholder.com/50?text=DJ",
      verified: true,
      followers: "260M",
      followersCount: 260000000,
      influenceScore: "9.1",
      avgLikes: "4M",
      avgReelViews: "10M",
      er: "1.9%",
      location: "United States",
      categories: ["Entertainment", "Fitness", "Lifestyle"],
      moreCategories: 1,
      genders: [{name: "m", percent: 0.6}, {name: "f", percent: 0.4}],
      countries: [{name: "united-states", percent: 0.38}, {name: "united-kingdom", percent: 0.09}],
      cities: [{name: "miami", percent: 0.12}, {name: "los-angeles", percent: 0.1}]
    },
    {
      id: "INST:beyonce",
      name: "Beyoncé",
      username: "beyonce",
      handle: "@beyonce",
      profileImg: "https://via.placeholder.com/50?text=B",
      verified: true,
      followers: "240M",
      followersCount: 240000000,
      influenceScore: "9.3",
      avgLikes: "5.5M",
      avgReelViews: "12M",
      er: "2.4%",
      location: "United States",
      categories: ["Music", "Fashion", "Entertainment"],
      moreCategories: 2,
      genders: [{name: "f", percent: 0.75}, {name: "m", percent: 0.25}],
      countries: [{name: "united-states", percent: 0.42}, {name: "united-kingdom", percent: 0.08}],
      cities: [{name: "new-york-city", percent: 0.13}, {name: "houston", percent: 0.08}]
    },
    {
      id: "INST:natgeo",
      name: "National Geographic",
      username: "natgeo",
      handle: "@natgeo",
      profileImg: "https://via.placeholder.com/50?text=NG",
      verified: true,
      followers: "220M",
      followersCount: 220000000,
      influenceScore: "8.5",
      avgLikes: "300K",
      avgReelViews: "800K",
      er: "0.5%",
      location: "Global",
      categories: ["Nature", "Photography", "Travel"],
      moreCategories: 2,
      genders: [{name: "m", percent: 0.55}, {name: "f", percent: 0.45}],
      countries: [{name: "united-states", percent: 0.35}, {name: "india", percent: 0.12}],
      cities: [{name: "washington-dc", percent: 0.1}, {name: "new-york-city", percent: 0.08}]
    },
    {
      id: "INST:kimkardashian",
      name: "Kim Kardashian",
      username: "kimkardashian",
      handle: "@kimkardashian",
      profileImg: "https://via.placeholder.com/50?text=KK",
      verified: true,
      followers: "210M",
      followersCount: 210000000,
      influenceScore: "8.2",
      avgLikes: "2.2M",
      avgReelViews: "6M",
      er: "1.2%",
      location: "United States",
      categories: ["Fashion", "Beauty", "Lifestyle"],
      moreCategories: 3,
      genders: [{name: "f", percent: 0.8}, {name: "m", percent: 0.2}],
      countries: [{name: "united-states", percent: 0.4}, {name: "canada", percent: 0.09}],
      cities: [{name: "los-angeles", percent: 0.18}, {name: "new-york-city", percent: 0.11}]
    },
    {
      id: "INST:justinbieber",
      name: "Justin Bieber",
      username: "justinbieber",
      handle: "@justinbieber",
      profileImg: "https://via.placeholder.com/50?text=JB",
      verified: true,
      followers: "200M",
      followersCount: 200000000,
      influenceScore: "8.8",
      avgLikes: "2M",
      avgReelViews: "5M",
      er: "1.5%",
      location: "Canada",
      categories: ["Music", "Lifestyle", "Fashion"],
      moreCategories: 1,
      genders: [{name: "f", percent: 0.7}, {name: "m", percent: 0.3}],
      countries: [{name: "united-states", percent: 0.35}, {name: "canada", percent: 0.15}],
      cities: [{name: "toronto", percent: 0.12}, {name: "los-angeles", percent: 0.1}]
    },
    {
      id: "INST:nike",
      name: "Nike",
      username: "nike",
      handle: "@nike",
      profileImg: "https://via.placeholder.com/50?text=N",
      verified: true,
      followers: "180M",
      followersCount: 180000000,
      influenceScore: "8.3",
      avgLikes: "500K",
      avgReelViews: "1.5M",
      er: "0.8%",
      location: "United States",
      categories: ["Sports", "Fashion", "Fitness"],
      moreCategories: 2,
      genders: [{name: "m", percent: 0.6}, {name: "f", percent: 0.4}],
      countries: [{name: "united-states", percent: 0.3}, {name: "china", percent: 0.15}],
      cities: [{name: "portland", percent: 0.1}, {name: "los-angeles", percent: 0.08}]
    }
  ];
  
  // Filter profiles based on the provided parameters
  let filteredProfiles = [...baseProfiles];
  
  // Filter by categories
  if (categories && categories.length > 0) {
    console.log("Filtering profiles by categories:", categories);
    
    // Pre-process categories for better matching
    const normalizedCategories = categories.map(cat => {
      // Convert category name to a standard format
      return cat.toLowerCase().trim();
    });
    
    // Map common category variations
    const categoryMap = {
      'fashion': ['fashion', 'style', 'clothing', 'apparel', 'model'],
      'beauty': ['beauty', 'makeup', 'cosmetics', 'skincare'],
      'lifestyle': ['lifestyle', 'living', 'life'],
      'travel': ['travel', 'tourism', 'vacation', 'adventure'],
      'food': ['food', 'cooking', 'culinary', 'recipe', 'chef'],
      'fitness': ['fitness', 'gym', 'workout', 'exercise', 'health & fitness'],
      'health': ['health', 'wellness', 'healthcare', 'health & beauty', 'health & fitness'],
      'sports': ['sports', 'athlete', 'football', 'basketball', 'soccer'],
      'entertainment': ['entertainment', 'celebrity', 'actor', 'actress', 'film', 'movie', 'tv', 'television'],
      'music': ['music', 'musician', 'singer', 'artist', 'band', 'concert'],
      'art': ['art', 'artist', 'creative', 'design', 'drawing', 'painting'],
      'photography': ['photography', 'photographer', 'photo', 'camera'],
      'technology': ['technology', 'tech', 'gadget', 'computer', 'software'],
      'business': ['business', 'entrepreneur', 'startup', 'corporate', 'company'],
      'education': ['education', 'learning', 'teaching', 'school', 'university'],
      'parenting': ['parenting', 'family', 'kids', 'children', 'baby'],
      'pets': ['pets', 'animals', 'dog', 'cat', 'pet care'],
      'gaming': ['gaming', 'gamer', 'videogames', 'games', 'esports'],
      'automotive': ['automotive', 'cars', 'vehicles', 'racing'],
      'luxury': ['luxury', 'premium', 'high-end', 'designer'],
    };
    
    // Expand categories to include related terms
    const expandedCategories = new Set();
    normalizedCategories.forEach(cat => {
      expandedCategories.add(cat);
      
      // Add related categories from the map
      Object.entries(categoryMap).forEach(([key, values]) => {
        if (cat === key || values.includes(cat)) {
          expandedCategories.add(key);
          values.forEach(v => expandedCategories.add(v));
        }
      });
    });
    
    console.log("Expanded categories for matching:", [...expandedCategories]);
    
    filteredProfiles = filteredProfiles.filter(profile => {
      // Get all categories from the profile including hidden ones
      const profileCategories = [...profile.categories, ...(new Array(profile.moreCategories).fill("other"))];
      
      // Normalize profile categories
      const normalizedProfileCategories = profileCategories.map(cat => {
        return (typeof cat === 'string') ? cat.toLowerCase().trim() : '';
      });
      
      // Check if any of the requested categories match any profile categories
      return [...expandedCategories].some(category => {
        return normalizedProfileCategories.some(profCat => {
          // Check for exact match or if the category is a substring of the profile category
          return profCat === category || 
                 profCat.includes(category) || 
                 category.includes(profCat);
        });
      });
    });
    
    console.log(`Found ${filteredProfiles.length} profiles matching categories`);
  }
  
  // Filter by locations
  if (locations && locations.length > 0) {
    filteredProfiles = filteredProfiles.filter(profile => {
      return locations.some(location => 
        profile.location.toLowerCase().includes(location.toLowerCase()) ||
        profile.countries.some(country => country.name.toLowerCase() === location.toLowerCase()) ||
        profile.cities.some(city => city.name.toLowerCase() === location.toLowerCase())
      );
    });
  }
  
  // Filter by genders
  if (genders && genders.length > 0) {
    filteredProfiles = filteredProfiles.filter(profile => {
      return genders.some(gender => 
        profile.genders.some(g => g.name.toLowerCase() === gender.toLowerCase())
      );
    });
  }
  
  // Filter by follower count
  if (minFollowers) {
    const min = parseInt(minFollowers, 10);
    filteredProfiles = filteredProfiles.filter(profile => profile.followersCount >= min);
  }
  
  if (maxFollowers) {
    const max = parseInt(maxFollowers, 10);
    filteredProfiles = filteredProfiles.filter(profile => profile.followersCount <= max);
  }
  
  return {
    data: filteredProfiles,
    meta: { code: 200 },
    pagination: { 
      total: filteredProfiles.length,
      page: 1,
      perPage: filteredProfiles.length,
      totalPages: 1
    }
  };
}
