import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Profile cache schema
let ProfileCache;
try {
  ProfileCache = mongoose.model("ProfileCache");
} catch {
  const ProfileCacheSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    data: { type: Object, required: true },
    updatedAt: { type: Date, default: Date.now },
  });

  ProfileCache = mongoose.model("ProfileCache", ProfileCacheSchema);
}

export async function GET(request, { params }) {
  // Properly await params before accessing properties
  const resolvedParams = await Promise.resolve(params);
  const username = resolvedParams.username;

  // For testing without API, use static data
  if (username === "demouser") {
    return NextResponse.json(generateDemoData(username));
  }

  try {
    console.log("Connecting to database...");
    // Direct database connection without the utility
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    console.log("Checking for cached data...");
    // Check if we have cached data less than 24 hours old
    const cachedProfile = await ProfileCache.findOne({
      username,
      updatedAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // 24 hours
    });

    if (cachedProfile) {
      console.log("Returning cached profile data");
      return NextResponse.json(cachedProfile.data);
    }

    console.log("Fetching from API...");
    // No valid cache, fetch from API
    const encodedUrl = encodeURIComponent(
      `https://www.instagram.com/${username}/`
    );
    const apiUrl = `https://instagram-statistics-api.p.rapidapi.com/community?url=${encodedUrl}`;

    // Log API request details (without sensitive info)
    console.log(`Making request to: ${apiUrl}`);

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

        // Always use demo data for now while we debug API issues
        console.log("Using demo data instead");
        const demoData = generateDemoData(username);
        return NextResponse.json(demoData);
      }

      const rawData = await response.json();

      // Process data to match our UI requirements
      const profileData = transformProfileData(rawData.data);

      // Cache the data
      await ProfileCache.findOneAndUpdate(
        { username },
        { data: profileData, updatedAt: new Date() },
        { upsert: true }
      );

      return NextResponse.json(profileData);
    } catch (apiError) {
      console.error("API request failed:", apiError);
      // For development, fall back to demo data
      return NextResponse.json(generateDemoData(username));
    }
  } catch (error) {
    console.error("Error in Instagram profile route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Generate demo data for development/testing
function generateDemoData(username) {
  return {
    username: username,
    name:
      username === "srkkingk555"
        ? "Shah Rukh Khan"
        : `${username.charAt(0).toUpperCase()}${username.slice(1)}`,
    bio: "This is a demo profile with static data for development purposes.",
    profilePicture: "https://via.placeholder.com/150",
    verified: true,
    influenceScore: "7.88",

    // Metrics
    followers: "1.2m",
    followersCount: 1200000,
    engagementRate: "1.33%",
    avgLikes: "17.7k",
    avgComments: "104",
    estimatedReach: "174.7k",

    // Content
    recentPosts: [],
    categories: ["Entertainment", "Movies", "Celebrities", "Acting"],

    // Audience
    audience: {
      gender: { m: 0.65, f: 0.35 },
      ages: [
        { category: "0_18", m: 0.07, f: 0.06 },
        { category: "18_24", m: 0.15, f: 0.12 },
        { category: "25_34", m: 0.25, f: 0.15 },
        { category: "35_44", m: 0.12, f: 0.04 },
        { category: "45_100", m: 0.06, f: 0.02 },
      ],
      countries: [
        { name: "India", percent: 0.35 },
        { name: "United States", percent: 0.15 },
        { name: "United Kingdom", percent: 0.08 },
        { name: "Australia", percent: 0.06 },
        { name: "Canada", percent: 0.05 },
        { name: "Germany", percent: 0.04 },
        { name: "France", percent: 0.03 },
        { name: "Brazil", percent: 0.03 },
        { name: "Japan", percent: 0.02 },
        { name: "Spain", percent: 0.02 },
      ],
      cities: [
        { name: "Mumbai", percent: 0.12 },
        { name: "Delhi", percent: 0.08 },
        { name: "New York", percent: 0.05 },
        { name: "Bangalore", percent: 0.04 },
        { name: "London", percent: 0.04 },
        { name: "Chennai", percent: 0.03 },
        { name: "Kolkata", percent: 0.03 },
        { name: "Los Angeles", percent: 0.02 },
        { name: "Sydney", percent: 0.02 },
        { name: "Toronto", percent: 0.02 },
      ],
      states: [
        { name: "Maharashtra", percent: 0.2 },
        { name: "Delhi", percent: 0.12 },
        { name: "Karnataka", percent: 0.1 },
        { name: "Tamil Nadu", percent: 0.08 },
        { name: "West Bengal", percent: 0.07 },
        { name: "California", percent: 0.06 },
        { name: "New York", percent: 0.05 },
        { name: "Gujarat", percent: 0.04 },
        { name: "Uttar Pradesh", percent: 0.03 },
        { name: "Telangana", percent: 0.02 },
      ],
      languages: [
        { name: "English", percent: 0.55 },
        { name: "Hindi", percent: 0.18 },
        { name: "Spanish", percent: 0.08 },
        { name: "French", percent: 0.05 },
        { name: "German", percent: 0.04 },
        { name: "Bengali", percent: 0.03 },
        { name: "Tamil", percent: 0.02 },
        { name: "Marathi", percent: 0.02 },
        { name: "Telugu", percent: 0.01 },
        { name: "Kannada", percent: 0.01 },
      ],
      interests: [
        { name: "Entertainment", percent: 0.25 },
        { name: "Movies & Cinema", percent: 0.2 },
        { name: "Fashion & Style", percent: 0.15 },
        { name: "Music", percent: 0.12 },
        { name: "Travel & Adventure", percent: 0.08 },
        { name: "Food & Dining", percent: 0.06 },
        { name: "Health & Fitness", percent: 0.05 },
        { name: "Technology", percent: 0.04 },
        { name: "Sports", percent: 0.03 },
        { name: "Art & Culture", percent: 0.02 },
      ],
      credibility: "68.75%",
    },

    // Brand mentions
    brandMentions: [
      {
        name: "Netflix India",
        url: "https://instagram.com/netflix_in",
        image: "https://via.placeholder.com/50?text=Netflix",
      },
      {
        name: "Indian Super League",
        url: "https://instagram.com/indiansuperleague",
        image: "https://via.placeholder.com/50?text=ISL",
      },
    ],

    // Growth metrics
    growth: {
      reachability: [
        { name: "r0_500", percent: 0.55 },
        { name: "r500_1000", percent: 0.2 },
        { name: "r1000_1500", percent: 0.15 },
        { name: "r1500_plus", percent: 0.1 },
      ],
      fakeFollowersPct: 0.15,
    },
  };
}

function transformProfileData(data) {
  // Format numbers for display (e.g., 1.2M instead of 1200000)
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "m";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return num.toString();
  };

  // Calculate estimated reach (usually 10-30% of followers)
  const estimatedReach = Math.round(data.usersCount * 0.14);

  // Extract main categories from tags
  const categories =
    data.categories ||
    data.tags?.slice(0, 4).map((tag) => tag.replace(/-/g, " ")) ||
    [];

  // Process brand mentions and replace potentially problematic image URLs
  const processBrandMentions = (mentions) => {
    if (!mentions || !Array.isArray(mentions)) return [];

    return mentions.map((mention) => {
      // Replace external images with placeholder
      return {
        ...mention,
        image: mention.image
          ? `https://via.placeholder.com/50?text=${encodeURIComponent(
              mention.name || "Brand"
            )}`
          : `https://via.placeholder.com/50?text=Brand`,
      };
    });
  };

  // Process cities data properly
  const processCities = (cities) => {
    if (!cities || !Array.isArray(cities)) return [];

    return cities
      .map((city) => ({
        name: city.name || city.category,
        percent: city.value || city.percent || 0,
      }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 10);
  };

  // Process countries data properly
  const processCountries = (countries) => {
    if (!countries || !Array.isArray(countries)) return [];

    return countries
      .map((country) => ({
        name: country.name || country.category,
        percent: country.value || country.percent || 0,
      }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 10);
  };

  // Derive states based on country and city information
  // This is a fallback when states aren't provided directly
  const deriveStates = (countries, cities) => {
    // Map of countries to their major states/regions with cities
    const countryStatesMap = {
      India: [
        { name: "Maharashtra", cities: ["Mumbai", "Pune"], percent: 0.2 },
        { name: "Delhi", cities: ["Delhi", "New Delhi"], percent: 0.12 },
        { name: "Karnataka", cities: ["Bengaluru", "Bangalore"], percent: 0.1 },
        { name: "Tamil Nadu", cities: ["Chennai"], percent: 0.08 },
        { name: "West Bengal", cities: ["Kolkata"], percent: 0.07 },
        { name: "Gujarat", cities: ["Ahmedabad", "Surat"], percent: 0.04 },
        { name: "Uttar Pradesh", cities: ["Lucknow", "Agra"], percent: 0.03 },
        { name: "Telangana", cities: ["Hyderabad"], percent: 0.02 },
      ],
      "United States": [
        {
          name: "California",
          cities: ["Los Angeles", "San Francisco"],
          percent: 0.06,
        },
        { name: "New York", cities: ["New York City"], percent: 0.05 },
        { name: "Texas", cities: ["Houston", "Dallas"], percent: 0.04 },
        { name: "Florida", cities: ["Miami", "Orlando"], percent: 0.03 },
        { name: "Illinois", cities: ["Chicago"], percent: 0.02 },
      ],
      "United Kingdom": [
        { name: "Greater London", cities: ["London"], percent: 0.04 },
        { name: "West Midlands", cities: ["Birmingham"], percent: 0.03 },
        { name: "Greater Manchester", cities: ["Manchester"], percent: 0.02 },
      ],
    };

    // Create a list of states based on the countries in the data
    let states = [];

    // Try to map cities to states
    const highestCountry =
      countries && countries.length > 0 ? countries[0].name : null;
    if (highestCountry && countryStatesMap[highestCountry]) {
      states = countryStatesMap[highestCountry];

      // Adjust percentages based on city data if available
      if (cities && cities.length > 0) {
        const cityNames = cities.map((c) => c.name);
        states.forEach((state) => {
          // Check if any cities in this state are in our city data
          const matchingCities = state.cities.filter((c) =>
            cityNames.includes(c)
          );
          if (matchingCities.length > 0) {
            // Increase this state's percentage
            state.percent = Math.min(state.percent * 1.5, 1.0);
          }
        });
      }
    } else {
      // Fallback - create generic states with scaled percentages
      states = [
        { name: "State 1", percent: 0.25 },
        { name: "State 2", percent: 0.2 },
        { name: "State 3", percent: 0.15 },
        { name: "State 4", percent: 0.1 },
        { name: "State 5", percent: 0.08 },
        { name: "State 6", percent: 0.07 },
        { name: "State 7", percent: 0.05 },
        { name: "State 8", percent: 0.04 },
        { name: "State 9", percent: 0.03 },
        { name: "State 10", percent: 0.03 },
      ];
    }

    // Sort and limit to 10
    return states.sort((a, b) => b.percent - a.percent).slice(0, 10);
  };

  // Derive languages based on countries
  const deriveLanguages = (countries) => {
    // Map of common languages by country
    const countryLanguageMap = {
      India: [
        { name: "English", percent: 0.4 },
        { name: "Hindi", percent: 0.3 },
        { name: "Bengali", percent: 0.08 },
        { name: "Telugu", percent: 0.07 },
        { name: "Marathi", percent: 0.07 },
        { name: "Tamil", percent: 0.06 },
        { name: "Urdu", percent: 0.05 },
      ],
      "United States": [
        { name: "English", percent: 0.78 },
        { name: "Spanish", percent: 0.16 },
        { name: "Chinese", percent: 0.03 },
        { name: "French", percent: 0.01 },
        { name: "Vietnamese", percent: 0.01 },
      ],
      "United Kingdom": [
        { name: "English", percent: 0.92 },
        { name: "Polish", percent: 0.02 },
        { name: "Punjabi", percent: 0.01 },
        { name: "Urdu", percent: 0.01 },
        { name: "Bengali", percent: 0.01 },
      ],
      Indonesia: [
        { name: "Indonesian", percent: 0.8 },
        { name: "Javanese", percent: 0.1 },
        { name: "English", percent: 0.05 },
        { name: "Sundanese", percent: 0.03 },
        { name: "Balinese", percent: 0.02 },
      ],
    };

    // Start with default English-dominant profile
    let languages = [
      { name: "English", percent: 0.55 },
      { name: "Spanish", percent: 0.1 },
      { name: "French", percent: 0.08 },
      { name: "German", percent: 0.07 },
      { name: "Portuguese", percent: 0.05 },
      { name: "Russian", percent: 0.05 },
      { name: "Japanese", percent: 0.04 },
      { name: "Arabic", percent: 0.03 },
      { name: "Hindi", percent: 0.02 },
      { name: "Chinese", percent: 0.01 },
    ];

    // If we have country data, create weighted language distribution
    if (countries && countries.length > 0) {
      const weightedLanguages = {};

      // Process each country and add its languages with weighted percentages
      countries.forEach((country) => {
        const countryName = country.name;
        const countryWeight = country.percent;

        if (countryLanguageMap[countryName]) {
          countryLanguageMap[countryName].forEach((lang) => {
            const weightedPercent = lang.percent * countryWeight;
            if (weightedLanguages[lang.name]) {
              weightedLanguages[lang.name] += weightedPercent;
            } else {
              weightedLanguages[lang.name] = weightedPercent;
            }
          });
        }
      });

      // Convert weighted languages object to array and sort
      const langArray = Object.entries(weightedLanguages).map(
        ([name, percent]) => ({
          name,
          percent,
        })
      );

      // If we got results, use them
      if (langArray.length > 0) {
        // Normalize percentages to ensure they sum to 1
        const total = langArray.reduce((sum, lang) => sum + lang.percent, 0);
        languages = langArray.map((lang) => ({
          name: lang.name,
          percent: total > 0 ? lang.percent / total : lang.percent,
        }));
      }
    }

    // Sort and limit to 10
    return languages.sort((a, b) => b.percent - a.percent).slice(0, 10);
  };

  // Derive common interests based on profile categories and demographic data
  const deriveInterests = (categories, gender, ages) => {
    // General interest categories with default weightings
    const commonInterests = [
      { name: "Entertainment", percent: 0.25 },
      { name: "Fashion & Style", percent: 0.15 },
      { name: "Travel", percent: 0.12 },
      { name: "Food & Dining", percent: 0.1 },
      { name: "Technology", percent: 0.08 },
      { name: "Sports", percent: 0.08 },
      { name: "Health & Fitness", percent: 0.07 },
      { name: "Music", percent: 0.06 },
      { name: "Beauty", percent: 0.05 },
      { name: "Business", percent: 0.04 },
    ];

    // If we have categories, use them to influence interests
    if (categories && categories.length > 0) {
      // Map of category keywords to interest domains
      const categoryToInterestMap = {
        entertainment: "Entertainment",
        movie: "Entertainment",
        film: "Entertainment",
        cinema: "Entertainment",
        actor: "Entertainment",
        actress: "Entertainment",
        fashion: "Fashion & Style",
        style: "Fashion & Style",
        model: "Fashion & Style",
        travel: "Travel",
        tourism: "Travel",
        food: "Food & Dining",
        restaurant: "Food & Dining",
        tech: "Technology",
        computer: "Technology",
        sport: "Sports",
        fitness: "Health & Fitness",
        health: "Health & Fitness",
        gym: "Health & Fitness",
        music: "Music",
        beauty: "Beauty",
        business: "Business",
        finance: "Business",
        art: "Art & Culture",
        design: "Art & Design",
        photo: "Photography",
        game: "Gaming",
      };

      // Check each category against our keywords
      const boostedInterests = {};

      categories.forEach((category) => {
        const lowerCat = category.toLowerCase();

        // Check for keyword matches
        Object.entries(categoryToInterestMap).forEach(
          ([keyword, interestName]) => {
            if (lowerCat.includes(keyword)) {
              boostedInterests[interestName] =
                (boostedInterests[interestName] || 0) + 0.1;
            }
          }
        );
      });

      // Apply the boosts to our common interests
      commonInterests.forEach((interest) => {
        if (boostedInterests[interest.name]) {
          interest.percent += boostedInterests[interest.name];
        }
      });

      // Normalize percentages after boosts
      const total = commonInterests.reduce(
        (sum, interest) => sum + interest.percent,
        0
      );
      commonInterests.forEach((interest) => {
        interest.percent = interest.percent / total;
      });
    }

    // Sort and return
    return commonInterests.sort((a, b) => b.percent - a.percent);
  };

  // Process age data to normalize categories and ensure no missing values
  const processAges = (ageData) => {
    if (!ageData || !Array.isArray(ageData) || ageData.length === 0) {
      // Fallback age distribution
      return [
        { category: "0_18", m: 0.07, f: 0.06 },
        { category: "18_24", m: 0.15, f: 0.12 },
        { category: "25_34", m: 0.25, f: 0.15 },
        { category: "35_44", m: 0.12, f: 0.04 },
        { category: "45_100", m: 0.06, f: 0.02 },
      ];
    }

    // Normalize age categories to match our UI categories
    const categoriesMap = {
      "0_18": "0_18",
      "13_17": "0_18",
      "18_21": "18_24",
      "21_24": "18_24",
      "24_27": "25_34",
      "27_30": "25_34",
      "30_35": "25_34",
      "35_45": "35_44",
      "45_100": "45_100",
    };

    // Grouped ages by our UI categories
    const groupedAges = {
      "0_18": { m: 0, f: 0 },
      "18_24": { m: 0, f: 0 },
      "25_34": { m: 0, f: 0 },
      "35_44": { m: 0, f: 0 },
      "45_100": { m: 0, f: 0 },
    };

    // Group the API age data into our UI categories
    ageData.forEach((age) => {
      const categoryKey = categoriesMap[age.category] || age.category;
      if (groupedAges[categoryKey]) {
        // Some APIs return null instead of 0, default to 0
        groupedAges[categoryKey].m += age.m || 0;
        groupedAges[categoryKey].f += age.f || 0;
      }
    });

    // Convert back to array
    return Object.entries(groupedAges).map(([category, values]) => ({
      category,
      m: values.m,
      f: values.f,
    }));
  };

  // Extract cities, countries from membersCities, membersCountries or cities, countries
  const cityData = data.membersCities || data.cities || [];
  const countryData = data.membersCountries || data.countries || [];

  // Process cities and countries
  const cities = processCities(cityData);
  const countries = processCountries(countryData);

  // Derive states from cities and countries
  const states = deriveStates(countries, cities);

  // Derive languages from countries
  const languages = deriveLanguages(countries);

  // Process age data
  const ageData = data.membersGendersAges?.data || data.ages || [];
  const processedAges = processAges(ageData);

  // Get gender summary
  const genderSummary = data.membersGendersAges?.summary || {
    m: 0.65,
    f: 0.35,
  };

  // Derive interests
  const interests =
    data.interests && data.interests.length > 0
      ? data.interests
      : deriveInterests(categories, genderSummary, processedAges);

  return {
    username: data.screenName,
    name: data.name,
    bio: data.description,
    profilePicture: data.image || null,
    verified: data.verified || false,
    influenceScore: (data.qualityScore * 10).toFixed(2) || 7.5,

    // Metrics
    followers: formatNumber(data.usersCount),
    followersCount: data.usersCount,
    engagementRate: (data.avgER * 100).toFixed(2) + "%",
    avgLikes: formatNumber(data.avgLikes || 0),
    avgComments: formatNumber(data.avgComments || 0),
    estimatedReach: formatNumber(estimatedReach),

    // Content
    recentPosts: [], // Avoid using external image URLs
    categories: categories,

    // Audience
    audience: {
      gender: genderSummary,
      ages: processedAges,
      countries: countries,
      cities: cities,
      states: states,
      languages: languages,
      interests: interests,
      credibility:
        ((1 - (data.pctFakeFollowers || 0.2)) * 100).toFixed(2) + "%",
    },

    // Brand mentions
    brandMentions: processBrandMentions(data.lastFromMentions),
    brandSafety: data.brandSafety || {},

    // Growth metrics
    growth: {
      reachability: data.membersReachability || [],
      fakeFollowersPct: data.pctFakeFollowers || 0,
    },

    // Raw data for advanced processing
    rawData: data,
  };
}
