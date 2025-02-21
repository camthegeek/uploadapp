export interface FileInfo {
  id: string
  name: string
  size: number
  uploadedAt: string
  downloadUrl: string    // Short URL for internal routing
  shortMaskedUrl: string // Short URL for internal routing
  directUrl: string     // Full URL for copying
  maskedUrl: string     // Full URL for copying
}
