import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Allow access to auth pages for unauthenticated users
    if (pathname.startsWith("/auth/")) {
      return NextResponse.next()
    }

    // Redirect unauthenticated users to sign in
    if (!token) {
      const signInUrl = new URL("/auth/signin", req.url)
      signInUrl.searchParams.set("callbackUrl", req.url)
      return NextResponse.redirect(signInUrl)
    }

    // Role-based access control
    const userRole = token.role as string

    // Admin routes
    if (pathname.startsWith("/admin")) {
      if (userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", req.url))
      }
    }

    // Operations routes
    if (pathname.startsWith("/order-fulfillment")) {
      if (userRole !== "OPERATIONS_MANAGER" && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", req.url))
      }
    }

    // User routes
    if (pathname.startsWith("/user")) {
      if (userRole !== "USER" && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to OAuth redirect page during authentication
        if (req.nextUrl.pathname === "/auth/oauth-redirect") {
          return true
        }
        
        // Allow access to auth pages
        if (req.nextUrl.pathname.startsWith("/auth/")) {
          return true
        }
        
        // Require authentication for all other protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/admin/:path*",
    "/user/:path*",
    "/order-fulfillment/:path*",
    "/auth/oauth-redirect"
  ]
}
