# Text Highlight Saver

A modern Chrome extension that allows users to highlight text on any webpage and save highlights locally with a beautiful, intuitive interface.

## Features

✨ **Smart Text Selection**: Select any text on any webpage to save as a highlight
🎯 **Contextual Popup**: Clean, modern popup appears near your selection asking "Save Highlight?"
💾 **Local Storage**: All highlights are saved locally in your browser for privacy
🔍 **Search & Organize**: Search through your saved highlights by text or page title
📋 **Copy & Paste**: One-click copy of highlighted text to clipboard
🗑️ **Easy Management**: Delete highlights you no longer need
🌐 **Page Navigation**: Click to open the original page where you made the highlight
📱 **Modern UI**: Beautiful, responsive design with smooth animations

## How to Use

### Saving Highlights

1. **Select Text**: Highlight any text on any webpage
2. **Save Popup**: A modern popup will appear asking "Save Highlight?"
3. **Click Save**: Click the save button to store your highlight
4. **Success**: You'll see a confirmation message

### Managing Highlights

1. **Extension Icon**: Click the extension icon in your Chrome toolbar
2. **Browse**: View all your saved highlights in a scrollable list
3. **Search**: Use the search bar to find specific highlights
4. **Copy**: Click the "Copy" button to copy highlighted text to clipboard
5. **Delete**: Click the "Delete" button to remove unwanted highlights
6. **Navigate**: Click the external link icon to open the original page

## Installation

### Development

1. Clone this repository
2. Install dependencies: `pnpm install`
3. Run development mode: `pnpm dev`
4. Load the extension in Chrome from the `build/chrome-mv3-dev` folder

### Production Build

1. Build the extension: `pnpm build`
2. Load the extension in Chrome from the `build/chrome-mv3-prod` folder

## Technical Details

- **Framework**: Built with React and TypeScript
- **Styling**: Modern UI with Tailwind CSS
- **Icons**: Beautiful icons from Lucide React
- **Storage**: Chrome Extension Storage API for local data persistence
- **Architecture**: Content script for text selection, popup for management

## Privacy

- All highlights are stored locally in your browser
- No data is sent to external servers
- Your browsing data remains completely private

## Browser Support

- Chrome (Chrome Web Store ready)
- Edge (Chromium-based)
- Other Chromium-based browsers

## License

MIT License - feel free to use and modify as needed!

---

Built with ❤️ using modern web technologies
