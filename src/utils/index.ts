// Utility functions for the website highlight saver extension

import { STORAGE_KEYS } from "../constants"
import { HighlightData } from "../types"

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  )

  if (diffInHours < 1) return "Just now"
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInHours < 48) return "Yesterday"
  return date.toLocaleDateString()
}

export const generateId = (): string => {
  return crypto.randomUUID()
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

export const loadHighlights = async (): Promise<HighlightData[]> => {
  try {
    const result = await chrome.storage.local.get([STORAGE_KEYS.HIGHLIGHTS])
    return result[STORAGE_KEYS.HIGHLIGHTS] || []
  } catch (error) {
    console.error("Failed to load highlights:", error)
    return []
  }
}

export const saveHighlights = async (
  highlights: HighlightData[]
): Promise<void> => {
  try {
    await chrome.storage.local.set({ [STORAGE_KEYS.HIGHLIGHTS]: highlights })
  } catch (error) {
    console.error("Failed to save highlights:", error)
    throw error
  }
}

export const addHighlight = async (highlight: HighlightData): Promise<void> => {
  try {
    const highlights = await loadHighlights()
    highlights.unshift(highlight)
    await saveHighlights(highlights)
  } catch (error) {
    console.error("Failed to add highlight:", error)
    throw error
  }
}

export const deleteHighlight = async (id: string): Promise<void> => {
  try {
    const highlights = await loadHighlights()
    const updatedHighlights = highlights.filter((h) => h.id !== id)
    await saveHighlights(updatedHighlights)
  } catch (error) {
    console.error("Failed to delete highlight:", error)
    throw error
  }
}

export const updateHighlight = async (
  id: string,
  updates: Partial<HighlightData>
): Promise<void> => {
  try {
    const highlights = await loadHighlights()
    const updatedHighlights = highlights.map((h) =>
      h.id === id ? { ...h, ...updates } : h
    )
    await saveHighlights(updatedHighlights)
  } catch (error) {
    console.error("Failed to update highlight:", error)
    throw error
  }
}
