import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;
  const fullUrl = request.nextUrl.clone();

  // Define public paths that don't require authentication
  const publicPaths = ["/login"];
  const isPublicPath = publicPaths.includes(pathname);

  // If user is not authenticated and trying to access a protected route
  if (!token && !isPublicPath) {
    fullUrl.pathname = "/login";
    return NextResponse.redirect(fullUrl);
  }

  // If user is authenticated and trying to access login page
  if (token && isPublicPath) {
    fullUrl.pathname = "/home";
    return NextResponse.redirect(fullUrl);
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
