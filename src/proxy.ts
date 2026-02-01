import { NextResponse } from "next/server"
import { auth } from "../auth"

const authRoutes = ["/sign-in", "/sign-up"]
const protectedRoutes = ["/dashboard"]

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  const isAuthRoute = authRoutes.includes(pathname) || pathname.startsWith("/verify")
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Logged-in users on auth pages → redirect to dashboard
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Unauthenticated users on protected routes → redirect to sign-in
  if (!isLoggedIn && isProtectedRoute) {
    const signInUrl = new URL("/sign-in", req.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/",
    "/dashboard/:path*",
    "/verify/:path*",
    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
  ],
}
