// Cache configuration sourced from environment variables with safe defaults

const toBool = (v, d) => {
  if (v === undefined || v === null || v === "") return d;
  const s = String(v).toLowerCase().trim();
  return ["1", "true", "yes", "on"].includes(s);
};

const toInt = (v, d) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : d;
};

export const CACHE_ENABLED = toBool(process.env.CACHE_ENABLED, true);
export const CACHE_VERSION = process.env.CACHE_VERSION || "v1";
export const CACHE_SOFT_TTL_SECONDS = toInt(
  process.env.CACHE_SOFT_TTL_SECONDS,
  2592000 // 30 days
);
export const CACHE_HARD_TTL_SECONDS = toInt(
  process.env.CACHE_HARD_TTL_SECONDS,
  3456000 // 40 days grace
);
export const CACHE_SWR_ENABLED = toBool(process.env.CACHE_SWR_ENABLED, false);
