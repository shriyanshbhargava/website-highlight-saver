// Gemini AI API service
import { API_ENDPOINTS, GEMINI_API_KEY, UI_CONSTANTS } from "../constants"
import { GeminiResponse } from "../types"

export async function summarizeText(text: string): Promise<string> {
  if (!text || text.trim().length === 0) {
    throw new Error("No text provided for summarization")
  }

  // Truncate text if too long (Gemini has input limits)
  const truncatedText = truncateText(text, UI_CONSTANTS.MAX_SUMMARY_LENGTH)

  const prompt = `Please provide a concise summary of the following text in 2-3 sentences. Focus on the key points and main ideas:

"${truncatedText}"`

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.3,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 150
    }
  }

  // Test API key first
  try {
    console.log("Testing API key...")
    const testResponse = await fetch(
      `${API_ENDPOINTS.GEMINI_MODELS}?key=${GEMINI_API_KEY}`
    )
    console.log("API key test response:", testResponse.status)
    if (!testResponse.ok) {
      throw new Error(`API key test failed: ${testResponse.status}`)
    }
  } catch (error) {
    console.error("API key test error:", error)
    throw new Error("API key validation failed - please check your key")
  }

  try {
    console.log("Making Gemini API request...")
    console.log(
      "API URL:",
      `${API_ENDPOINTS.GEMINI_GENERATE}?key=${GEMINI_API_KEY.substring(0, 10)}...`
    )
    console.log("Request body:", JSON.stringify(requestBody, null, 2))

    const response = await fetch(
      `${API_ENDPOINTS.GEMINI_GENERATE}?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      }
    )

    console.log("Response status:", response.status)
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("API Error Response:", errorData)
      throw new Error(
        `API Error (${response.status}): ${errorData.error?.message || "Failed to generate summary"}`
      )
    }

    const data: GeminiResponse = await response.json()
    console.log("API Response:", data)

    if (data.error) {
      throw new Error(`Gemini API Error: ${data.error.message}`)
    }

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No summary generated - no candidates returned")
    }

    const summary = data.candidates[0].content.parts[0].text.trim()
    console.log("Generated summary:", summary)
    return summary
  } catch (error) {
    console.error("Gemini API Error:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to generate summary")
  }
}

function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
}
