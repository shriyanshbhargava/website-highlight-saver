// Shared constants for the website highlight saver extension

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY
export const GEMINI_API_URL = process.env.GEMINI_API_URL
export const GEMINI_MODELS_URL = process.env.GEMINI_MODELS_URL
export const GEMINI_GENERATE_URL = process.env.GEMINI_GENERATE_URL

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required")
}

export const API_ENDPOINTS = {
  GEMINI_MODELS: GEMINI_MODELS_URL,
  GEMINI_GENERATE: GEMINI_GENERATE_URL
} as const

export const UI_CONSTANTS = {
  POPUP_WIDTH: 280,
  POPUP_HEIGHT: 384,
  MARGIN_RIGHT: 20,
  MARGIN_TOP: 20,
  MAX_TEXT_LENGTH: 100,
  MAX_SUMMARY_LENGTH: 8000
} as const

export const STORAGE_KEYS = {
  HIGHLIGHTS: "highlights"
} as const

export const ANIMATION_DURATIONS = {
  TOAST_DISPLAY: 3000,
  BUTTON_HOVER: 200
} as const
