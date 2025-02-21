import { NextResponse, NextRequest } from "next/server"
import { unlink, readdir } from "fs/promises"
import { join } from "path"

const UPLOAD_DIR = join(process.cwd(), "public", "uploads")

// delete is sent the file id as a parameter
// delete the file from the server

export async function DELETE(request: NextRequest) {
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

    const filePath = join(UPLOAD_DIR, fileName)
    await unlink(filePath)

    // In a real app, also remove the file record from the database

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: `Failed to delete file` }, { status: 500 })
  }
}

