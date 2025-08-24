# Source Code Structure

This directory contains the organized source code for the Website Highlight Saver extension.

## Directory Structure

```
src/
├── components/          # React components
│   ├── Modal.tsx       # Main popup modal for displaying highlights
│   ├── ContentOverlay.tsx # Content script overlay for text selection
│   └── index.ts        # Component exports
├── constants/           # Application constants and configuration
│   └── index.ts        # Shared constants (API keys, UI values, etc.)
├── services/            # External service integrations
│   ├── gemini.ts       # Gemini AI API service
│   └── index.ts        # Service exports
├── types/               # TypeScript type definitions
│   └── index.ts        # Shared interfaces and types
├── utils/               # Utility functions and helpers
│   └── index.ts        # Common utility functions
├── content.tsx          # Content script entry point
├── popup.tsx            # Popup entry point
├── tailwind.css         # Tailwind CSS styles
└── README.md            # This file
```

## Key Benefits of This Structure

1. **Separation of Concerns**: Each directory has a specific responsibility
2. **Type Safety**: All types are centralized in the `types/` directory
3. **Reusability**: Utility functions and constants are shared across components
4. **Maintainability**: Easy to locate and modify specific functionality
5. **Scalability**: New features can be added to appropriate directories

## Import Patterns

- **Components**: `import { Modal } from "../components"`
- **Types**: `import { HighlightData } from "../types"`
- **Utilities**: `import { formatDate } from "../utils"`
- **Constants**: `import { UI_CONSTANTS } from "../constants"`
- **Services**: `import { summarizeText } from "../services"`

## Adding New Features

1. **New Components**: Add to `components/` directory
2. **New Types**: Add to `types/index.ts`
3. **New Utilities**: Add to `utils/index.ts`
4. **New Constants**: Add to `constants/index.ts`
5. **New Services**: Add to `services/` directory

## Type Definitions

The main types used throughout the application:

- `HighlightData`: Structure for saved highlights
- `GeminiResponse`: API response structure for AI summaries
- `Position`: UI positioning coordinates
- `ToastType`: Toast notification types

## Environment Variables

**REQUIRED**: Create a `.env` file in the root directory with your API keys:

```bash
# Gemini AI API Configuration
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent
GEMINI_MODELS_URL=https://generativelanguage.googleapis.com/v1/models
GEMINI_GENERATE_URL=https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent
```

**Security Features**: 
- ✅ NO hardcoded API keys in source code
- ✅ Environment variables are required (no fallbacks)
- ✅ Validation ensures keys are set before app starts
- ✅ Never commit your `.env` file to git
- ✅ Safe for public repositories
