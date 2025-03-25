import { getBaseURL } from "./url";

/**
 * Gets the Next Auth URL with fallback to our URL utility
 * This ensures that Next Auth works correctly in all environments
 * even if NEXTAUTH_URL is not explicitly set
 */
export const getNextAuthURL = () => {
  // Try to use the NEXTAUTH_URL environment variable first
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }

  // Fall back to our URL utility if NEXTAUTH_URL is not available
  return getBaseURL();
};

/**
 * Creates a callback URL for Next Auth
 * @param {string} path - The path to redirect to after authentication
 */
export const getCallbackURL = (path = "/home") => {
  const baseUrl = getNextAuthURL();
  return `${baseUrl}${path}`;
};
