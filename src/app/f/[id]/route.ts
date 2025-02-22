import { NextResponse, NextRequest } from "next/server"
import { readdir, readFile } from "fs/promises"
import { UPLOAD_DIR } from "@/config"
import path from "path"
import mime from "mime-types"

export async function GET(request: NextRequest) {
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

    const filePath = path.join(UPLOAD_DIR, fileName)
    const fileContent = await readFile(filePath)
    const mimeType = mime.lookup(fileName) || 'application/octet-stream'

    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `inline; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error("Error serving file:", error)
    return NextResponse.json({ error: "Failed to serve file" }, { status: 500 })
  }
}

