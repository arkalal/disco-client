// Build versioned cache keys for Instagram profile analytics
export function makeProfileKey(handle, version = "v1") {
  const h = String(handle || "").trim().toLowerCase();
  return `disco:ig:profile:${h}:${version}`;
}
