import { NextResponse } from "next/server";

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  if (path === "/") {
    return NextResponse.next();
  }

  // Define public paths that don't need authentication
  const isPublicPath =
    path.startsWith("/sign-in") || path.startsWith("/sign-up");
  
  const token = request.cookies.get("token");

  // Redirect to sign-in if token is invalid
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Redirect to dashboard if token is valid
  if (token && isPublicPath) {
    try {
      // Verify token
      const res = await fetch(
        `${request.nextUrl.origin}/api/auth/verify-token`,
        {
          headers: {
            Cookie: `token=${token.value}`,
          },
        }
      );
      const data = await res.json();

      if (data.success) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      // If token verification fails, continue to public path
      console.error("Token verification failed:", error);
      return NextResponse.redirect(new URL("/sign-in", request.url), {
        headers: {
          "Set-Cookie": "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts, /images (static files)
     * 4. /favicon.ico, /sitemap.xml (static files)
     */
    "/((?!api|_next|fonts|images|[\\w-]+\\.\\w+).*)",
  ],
};
