import { NextResponse } from "next/server"

export async function middleware() {
  const response = NextResponse.next()
  
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data: blob:; media-src 'self' data: blob:;"
  )
  response.headers.set("X-Content-Type-Options", "nosniff")

  return response
}

export const config = {
  matcher: ["/f/:path*"]
}

