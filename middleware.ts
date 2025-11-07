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

  // ✅ const, бо не перевизначається
  const response = NextResponse.next();

  // Якщо accessToken немає, але refreshToken є — пробуємо оновити сесію
  if (!accessToken && refreshToken) {
    try {
      const res = await checkSession();

      // ✅ axios: кукі в res.headers["set-cookie"]
      const setCookieHeader = res?.headers?.["set-cookie"];
      if (setCookieHeader) {
        const cookieArray = Array.isArray(setCookieHeader)
          ? setCookieHeader
          : [setCookieHeader];

        for (const cookieStr of cookieArray) {
          response.headers.append("set-cookie", cookieStr);
        }
      }
    } catch (e) {
      console.error("Session refresh failed", e);
    }
  }

  const hasAccess = Boolean((await cookies()).get("accessToken")?.value);

  if (!hasAccess && isPrivatePage) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (hasAccess && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
