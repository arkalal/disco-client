/**
 * Utility functions for processing text using OpenRouter GPT-5
 */

/**
 * Normalize tags using GPT-5
 * 
 * @param {Array} tagsRaw - Raw tags from API
 * @param {Array} topHashtags - Top hashtags from posts
 * @returns {Promise<Object>} - Normalized tags with categories and summary
 */
export async function normalizeTagsWithGpt5(tagsRaw, topHashtags) {
  try {
    const response = await fetch('/api/openrouter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task: 'LLM_NORMALIZE_TAGS',
        data: {
          tagsRaw,
          topHashtags
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error normalizing tags with GPT-5:', errorText);
      return { normalized_tags: tagsRaw, summary: '' };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error normalizing tags with GPT-5:', error);
    return { normalized_tags: tagsRaw, summary: '' };
  }
}

/**
 * Map languages from countries using GPT-5
 * 
 * @param {Array} countries - Countries data with percentages
 * @returns {Promise<Object>} - Languages data with percentages and summary
 */
export async function mapLanguagesFromCountries(countries) {
  try {
    const response = await fetch('/api/openrouter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task: 'LLM_MAP_LANG_FROM_COUNTRIES',
        data: {
          countries
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error mapping languages with GPT-5:', errorText);
      return { languages: [], summary: '' };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error mapping languages with GPT-5:', error);
    return { languages: [], summary: '' };
  }
}

/**
 * Generate growth insights using GPT-5
 * 
 * @param {Object} metrics - Profile metrics
 * @returns {Promise<Object>} - Growth insights
 */
export async function generateGrowthInsights(metrics) {
  try {
    const response = await fetch('/api/openrouter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task: 'LLM_GENERATE_GROWTH_INSIGHTS',
        data: {
          metrics
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error generating growth insights with GPT-5:', errorText);
      return null;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error generating growth insights with GPT-5:', error);
    return null;
  }
}

/**
 * Fallback function to process tags without GPT-5
 * Used when GPT-5 call fails or is unavailable
 * 
 * @param {Array} tagsRaw - Raw tags from API
 * @returns {Object} - Normalized tags with categories
 */
export function processTags(tagsRaw) {
  if (!tagsRaw || !Array.isArray(tagsRaw) || tagsRaw.length === 0) {
    return { normalized_tags: [], summary: '' };
  }
  
  // Basic categories for classification
  const categories = {
    'lifestyle': [],
    'fashion': [],
    'travel': [],
    'food': [],
    'fitness': [],
    'entertainment': [],
    'technology': [],
    'beauty': [],
    'other': []
  };
  
  // Simple keyword-based categorization
  tagsRaw.forEach(tag => {
    const tagText = typeof tag === 'string' ? tag.toLowerCase() : tag.name?.toLowerCase() || '';
    
    if (tagText.includes('fashion') || tagText.includes('style') || tagText.includes('outfit')) {
      categories.fashion.push(tag);
    } else if (tagText.includes('travel') || tagText.includes('wanderlust') || tagText.includes('adventure')) {
      categories.travel.push(tag);
    } else if (tagText.includes('food') || tagText.includes('recipe') || tagText.includes('cook')) {
      categories.food.push(tag);
    } else if (tagText.includes('fitness') || tagText.includes('workout') || tagText.includes('gym')) {
      categories.fitness.push(tag);
    } else if (tagText.includes('movie') || tagText.includes('music') || tagText.includes('art')) {
      categories.entertainment.push(tag);
    } else if (tagText.includes('tech') || tagText.includes('gadget') || tagText.includes('digital')) {
      categories.technology.push(tag);
    } else if (tagText.includes('beauty') || tagText.includes('makeup') || tagText.includes('skincare')) {
      categories.beauty.push(tag);
    } else if (tagText.includes('lifestyle') || tagText.includes('life') || tagText.includes('daily')) {
      categories.lifestyle.push(tag);
    } else {
      categories.other.push(tag);
    }
  });
  
  // Format into normalized tags array
  const normalized_tags = Object.entries(categories)
    .filter(([_, tags]) => tags.length > 0)
    .map(([category, tags]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      tags: tags.map(tag => typeof tag === 'string' ? tag : tag.name || '')
    }));
  
  // Create a simple summary
  const topCategories = normalized_tags.slice(0, 2).map(cat => cat.category);
  const summary = topCategories.length > 0 
    ? `Content primarily focuses on ${topCategories.join(' and ')}.`
    : 'Content covers various topics.';
  
  return { normalized_tags, summary };
}

/**
 * Fallback function to map languages from countries without GPT-5
 * 
 * @param {Array} countries - Countries data
 * @returns {Object} - Languages data
 */
export function mapLanguagesFromCountriesFallback(countries) {
  if (!countries || !Array.isArray(countries) || countries.length === 0) {
    return { languages: [], summary: '' };
  }
  
  // Common language mappings by country code
  const languageMap = {
    'US': { code: 'EN', name: 'English' },
    'UK': { code: 'EN', name: 'English' },
    'CA': { code: 'EN', name: 'English' },
    'AU': { code: 'EN', name: 'English' },
    'NZ': { code: 'EN', name: 'English' },
    'IE': { code: 'EN', name: 'English' },
    'IN': { code: 'EN', name: 'English' },
    'ES': { code: 'ES', name: 'Spanish' },
    'MX': { code: 'ES', name: 'Spanish' },
    'AR': { code: 'ES', name: 'Spanish' },
    'CO': { code: 'ES', name: 'Spanish' },
    'CL': { code: 'ES', name: 'Spanish' },
    'FR': { code: 'FR', name: 'French' },
    'DE': { code: 'DE', name: 'German' },
    'IT': { code: 'IT', name: 'Italian' },
    'BR': { code: 'PT', name: 'Portuguese' },
    'PT': { code: 'PT', name: 'Portuguese' },
    'JP': { code: 'JA', name: 'Japanese' },
    'KR': { code: 'KO', name: 'Korean' },
    'CN': { code: 'ZH', name: 'Chinese' },
    'TW': { code: 'ZH', name: 'Chinese' },
    'RU': { code: 'RU', name: 'Russian' },
    'NL': { code: 'NL', name: 'Dutch' },
    'SE': { code: 'SV', name: 'Swedish' },
    'NO': { code: 'NO', name: 'Norwegian' },
    'DK': { code: 'DA', name: 'Danish' },
    'FI': { code: 'FI', name: 'Finnish' },
    'PL': { code: 'PL', name: 'Polish' },
    'TR': { code: 'TR', name: 'Turkish' },
    'AE': { code: 'AR', name: 'Arabic' },
    'SA': { code: 'AR', name: 'Arabic' },
    'EG': { code: 'AR', name: 'Arabic' }
  };
  
  // Map countries to languages with percentages
  const languagesMap = {};
  
  countries.forEach(country => {
    const countryCode = country.code || country.name || '';
    const language = languageMap[countryCode.toUpperCase()];
    
    if (language) {
      const langCode = language.code;
      if (!languagesMap[langCode]) {
        languagesMap[langCode] = {
          code: langCode,
          name: language.name,
          percent: 0
        };
      }
      languagesMap[langCode].percent += country.percent || 0;
    }
  });
  
  // If we couldn't map any languages, use English as default
  if (Object.keys(languagesMap).length === 0) {
    return {
      languages: [{ code: 'EN', name: 'English', percent: 1.0 }],
      summary: 'Primarily English-speaking audience.'
    };
  }
  
  // Convert to array and sort by percentage
  const languages = Object.values(languagesMap)
    .sort((a, b) => b.percent - a.percent);
  
  // Normalize percentages to ensure they sum to 1
  const totalPercent = languages.reduce((sum, lang) => sum + lang.percent, 0);
  languages.forEach(lang => {
    lang.percent = totalPercent > 0 ? lang.percent / totalPercent : lang.percent;
  });
  
  // Create summary
  const topLanguages = languages.slice(0, 2).map(lang => lang.name);
  const summary = topLanguages.length > 0
    ? `Audience primarily speaks ${topLanguages.join(' and ')}.`
    : 'Audience speaks various languages.';
  
  return { languages, summary };
}
