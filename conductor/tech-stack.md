# Tech Stack - Language Learning Extension

## Core Technologies
- **Platform:** Chrome Extension (Manifest V3)
- **Primary API:** [Chrome Prompt API](https://developer.chrome.com/docs/ai/prompt-api) (Experimental)
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
- **Interceptor (MAIN):** Runs in the main page context to monkey-patch `fetch` and `XHR` for subtitle interception, communicating with the isolated script via `window.postMessage`.
- **Background Service Worker:** Manages the lifecycle of the Chrome Prompt API session if persistence is needed across tab changes.
- **Offscreen Documents:** (Optional) If the Prompt API requires a DOM context not available in the worker.
