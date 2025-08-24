import cssText from "data-text:~tailwind.css"
import type { PlasmoGetStyle } from "plasmo"

import HighlightPopup from "./components/Modal"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

// Ensure CSS is injected when popup loads
if (typeof document !== "undefined") {
  const style = document.createElement("style")
  style.textContent = cssText
  document.head.appendChild(style)
}

const Popup = () => {
  return <HighlightPopup />
}

export default Popup
