// Shared types for the website highlight saver extension

export interface HighlightData {
  text: string
  url: string
  title: string
  timestamp: number
  id: string
  summary?: string
}

export interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string
      }>
    }
  }>
  error?: {
    message: string
    code: number
  }
}

export interface Position {
  x: number
  y: number
}

export type ToastType = "success" | "warning" | "error"
