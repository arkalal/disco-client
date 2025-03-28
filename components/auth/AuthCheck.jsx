"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

// Public paths that don't require authentication
const publicPaths = [
  "/login",
  "/register",
  "/privacy-policy",
  "/terms/brands",
  "/terms/influencers",
];

export default function AuthCheck({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isPublicPath = publicPaths.includes(pathname);

  useEffect(() => {
    // Only handle redirects when session status is determined (not loading)
    if (status === "loading") return;

    // If the user is not authenticated and the route is not public, redirect to login
    if (!session && !isPublicPath) {
      router.push("/login");
    }

    // If the user is authenticated and on a public path like login/register, redirect to home
    // But allow authenticated users to view privacy policy and terms pages
    if (
      session &&
      isPublicPath &&
      (pathname === "/login" || pathname === "/register")
    ) {
      router.push("/home");
    }
  }, [session, status, isPublicPath, router, pathname]);

  // To avoid flashing loading states, always render children
  // The useEffect above will handle redirects if needed
  return <>{children}</>;
}
