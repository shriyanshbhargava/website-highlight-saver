import {
  Bookmark,
  Copy,
  ExternalLink,
  Loader2,
  Search,
  Sparkles,
  Trash2,
  X
} from "lucide-react"
import { useEffect, useState } from "react"

import { summarizeText } from "../services"
import { HighlightData } from "../types"
import {
  deleteHighlight,
  formatDate,
  loadHighlights,
  updateHighlight
} from "../utils"

const HighlightPopup = () => {
  const [highlights, setHighlights] = useState<HighlightData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [loadingSummaries, setLoadingSummaries] = useState<Set<string>>(
    new Set()
  )
  const [expandedSummaries, setExpandedSummaries] = useState<Set<string>>(
    new Set()
  )

  // Fallback styles in case Tailwind CSS doesn't load
  const fallbackStyles = {
    container: {
      width: "384px",
      height: "384px",
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      borderRadius: "16px",
      boxShadow:
        "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      display: "flex",
      flexDirection: "column" as const
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px",
      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
      background: "rgba(255, 255, 255, 0.1)"
    },
    title: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#111827"
    },
    searchContainer: {
      padding: "16px",
      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
      background: "rgba(255, 255, 255, 0.05)"
    },
    searchInput: {
      width: "100%",
      paddingLeft: "40px",
      paddingRight: "16px",
      paddingTop: "8px",
      paddingBottom: "8px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "14px"
    },
    highlightsList: {
      flex: "1",
      overflowY: "auto" as const,
      padding: "16px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "12px"
    },
    highlightCard: {
      background: "rgba(255, 255, 255, 0.7)",
      backdropFilter: "blur(5px)",
      borderRadius: "12px",
      padding: "16px",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      transition: "all 0.2s",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)"
    },
    iconButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "36px",
      height: "36px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s"
    },
    openButton: {
      backgroundColor: "#6366f1",
      color: "white"
    },
    copyButton: {
      backgroundColor: "#2563eb",
      color: "white"
    },
    aiButton: {
      backgroundColor: "#7c3aed",
      color: "white"
    },
    deleteButton: {
      backgroundColor: "#dc2626",
      color: "white"
    }
  }

  useEffect(() => {
    loadHighlightsFromStorage()
  }, [])

  const loadHighlightsFromStorage = async () => {
    try {
      const highlightsList = await loadHighlights()
      console.log("Loaded highlights from storage:", highlightsList)
      setHighlights(highlightsList)
    } catch (error) {
      console.error("Failed to load highlights:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteHighlight = async (id: string) => {
    try {
      await deleteHighlight(id)
      setHighlights((prev) => prev.filter((h) => h.id !== id))
    } catch (error) {
      console.error("Failed to delete highlight:", error)
    }
  }

  const copyHighlight = async (text: string, highlightId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // Show temporary success feedback
      const button = document.querySelector(
        `[data-highlight-id="${highlightId}"]`
      ) as HTMLButtonElement
      if (button) {
        // Store original button state
        const originalBackground = button.style.backgroundColor
        const originalIcon = button.querySelector("svg")

        // Change to success state
        button.style.backgroundColor = "#059669" // green-600
        button.style.transform = "scale(1.05)"

        // Create floating success notification
        const notification = document.createElement("div")
        notification.textContent = "Copied! ✨"
        notification.style.cssText = `
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(16, 185, 129, 0.95);
          backdrop-filter: blur(10px);
          color: white;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
          z-index: 1000;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: fadeInOut 1.5s ease-in-out;
        `

        // Add animation styles
        const style = document.createElement("style")
        style.textContent = `
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
            20% { opacity: 1; transform: translateX(-50%) translateY(0); }
            80% { opacity: 1; transform: translateX(-50%) translateY(0); }
            100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `
        document.head.appendChild(style)

        // Position notification relative to button
        button.style.position = "relative"
        button.appendChild(notification)

        // Change icon to checkmark temporarily
        if (originalIcon) {
          originalIcon.style.display = "none"
          const checkIcon = document.createElement("div")
          checkIcon.innerHTML = "✓"
          checkIcon.style.cssText = `
            color: white;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
          `
          button.appendChild(checkIcon)

          // Remove check icon and restore original after delay
          setTimeout(() => {
            button.style.backgroundColor = originalBackground
            button.style.transform = "scale(1)"
            if (checkIcon.parentNode) {
              checkIcon.parentNode.removeChild(checkIcon)
            }
            if (notification.parentNode) {
              notification.parentNode.removeChild(notification)
            }
            if (originalIcon) {
              originalIcon.style.display = "block"
            }
            // Clean up style
            if (style.parentNode) {
              style.parentNode.removeChild(style)
            }
          }, 1500)
        }
      }
    } catch (error) {
      console.error("Failed to copy text:", error)
    }
  }

  const openUrl = (url: string) => {
    chrome.tabs.create({ url })
  }

  const summarizeWithAI = async (highlightId: string) => {
    const highlight = highlights.find((h) => h.id === highlightId)
    if (!highlight) return

    // Don't generate if already loading or already has summary
    if (loadingSummaries.has(highlightId)) return

    try {
      // Add to loading set
      setLoadingSummaries((prev) => new Set(prev).add(highlightId))

      // Generate summary using Gemini API
      const summary = await summarizeText(highlight.text)

      // Update highlights with the new summary
      setHighlights((prev) =>
        prev.map((h) => (h.id === highlightId ? { ...h, summary } : h))
      )

      // Update storage with the summary
      await updateHighlight(highlightId, { summary })

      // Expand the summary to show it
      setExpandedSummaries((prev) => new Set(prev).add(highlightId))
    } catch (error) {
      console.error("Failed to generate AI summary:", error)

      // Show more detailed error message
      let errorMessage = "Failed to generate summary. Please try again."
      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`
      }

      alert(errorMessage)
    } finally {
      // Remove from loading set
      setLoadingSummaries((prev) => {
        const newSet = new Set(prev)
        newSet.delete(highlightId)
        return newSet
      })
    }
  }

  const filteredHighlights = highlights.filter(
    (highlight) =>
      highlight.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      highlight.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div style={fallbackStyles.container}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%"
          }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              border: "2px solid #2563eb",
              borderTop: "2px solid transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }}></div>
        </div>
      </div>
    )
  }

  return (
    <div style={fallbackStyles.container}>
      {/* Header */}
      <div style={fallbackStyles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Bookmark style={{ color: "#2563eb" }} size={20} />
          <h1 style={fallbackStyles.title}>Saved Highlights</h1>
          <span
            style={{
              backgroundColor: "#dbeafe",
              color: "#1e40af",
              fontSize: "12px",
              fontWeight: "500",
              padding: "4px 8px",
              borderRadius: "9999px"
            }}>
            {highlights.length}
          </span>
        </div>
      </div>

      {/* Search */}
      <div style={fallbackStyles.searchContainer}>
        <div style={{ position: "relative" }}>
          <Search
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9ca3af"
            }}
            size={16}
          />
          <input
            type="text"
            placeholder="Search highlights..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={fallbackStyles.searchInput}
          />
        </div>
      </div>

      {/* Highlights List */}
      <div style={fallbackStyles.highlightsList}>
        {/* Debug info */}
        <div
          style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px" }}>
          Total highlights: {highlights.length} | Filtered:{" "}
          {filteredHighlights.length}
        </div>

        {filteredHighlights.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 16px" }}>
            {searchTerm ? (
              <div style={{ color: "#6b7280" }}>
                <Search
                  style={{ margin: "0 auto 8px", color: "#d1d5db" }}
                  size={24}
                />
                <p>No highlights found for "{searchTerm}"</p>
              </div>
            ) : (
              <div style={{ color: "#6b7280" }}>
                <Bookmark
                  style={{ margin: "0 auto 8px", color: "#d1d5db" }}
                  size={24}
                />
                <p>No highlights saved yet</p>
                <p style={{ fontSize: "14px" }}>
                  Select text on any webpage to save highlights
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#9ca3af",
                    marginTop: "8px"
                  }}>
                  💡 Tip: Use <strong>Ctrl+I</strong> to save selected text
                  quickly
                </p>
              </div>
            )}
          </div>
        ) : (
          filteredHighlights.map((highlight) => (
            <div key={highlight.id} style={fallbackStyles.highlightCard}>
              <div style={{ marginBottom: "12px" }}>
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#111827",
                    lineHeight: "1.25"
                  }}>
                  {highlight.title}
                </h3>
              </div>

              <div
                style={{
                  background: "rgba(59, 130, 246, 0.1)",
                  backdropFilter: "blur(5px)",
                  borderRadius: "8px",
                  padding: "12px",
                  marginBottom: "12px",
                  borderLeft: "4px solid #2563eb",
                  border: "1px solid rgba(59, 130, 246, 0.2)"
                }}>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#374151",
                    lineHeight: "1.5"
                  }}>
                  "{highlight.text}"
                </p>
              </div>

              {/* AI Summary Section */}
              {highlight.summary && (
                <div
                  style={{
                    background: "rgba(16, 185, 129, 0.95)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "16px",
                    border: "2px solid rgba(16, 185, 129, 0.3)",
                    boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.2)",
                    position: "relative" as const
                  }}>
                  {/* Summary Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                      paddingBottom: "8px",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.2)"
                    }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}>
                      <div
                        style={{
                          background: "rgba(255, 255, 255, 0.2)",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                        <Sparkles size={14} style={{ color: "white" }} />
                      </div>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: "700",
                          color: "white",
                          textTransform: "uppercase" as const,
                          letterSpacing: "1px"
                        }}>
                        AI Summary
                      </span>
                    </div>

                    {/* Close Button */}
                    <button
                      onClick={async () => {
                        setHighlights((prev) =>
                          prev.map((h) =>
                            h.id === highlight.id
                              ? { ...h, summary: undefined }
                              : h
                          )
                        )
                        // Also update storage
                        await updateHighlight(highlight.id, {
                          summary: undefined
                        })
                      }}
                      style={{
                        background: "rgba(255, 255, 255, 0.2)",
                        border: "none",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      title="Close summary"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255, 255, 255, 0.3)"
                        e.currentTarget.style.transform = "scale(1.1)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255, 255, 255, 0.2)"
                        e.currentTarget.style.transform = "scale(1)"
                      }}>
                      <X size={12} style={{ color: "white" }} />
                    </button>
                  </div>

                  {/* Summary Content */}
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      padding: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.2)"
                    }}>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "white",
                        lineHeight: "1.6",
                        fontWeight: "500",
                        margin: "0",
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)"
                      }}>
                      {highlight.summary}
                    </p>
                  </div>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                    backgroundColor: "#f3f4f6",
                    padding: "4px 8px",
                    borderRadius: "9999px"
                  }}>
                  {formatDate(highlight.timestamp)}
                </span>

                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => openUrl(highlight.url)}
                    style={{
                      ...fallbackStyles.iconButton,
                      ...fallbackStyles.openButton
                    }}
                    title="Open page"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }>
                    <ExternalLink size={16} />
                  </button>

                  <button
                    onClick={() => copyHighlight(highlight.text, highlight.id)}
                    data-highlight-id={highlight.id}
                    style={{
                      ...fallbackStyles.iconButton,
                      ...fallbackStyles.copyButton
                    }}
                    title="Copy text"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }>
                    <Copy size={16} />
                  </button>

                  <button
                    onClick={() => summarizeWithAI(highlight.id)}
                    disabled={loadingSummaries.has(highlight.id)}
                    style={{
                      ...fallbackStyles.iconButton,
                      ...fallbackStyles.aiButton,
                      opacity: loadingSummaries.has(highlight.id) ? 0.6 : 1,
                      cursor: loadingSummaries.has(highlight.id)
                        ? "not-allowed"
                        : "pointer"
                    }}
                    title={
                      loadingSummaries.has(highlight.id)
                        ? "Generating summary..."
                        : "Summarize with AI"
                    }
                    onMouseEnter={(e) =>
                      !loadingSummaries.has(highlight.id) &&
                      (e.currentTarget.style.transform = "scale(1.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }>
                    {loadingSummaries.has(highlight.id) ? (
                      <Loader2
                        size={16}
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                    ) : (
                      <Sparkles size={16} />
                    )}
                  </button>

                  <button
                    onClick={() => handleDeleteHighlight(highlight.id)}
                    style={{
                      ...fallbackStyles.iconButton,
                      ...fallbackStyles.deleteButton
                    }}
                    title="Delete highlight"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default HighlightPopup
