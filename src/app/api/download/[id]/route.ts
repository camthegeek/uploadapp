import { NextResponse, NextRequest } from "next/server"
import { createReadStream } from "fs"
import { join } from "path"
import { readdir } from "fs/promises"
import { UPLOAD_DIR } from "@/config"
import * as mime from "mime-types"

export async function GET(request: NextRequest ) {
  try {
    const id = request.nextUrl.pathname.split("/").pop()
    if (!id) {
      return NextResponse.json({ error: "Invalid file id" }, { status: 400 })
    }
    const files = await readdir(UPLOAD_DIR)
    const fileName = files.find((f) => f.startsWith(id))
    
    if (!fileName) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const filePath = join(UPLOAD_DIR, fileName)
    const originalName = fileName.substring(id.length + 1)
    const contentType = mime.lookup(originalName) || "application/octet-stream"
    const stream = createReadStream(filePath)

    return new Response(stream as unknown as ReadableStream, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${originalName}"`,
      },
    })
  } catch (err) {
    console.error("Download error:", err)
    return NextResponse.json({ error: "Failed to serve file" }, { status: 500 })
  }
}
