"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

type UploadContextType = {
  refreshTrigger: number
  triggerRefresh: () => void
}

const UploadContext = createContext<UploadContextType | undefined>(undefined)

export function UploadProvider({ children }: { children: React.ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  return <UploadContext.Provider value={{ refreshTrigger, triggerRefresh }}>{children}</UploadContext.Provider>
}

export function useUploadContext() {
  const context = useContext(UploadContext)
  if (context === undefined) {
    throw new Error("useUploadContext must be used within an UploadProvider")
  }
  return context
}

