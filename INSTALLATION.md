# Installation Guide for Text Highlight Saver

## 🚀 Quick Installation

### Step 1: Download the Extension

1. Download the `chrome-mv3-prod` folder from the build directory
2. Or use the development build from `chrome-mv3-dev` folder

### Step 2: Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `chrome-mv3-prod` folder
5. The extension should now appear in your extensions list

### Step 3: Pin to Toolbar

1. Click the puzzle piece icon in Chrome toolbar
2. Find "Text Highlight Saver" in the list
3. Click the pin icon to keep it visible in your toolbar

## 🧪 Testing the Extension

### Test Page

1. Open the `test-page.html` file in your browser
2. Select any text on the page
3. You should see a popup asking "Save Highlight?"
4. Click "Save" to store the highlight

### Extension Popup

1. Click the extension icon in your toolbar
2. You should see a popup with all saved highlights
3. Test the search, copy, and delete functionality

## 🔧 Development Mode

If you want to develop and test changes:

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Load the extension from build/chrome-mv3-dev/
```

## 📱 Features to Test

- ✅ **Text Selection**: Select text on any webpage
- ✅ **Save Popup**: Modern popup appears near selection
- ✅ **Highlight Storage**: Highlights saved locally
- ✅ **Extension Popup**: View all saved highlights
- ✅ **Search**: Search through highlights
- ✅ **Copy**: Copy highlighted text to clipboard
- ✅ **Delete**: Remove unwanted highlights
- ✅ **Navigation**: Open original pages

## 🐛 Troubleshooting

### Extension Not Working?

1. Check if it's enabled in `chrome://extensions/`
2. Make sure you're on a supported website (should work on all sites)
3. Try refreshing the page
4. Check browser console for errors

### Popup Not Showing?

1. Verify the extension is pinned to toolbar
2. Check if popup is blocked by browser
3. Try clicking the extension icon multiple times

### Highlights Not Saving?

1. Check browser storage permissions
2. Verify the extension has storage permission
3. Check browser console for storage errors

## 🌐 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Edge (Chromium-based)
- ✅ Other Chromium browsers
- ❌ Firefox (not supported)

## 📝 Notes

- All highlights are stored locally in your browser
- No data is sent to external servers
- The extension works on all websites
- Highlights include text, URL, title, and timestamp

---

Happy highlighting! 🎉
