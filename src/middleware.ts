import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Add security headers for file downloads
  const response = NextResponse.next()

  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data: blob:; media-src 'self' data: blob:;",
  )
  response.headers.set("X-Content-Type-Options", "nosniff")

  return response
}

export const config = {
  matcher: ["/uploads/:path*", "/f/:path*"],
}

