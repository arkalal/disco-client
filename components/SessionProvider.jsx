"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export default function SessionProvider({ children }) {
  // Add refetch interval to ensure session state is updated frequently
  // This helps with session detection issues in production
  return (
    <NextAuthSessionProvider
      refetchInterval={5 * 60} // Refetch session every 5 minutes
      refetchOnWindowFocus={true} // Refetch when window gets focus
    >
      {children}
    </NextAuthSessionProvider>
  );
}
