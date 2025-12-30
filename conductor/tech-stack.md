# Tech Stack - Language Learning Extension

## Core Technologies
- **Platform:** Chrome Extension (Manifest V3)
- **Primary API:** [Chrome Prompt API](https://developer.chrome.com/docs/ai/prompt-api) (Experimental)
- **Translation API:** [Chrome Translation API](https://developer.chrome.com/docs/ai/translator-api) (Experimental)
- **Language:** TypeScript
- **Build Tool:** Vite (with @crxjs/vite-plugin for extension support)

## Frontend & UI
- **Framework:** Vanilla TypeScript (DOM manipulation)
- **Styling:** CSS3 (Standard CSS variables for theming)
- **Icons:** SVG (Internal)

## Development & Tooling
- **Package Manager:** NPM
- **Linter:** ESLint (with TypeScript recommended rules)
- **Formatter:** Prettier
- **Testing:** Vitest (for utility logic)

## Architecture
- **Content Scripts (ISOLATED):** Main extension logic, DOM injection, and subtitle synchronization.
- **Background Service Worker:** Intercepts YouTube subtitle requests via `chrome.webRequest`, re-fetches data, and broadcasts to content scripts. Also manages Prompt API sessions.
- **Offscreen Documents:** (Optional) If the Prompt API requires a DOM context not available in the worker.
