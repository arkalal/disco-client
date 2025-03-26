"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function RootPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Only perform redirects once session status is determined
    if (status === "loading") return;

    if (session) {
      // If user is authenticated, redirect to home
      router.push("/home");
    } else {
      // If user is not authenticated, redirect to login
      router.push("/login");
    }
  }, [session, status, router]);

  // Return an empty div to avoid flickering during redirects
  return <div style={{ display: "none" }}></div>;
}
