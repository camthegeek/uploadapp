"use client"

import { useState, useEffect } from "react"
import { ExternalLink, FileIcon, Loader2, ToggleLeft, ToggleRight, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import toast from 'react-hot-toast'
import { useUploadContext } from "@/context/upload-context"

interface FileInfo {
  id: string
  name: string
  size: number
  uploadedAt: string
  directUrl: string
  maskedUrl: string
  error?: string
}

export function FileList() {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [loading, setLoading] = useState(true)
  const { refreshTrigger } = useUploadContext()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFiles()
  }, []) // Re-fetch when refreshTrigger changes

  useEffect(() => {
    fetchFiles()
  }, [refreshTrigger])

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/files")
      const data = await response.json()
      setFiles(data)
    } catch (error) {
      setError("Failed to fetch files")
      toast.error("Failed to fetch files")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success("URL copied to clipboard")
  }

  const deleteFile = async (id: string) => {
    try {
      const response = await fetch(`/api/files/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setFiles(files.filter((file) => file.id !== id))
        toast.success("File deleted successfully")
      }
    } catch (error) {
      console.error("Error deleting file:", error)
      toast.error("Failed to delete file")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }
  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>
  }
  
  if (files.length === 0) {
    return <div className="text-center p-8 text-muted-foreground">No files uploaded yet</div>
  }

  return (
    <div className="space-y-4">
      {files.map((file) => (
        <div key={file.id} className="flex items-center justify-between p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <FileIcon className="w-8 h-8 text-muted-foreground" />
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(`${file.directUrl}`)} title="Copy direct URL">
              <ToggleLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(`${file.maskedUrl}`)} title="Copy masked URL">
              <ToggleRight className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => window.open(file.maskedUrl, "_blank")} title="Open file">
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                const a = document.createElement('a')
                a.href = file.directUrl
                a.download = file.name // Force download with original filename
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
              }} 
              title="Download file"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => deleteFile(file.id)} title="Delete file">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

