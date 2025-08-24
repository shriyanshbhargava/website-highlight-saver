import cssText from "data-text:~tailwind.css"
import type { PlasmoCSConfig } from "plasmo"

import ContentOverlay from "./components/ContentOverlay"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const getShadowHostId = () => "text-highlight-saver-overlay"

export default ContentOverlay
