import { NextResponse, NextRequest } from "next/server"
import { readdir, stat } from "fs/promises"
import { join } from "path"
import { UPLOAD_DIR } from "@/config"

async function readDirectory(dirPath: string): Promise<string[]> {
  try {
    return await readdir(dirPath)
  } catch (error) {
    console.error("Error reading files:", error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {

    const files = await readDirectory(UPLOAD_DIR)
    console.log(files);
    const origin = request.headers.get("host") || ""

    const fileInfos = await Promise.all(
      files.map(async (fileName) => {
        const filePath = join(UPLOAD_DIR, fileName)
        const stats = await stat(filePath)
        const fileId = fileName.split('-')[0]

        const protocol = process.env.NODE_ENV === 'development' ? 'http://' : 'https://'
        const baseUrl = `${protocol}${origin}`

        return {
          id: fileId,
          name: fileName.substring(fileId.length + 1),
          size: stats.size,
          uploadedAt: stats.mtime.toISOString(),
          directUrl: `${baseUrl}/api/download/${fileId}`,
          maskedUrl: `${baseUrl}/f/${fileId}`,
        }
      }),
    )

    return NextResponse.json(fileInfos)
  } catch (error) {
    console.error("Error reading files:", error)
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 })
  }
}

