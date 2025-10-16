import { Redis } from "@upstash/redis";

// Create a single client instance from environment variables.
// Guard so that local builds without envs do not crash the app.
let client = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    client = Redis.fromEnv();
  }
} catch (_) {
  client = null;
}

export const redis = client;
