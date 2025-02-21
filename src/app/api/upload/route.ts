import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { UPLOAD_DIR } from "@/config";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }

    // Ensure upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uniqueId = Date.now().toString();
    const fileName = `${uniqueId}-${file.name}`;
    const filePath = join(UPLOAD_DIR, fileName);
    
    await writeFile(filePath, buffer);
    
    return NextResponse.json({ fileId: uniqueId });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}