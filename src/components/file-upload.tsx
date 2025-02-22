"use client"

import type React from "react"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useUploadContext } from "@/context/upload-context"
import toast from 'react-hot-toast'

export function FileUpload() {
  const [isDragging, setIsDragging] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const { triggerRefresh } = useUploadContext()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    await uploadFiles(files)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      await uploadFiles(files)
    }
  }

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true)
    setProgress(0)

    for (const file of files) {
      const formData = new FormData()
      formData.append("file", file)

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) throw new Error("Upload failed")

        // Simulate progress for demo
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval)
              return 100
            }
            return prev + 10
          })
        }, 100)

        await response.json();
        console.log("Upload successful")
        toast.success(`Successfully uploaded ${file.name}`)
      } catch (error) {
        console.error("Upload error:", error)
        toast.error(`Failed to upload ${file.name}`)
      }
    }

    setTimeout(() => {
      setIsUploading(false)
      setProgress(0)
      triggerRefresh() // Trigger refresh of file list
    }, 1500)
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <Upload className="w-8 h-8 text-muted-foreground" />
        <div>
          <p className="text-lg font-medium">Drag and drop your files here</p>
          <p className="text-sm text-muted-foreground">or click to select files</p>
        </div>
        <input type="file" onChange={handleFileSelect} className="hidden" id="file-upload" multiple />
        <Button asChild variant="secondary">
          <label htmlFor="file-upload">Select Files</label>
        </Button>
      </div>
      {isUploading && (
        <div className="mt-4 space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground">Uploading...</p>
        </div>
      )}
    </div>
  )
}

