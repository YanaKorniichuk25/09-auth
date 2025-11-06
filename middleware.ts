import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "./lib/api/serverApi";

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isPrivatePage =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");

  // If accessToken missing but refreshToken exists — attempt session refresh
  if (!accessToken && refreshToken) {
    try {
      await checkSession();
    } catch (e) {
      // ignore: if refresh fails, we'll redirect later
    }
  }

  const hasAccess = Boolean((await cookies()).get("accessToken")?.value);

  if (!hasAccess && isPrivatePage) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Authenticated users visiting auth pages -> redirect to home (not /profile)
  if (hasAccess && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
