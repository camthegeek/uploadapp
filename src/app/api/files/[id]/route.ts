import { NextResponse } from "next/server"
import { unlink } from "fs/promises"
import { join } from "path"
import { readdir } from "fs/promises"

const UPLOAD_DIR = join(process.cwd(), "public", "uploads")

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const files = await readdir(UPLOAD_DIR)
    const fileName = files.find((f) => f.startsWith(params.id))

    if (!fileName) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const filePath = join(UPLOAD_DIR, fileName)
    await unlink(filePath)

    // In a real app, also remove the file record from the database

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}

