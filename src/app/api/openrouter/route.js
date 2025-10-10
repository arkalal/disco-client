import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Extract task and data from request body
    const { task, data } = await request.json();

    if (!task || !data) {
      return NextResponse.json({ error: 'Task and data are required' }, { status: 400 });
    }

    // Construct the system prompt based on the task
    let systemPrompt = 'You are a data processor for Disco, an influencer marketing platform.';
    let userPrompt = '';

    switch (task) {
      case 'LLM_NORMALIZE_TAGS':
        systemPrompt += ' Normalize and categorize hashtag data for better analysis and presentation.';
        userPrompt = `
          Process these raw tags: ${JSON.stringify(data.tagsRaw)}
          And top hashtags: ${JSON.stringify(data.topHashtags)}
          
          Return a JSON object with:
          1. normalized_tags: An array of normalized tag objects with categories grouped logically
          2. summary: A brief 1-2 sentence summary of the creator's content focus based on these tags
          
          Format tags by removing special characters, standardizing capitalization, and grouping similar concepts.
        `;
        break;

      case 'LLM_MAP_LANG_FROM_COUNTRIES':
        systemPrompt += ' Map languages to countries based on demographic data.';
        userPrompt = `
          Based on these countries and their audience percentages: ${JSON.stringify(data.countries)}
          
          Return a JSON object with:
          1. languages: Array of likely languages spoken by the audience with estimated percentages
          2. summary: A brief description of the linguistic diversity of the audience
          
          For each country, consider official languages, widely spoken languages, and regional popularity.
        `;
        break;

      case 'LLM_GENERATE_GROWTH_INSIGHTS':
        systemPrompt += ' Generate insights about creator growth patterns based on available metrics.';
        userPrompt = `
          Based on these metrics: ${JSON.stringify(data.metrics)}
          
          Return a JSON object with:
          1. growth_rate: Estimated monthly growth rate (percentage)
          2. historical_data: Array of estimated historical follower counts (past 6 months)
          3. insights: 2-3 specific observations about growth patterns
          4. forecast: Brief prediction about future growth trajectory
          
          Make realistic projections based on engagement metrics, posting frequency, and audience size.
        `;
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid task specified' }, { status: 400 });
    }

    // Using OpenRouter API with the provided key
    const apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    const headers = {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      'X-Title': 'Disco - Influencer Marketing Platform'
    };
    
    console.log('Making request to OpenRouter API...');
    
    // Call the API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        model: 'openai/gpt-4', // Use GPT-4 instead of GPT-5 for better compatibility
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.2, // Lower temperature for more consistent, deterministic responses
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      // Try to get error details
      let errorDetails = '';
      try {
        const errorBody = await response.text();
        errorDetails = errorBody;
        console.error('Error response body:', errorBody);
      } catch (e) {
        errorDetails = 'Could not read error response';
      }
      return NextResponse.json({ 
        error: `LLM API request failed: ${response.status} ${response.statusText}`, 
        details: errorDetails 
      }, { status: response.status });
    }

    // Get the response data
    const responseData = await response.json();
    
    // Extract the response content
    const result = responseData.choices?.[0]?.message?.content;
    
    if (!result) {
      return NextResponse.json({ error: 'No response content from GPT-5' }, { status: 500 });
    }

    // Try to parse the result as JSON if possible
    try {
      const parsedResult = JSON.parse(result);
      return NextResponse.json(parsedResult);
    } catch (e) {
      // If not parsable as JSON, return as plain text
      return NextResponse.json({ result });
    }

  } catch (error) {
    console.error('Error in OpenRouter API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
