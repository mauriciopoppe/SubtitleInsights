# Specification: Refactor Extension Toggle to Preact

## Context
The extension's main toggle button (inserted into the YouTube player's right controls) is currently created using vanilla DOM manipulation in `setupToggle` inside `index.tsx`. This makes it harder to manage state-based UI changes (like icons or opacity) compared to the rest of the Preact-based UI.

## Goal
Replace the imperative `setupToggle` logic with a declarative `<ExtensionToggle />` Preact component.

## Requirements

### Component Design
Create `ExtensionToggle.tsx` that:
1.  Uses `useConfig` to get the `isEnabled` state.
2.  Uses `useSubtitleStore` to get `aiStatus` (optional, for future icon enhancements).
3.  Renders a `button` with the same class names (`ytp-button lle-toggle-btn`) and SVG icon.
4.  Correctly updates `aria-pressed` and styles based on the `isEnabled` state.
5.  Calls `Config.setIsEnabled` on click.

### Integration
1.  Update `index.tsx` to find the injection point (`.ytp-right-controls`).
2.  Mount the `<ExtensionToggle />` component into a wrapper container.
3.  Ensure the button is inserted *before* the `.ytp-subtitles-button` to match existing behavior.

## Functional Parity
*   The button must look and behave exactly as it does now.
*   It must respond instantly to configuration changes.
