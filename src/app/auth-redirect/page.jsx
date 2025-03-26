"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

/**
 * This page acts as a redirect bridge to help with authentication redirects
 * in production environments where middleware redirection might have issues
 */
export default function AuthRedirect() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // If session exists, redirect to home
    if (status === "authenticated" && session) {
      console.log("User is authenticated, redirecting to /home");
      // Use direct window location for reliable redirection
      window.location.href = "/home";
    } else if (status === "unauthenticated") {
      console.log("User is not authenticated, redirecting to /login");
      // Use direct window location for reliable redirection
      window.location.href = "/login";
    }
    // Don't redirect if still loading
  }, [session, status, router]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        gap: "20px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ fontSize: "24px", fontWeight: "bold" }}>disco</div>
      <div>Redirecting to the appropriate page...</div>
      <div
        style={{
          width: "50px",
          height: "6px",
          backgroundColor: "#1a1d23",
          borderRadius: "3px",
          animation: "loading 1.5s infinite",
        }}
      ></div>
      <style jsx>{`
        @keyframes loading {
          0% {
            width: 50px;
            opacity: 0.3;
          }
          50% {
            width: 100px;
            opacity: 0.8;
          }
          100% {
            width: 50px;
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}
