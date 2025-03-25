import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Define public paths that don't require authentication
  const publicPaths = ["/login"];
  const isPublicPath = publicPaths.includes(pathname);

  // If user is not authenticated and trying to access a protected route
  if (!token && !isPublicPath) {
    // Create a new URL based on the current request URL to ensure proper domain handling
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    // Use status 303 for proper redirects
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  // If user is authenticated and trying to access login page
  if (token && isPublicPath) {
    // Create a new URL based on the current request URL to ensure proper domain handling
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/home";
    // Use status 303 for proper redirects
    return NextResponse.redirect(homeUrl, { status: 303 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/search/:path*",
    "/login",
    "/campaign-ideas/:path*",
    "/influencer-comparison/:path*",
    "/plans-lists/:path*",
    "/messages/:path*",
    "/campaign-reports/:path*",
    "/consolidated-reports/:path*",
    "/content-research/:path*",
    "/competitor-analysis/:path*",
    "/notifications/:path*",
  ],
};
