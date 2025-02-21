import { NextResponse, NextRequest } from "next/server"
import { createReadStream } from "fs"
import { join } from "path"
import { readdir } from "fs/promises"

const UPLOAD_DIR = join(process.cwd(), "public", "uploads")

export async function GET(request: NextRequest) {
    const id = request.nextUrl.pathname.split("/").pop() as string
  try {
    const files = await readdir(UPLOAD_DIR)
    const fileName = files.find((f) => f.startsWith(id))
    
    if (!fileName) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const filePath = join(UPLOAD_DIR, fileName)
    const stream = createReadStream(filePath)
    
    return new Response(stream as unknown as ReadableStream, {
      headers: {
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Type": "application/octet-stream",
      },
    })
  } catch (err) {
    console.error("Download error:", err)
    return NextResponse.json({ error: "Failed to download file" }, { status: 500 })
  }
}
