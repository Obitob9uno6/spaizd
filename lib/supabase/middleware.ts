import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  // Mock session handling - in production this would use actual Supabase
  const hasAuthCookie = request.cookies.has("sb-access-token")

  const publicRoutes = [
    "/", // Added root path to allow free access to landing page
    "/auth/login",
    "/auth/sign-up",
    "/auth/sign-up-success",
    "/auth/error",
    "/legal/privacy",
    "/legal/terms",
    "/legal/cookies",
    "/legal/accessibility",
    "/legal/returns",
    "/legal/shipping",
  ]

  const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  const isStaticAsset =
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.includes(".") ||
    request.nextUrl.pathname === "/favicon.ico"

  // Redirect to login if not authenticated and not on a public route
  if (!hasAuthCookie && !isPublicRoute && !isStaticAsset) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
