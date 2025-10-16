import { NextResponse } from 'next/server';
import { redis } from "../../../../../utils/cache/redis";
import { makeProfileKey } from "../../../../../utils/cache/keys";
import {
  CACHE_ENABLED,
  CACHE_VERSION,
  CACHE_SOFT_TTL_SECONDS,
  CACHE_HARD_TTL_SECONDS,
} from "../../../../../utils/cache/config";

export async function GET(request, { params }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const username = resolvedParams.username;

    if (!username) {
      return NextResponse.json({ error: 'Username parameter is required' }, { status: 400 });
    }

    const urlObj = new URL(request.url);
    const refresh = urlObj.searchParams.get('refresh') === 'true';

    // Provider-specific key to avoid collisions with other Instagram providers
    const key = `disco:ig:profile:rapidapi:${String(username).trim().toLowerCase()}:${CACHE_VERSION}`;
    const now = Date.now();
    const softTtlMs = CACHE_SOFT_TTL_SECONDS * 1000;

    async function fetchFromRapidAPI() {
      const url = `https://instagram-statistics-api.p.rapidapi.com/community?url=https%3A%2F%2Fwww.instagram.com%2F${encodeURIComponent(
        username
      )}%2F`;
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY,
          'x-rapidapi-host': 'instagram-statistics-api.p.rapidapi.com',
          'Accept': 'application/json',
        },
        next: { revalidate: 0 },
      };

      const started = Date.now();
      const response = await fetch(url, options);
      const latency = Date.now() - started;
      console.log('provider_call_rapidapi', { handle: username, status: response.status, latencyMs: latency });

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(`rapidapi_error ${response.status} ${response.statusText} ${errText}`);
      }
      const payload = await response.json();
      const savedAt = new Date().toISOString();
      return { payload, savedAt, providerAt: null };
    }

    // Attempt cache read when enabled and not forced refresh
    if (CACHE_ENABLED && redis && !refresh) {
      try {
        const t0 = Date.now();
        const cachedStr = await redis.get(key);
        const latency = Date.now() - t0;
        if (cachedStr) {
          let cached;
          try {
            cached = typeof cachedStr === 'string' ? JSON.parse(cachedStr) : cachedStr;
          } catch (_) {
            cached = null;
          }
          if (cached && cached.savedAt) {
            const ageMs = now - new Date(cached.savedAt).getTime();
            const fresh = ageMs <= softTtlMs;
            console.log('cache_hit', { handle: username, fresh, latencyMs: latency, version: CACHE_VERSION });
            if (fresh) return NextResponse.json(cached.payload);
            try {
              const freshData = await fetchFromRapidAPI();
              if (redis) await redis.set(key, JSON.stringify(freshData), { ex: CACHE_HARD_TTL_SECONDS });
              return NextResponse.json(freshData.payload);
            } catch (e) {
              console.warn('provider_failed_serving_stale', { handle: username });
              return NextResponse.json(cached.payload);
            }
          }
        } else {
          console.log('cache_miss', { handle: username, latencyMs: latency, version: CACHE_VERSION });
        }
      } catch (e) {
        console.warn('cache_read_error', { handle: username });
      }
    }

    // Cache disabled/refresh/no cache: fetch and store
    const data = await fetchFromRapidAPI();
    if (CACHE_ENABLED && redis) {
      try {
        await redis.set(key, JSON.stringify(data), { ex: CACHE_HARD_TTL_SECONDS });
      } catch (e) {
        console.warn('cache_write_error', { handle: username });
      }
    }
    return NextResponse.json(data.payload);
  } catch (error) {
    console.error('instagram_statistics_route_error', { error: error?.message });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
