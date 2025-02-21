import { NextResponse, NextRequest } from "next/server"
import { readdir } from "fs/promises"
import { join } from "path"

const UPLOAD_DIR = join(process.cwd(), "public", "uploads")

export async function GET(request: NextRequest ) {
  try {
    const files = await readdir(UPLOAD_DIR)
    const id = request.nextUrl.pathname.split("/").pop()
    if (!id) {
      return NextResponse.json({ error: "Invalid file id" }, { status: 400 })
    }
    const fileName = files.find((f) => f.startsWith(id))

    if (!fileName) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Redirect to the actual file
    return NextResponse.redirect(new URL(`/uploads/${fileName}`, request.url))
  } catch (error) {
    console.error("Error serving file:", error)
    return NextResponse.json({ error: "Failed to serve file" }, { status: 500 })
  }
}

