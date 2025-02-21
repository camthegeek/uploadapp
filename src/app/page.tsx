import { FileUpload } from "@/components/file-upload"
import { FileList } from "@/components/file-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadProvider } from "@/context/upload-context"

export default function Home() {
  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <UploadProvider>
        <Card>
          <CardHeader>
            <CardTitle>File Share</CardTitle>
            <CardDescription>Upload and share files with masked or direct URLs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FileUpload />
            <FileList />
          </CardContent>
        </Card>
      </UploadProvider>
    </main>
  )
}

