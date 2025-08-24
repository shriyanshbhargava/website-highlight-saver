import cssText from "data-text:~tailwind.css"
import { Save, X } from "lucide-react"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useRef, useState } from "react"

import { ANIMATION_DURATIONS, UI_CONSTANTS } from "../constants"
import { HighlightData, Position, ToastType } from "../types"
import { addHighlight, generateId } from "../utils"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const getShadowHostId = () => "text-highlight-saver-overlay"

const PlasmoOverlay = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedText, setSelectedText] = useState("")
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection()
      if (!selection || selection.toString().trim() === "") {
        setIsVisible(false)
        return
      }

      const text = selection.toString().trim()
      if (text.length < 3) {
        setIsVisible(false)
        return
      }

      setSelectedText(text)

      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      // Calculate position - always to the right of selection
      const popupWidth = UI_CONSTANTS.POPUP_WIDTH
      const marginRight = UI_CONSTANTS.MARGIN_RIGHT
      const marginTop = UI_CONSTANTS.MARGIN_TOP

      let xPosition = rect.right + 20 // 20px to the right of selection
      let yPosition = rect.top

      // Ensure popup doesn't go off-screen to the right
      if (xPosition + popupWidth > window.innerWidth - marginRight) {
        xPosition = rect.left - popupWidth - 20 // Show to the left if not enough space on right
      }

      // Ensure popup doesn't go off-screen vertically
      if (yPosition < marginTop) {
        yPosition = marginTop
      } else if (yPosition + 100 > window.innerHeight - 20) {
        yPosition = window.innerHeight - 120 // 120px from bottom
      }

      setPosition({
        x: xPosition,
        y: yPosition
      })

      setIsVisible(true)
    }

    const handleKeyboardShortcut = (e: KeyboardEvent) => {
      // Check for Ctrl+I (save highlight shortcut)
      if (e.ctrlKey && e.key === "i") {
        e.preventDefault() // Prevent default browser behavior

        const selection = window.getSelection()
        if (selection && selection.toString().trim().length >= 3) {
          const text = selection.toString().trim()
          saveHighlightFromContext(text)
        } else {
          // Show warning if no text is selected
          showToast("Please select some text first", "warning")
        }
      }
    }

    document.addEventListener("selectionchange", handleSelection)
    document.addEventListener("keydown", handleKeyboardShortcut)
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setIsVisible(false)
      }
    })

    return () => {
      document.removeEventListener("selectionchange", handleSelection)
      document.removeEventListener("keydown", handleKeyboardShortcut)
    }
  }, [])

  const saveHighlight = async () => {
    await saveHighlightFromContext(selectedText)
    setIsVisible(false)
  }

  const showToast = (message: string, type: ToastType = "success") => {
    const toastDiv = document.createElement("div")
    toastDiv.textContent = message

    let backgroundColor = "rgba(16, 185, 129, 0.95)" // success - green
    if (type === "warning") backgroundColor = "rgba(245, 158, 11, 0.95)" // warning - amber
    if (type === "error") backgroundColor = "rgba(239, 68, 68, 0.95)" // error - red

    toastDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${backgroundColor};
      backdrop-filter: blur(10px);
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.2);
      animation: slideIn 0.3s ease-out;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
    `

    const style = document.createElement("style")
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `
    document.head.appendChild(style)
    document.body.appendChild(toastDiv)

    setTimeout(() => {
      toastDiv.remove()
      style.remove()
    }, ANIMATION_DURATIONS.TOAST_DISPLAY)
  }

  const saveHighlightFromContext = async (text: string) => {
    const highlight: HighlightData = {
      text: text,
      url: window.location.href,
      title: document.title,
      timestamp: Date.now(),
      id: generateId()
    }

    try {
      await addHighlight(highlight)

      // Show success toast
      showToast("Highlight saved! ✨ (Ctrl+I)")
    } catch (error) {
      console.error("Failed to save highlight:", error)
      showToast("Failed to save highlight", "error")
    }
  }

  if (!isVisible) return null

  return (
    <div
      ref={popupRef}
      style={{
        position: "fixed",
        zIndex: 10000,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderRadius: "12px",
        boxShadow:
          "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        padding: "12px",
        maxWidth: `${UI_CONSTANTS.POPUP_WIDTH}px`,
        left: position.x,
        top: position.y
      }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "8px"
        }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start"
          }}>
          <span
            style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151"
            }}>
            Save Highlight?
          </span>
          <span
            style={{
              fontSize: "11px",
              color: "#9ca3af",
              fontWeight: "400"
            }}>
            (or Ctrl+I)
          </span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            color: "#9ca3af",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "4px",
            border: "none",
            background: "transparent"
          }}>
          <X size={16} />
        </button>
      </div>

      <div
        style={{
          fontSize: "13px",
          color: "#6b7280",
          marginBottom: "12px",
          lineHeight: "1.4"
        }}>
        "
        {selectedText.length > UI_CONSTANTS.MAX_TEXT_LENGTH
          ? selectedText.substring(0, UI_CONSTANTS.MAX_TEXT_LENGTH) + "..."
          : selectedText}
        "
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={saveHighlight}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            background: "rgba(37, 99, 235, 0.9)",
            color: "white",
            fontSize: "14px",
            fontWeight: "500",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            flex: "1",
            justifyContent: "center",
            transition: `all ${ANIMATION_DURATIONS.BUTTON_HOVER}ms`
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(29, 78, 216, 0.9)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(37, 99, 235, 0.9)")
          }>
          <Save size={16} />
          Save
        </button>
      </div>
    </div>
  )
}

export default PlasmoOverlay
