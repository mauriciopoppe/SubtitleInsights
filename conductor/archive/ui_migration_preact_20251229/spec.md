# Specification: UI Framework Migration (Preact)

## Context

The current UI (`Sidebar` and `Overlay`) is built using imperative vanilla DOM manipulation (`document.createElement`, `innerHTML`). This approach is verbose, error-prone, and difficult to maintain as the application grows.

## Goal

Migrate the existing UI code to **Preact**, a lightweight alternative to React, to leverage a declarative component model, better state management, and the rich ecosystem of React-like development tools.

## Requirements

### Technical

1.  **Framework:** Preact (latest version).
2.  **State Management:** Use standard Preact hooks (`useState`, `useEffect`) or `@preact/signals` for performance if needed.
3.  **Build System:** Update Vite configuration to support JSX/TSX.
4.  **Styling:** Continue using CSS modules or standard CSS, but organized per component if possible (or keep global `styles.css` for now to minimize scope creep).

### Functional Parity

The new Preact UI must support all existing features:

1.  **Sidebar:**
    - List of subtitle segments.
    - Highlighting of the active segment.
    - "Sync" button to jump to active segment.
    - "Upload" button for SRT files.
    - Toggle buttons for Overlay and AI Grammar.
    - Status icons (AI downloading/ready, warnings).
2.  **Overlay:**
    - Display original text, translation, literal translation, analysis, and grammar gotchas.
    - Show/Hide based on configuration.
3.  **Integration:**
    - Must react to `SubtitleStore` updates.
    - Must react to `Config` updates (settings toggles).

## Non-Goals

- A complete visual redesign. The look and feel should remain identical to the current implementation.
- Moving away from `SubtitleStore` as the source of truth (the UI should just reflect the store state).

## Architecture

- **Roots:** We will likely have two Preact roots: one for the Sidebar and one for the Overlay.
- **Store Connection:** Create a custom hook `useSubtitleStore` to subscribe components to the existing vanilla `SubtitleStore`.
