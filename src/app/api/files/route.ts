import { NextResponse } from "next/server"
import { readdir, stat } from "fs/promises"
import { join } from "path"

const UPLOAD_DIR = join(process.cwd(), "public", "uploads")

export async function GET() {
  try {
    // In a real app, fetch this from a database
    // This is just a demo implementation reading from the filesystem
    const files = await readdir(UPLOAD_DIR)

    const fileInfos = await Promise.all(
      files.map(async (fileName) => {
        const filePath = join(UPLOAD_DIR, fileName)
        const stats = await stat(filePath)
        const fileId = fileName.split(".")[0]

        return {
          id: fileId,
          name: fileName,
          size: stats.size,
          uploadedAt: stats.mtime.toISOString(),
          directUrl: `/uploads/${fileName}`,
          maskedUrl: `/f/${fileId}`,
        }
      }),
    )

    return NextResponse.json(fileInfos)
  } catch (error) {
    console.error("Error reading files:", error)
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 })
  }
}

