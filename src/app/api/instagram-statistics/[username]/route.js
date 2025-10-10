import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    // Properly await params before accessing properties
    const resolvedParams = await Promise.resolve(params);
    const username = resolvedParams.username;
    
    if (!username) {
      return NextResponse.json({ error: 'Username parameter is required' }, { status: 400 });
    }

    // Format the URL for Instagram Statistics API
    const url = `https://instagram-statistics-api.p.rapidapi.com/community?url=https%3A%2F%2Fwww.instagram.com%2F${username}%2F`;
    
    // Prepare options for the fetch request with RapidAPI headers
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY, // Using the confirmed env variable
        'x-rapidapi-host': 'instagram-statistics-api.p.rapidapi.com',
        'Accept': 'application/json'
      },
      next: { revalidate: 0 } // No caching - always fetch fresh data as per requirements
    };

    // Log the request details for debugging
    console.log(`Fetching Instagram data for @${username} from Instagram Statistics API`);

    // Perform the API request
    const response = await fetch(url, options);
    
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('API Error response:', errorText);
      return NextResponse.json({ error: 'Failed to fetch from Instagram Statistics API' }, { status: response.status });
    }

    // Parse the response data
    const responseData = await response.json();
    
    // Return the data as-is from the API
    // Data transformation will happen in the frontend or a utility function
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Error fetching Instagram Statistics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
