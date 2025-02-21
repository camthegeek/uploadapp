import { NextResponse } from "next/server"
import { readdir } from "fs/promises"
import { join } from "path"

const UPLOAD_DIR = join(process.cwd(), "public", "uploads")

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const files = await readdir(UPLOAD_DIR)
    const fileName = files.find((f) => f.startsWith(params.id))

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

