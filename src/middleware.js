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
    const url = new URL("/login", request.url);
    const response = NextResponse.redirect(url, { status: 303 });
    // Disable cache for this response
    response.headers.set("x-middleware-cache", "no-cache");
    return response;
  }

  // If user is authenticated and trying to access login page
  if (token && isPublicPath) {
    const url = new URL("/home", request.url);
    const response = NextResponse.redirect(url, { status: 303 });
    // Disable cache for this response
    response.headers.set("x-middleware-cache", "no-cache");
    return response;
  }

  // For all other requests, continue but disable cache
  const response = NextResponse.next();
  response.headers.set("x-middleware-cache", "no-cache");
  return response;
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
