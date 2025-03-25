import { NextResponse } from "next/server";

export async function GET(request) {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXTAUTH_URL || "http://localhost:3000";

  // Log the current environment variables for debugging
  console.log("Environment variables for auth:", {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    VERCEL_URL: process.env.VERCEL_URL,
    baseUrl,
  });

  return NextResponse.json({
    status: "ok",
    environment: process.env.NODE_ENV,
    baseUrl,
    timestamp: new Date().toISOString(),
  });
}
