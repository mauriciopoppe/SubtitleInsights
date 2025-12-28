# Spec: Remove Hover Meaning Functionality

## Overview
Remove the ability to get definitions/meanings on hover to simplify the extension and focus on core subtitle features.

## Functional Requirements
- **Remove Event Listeners:** Delete `mouseover` and `mouseout` listeners responsible for the hover tooltip logic in `src/content/index.ts`.
- **Remove Tooltip DOM:** Remove the `createTooltip` function and its call in `init`.
- **Clean up Rendering:** Remove the `.lle-word` class from the output of `renderSegmentedText` in `src/content/render.ts`.
- **Clean up Styles:** Remove `.lle-tooltip`, `.lle-word`, and `.lle-word:hover` styles from `src/content/styles.css`.

## Non-Functional Requirements
- **Code Cleanliness:** Ensure no dead code related to the hover functionality remains in the content script.
- **Maintain AI Capability:** Keep the `literal` mode in `AIClient` for potential future use.

## Acceptance Criteria
- [ ] Hovering over Kanji or words no longer displays a tooltip.
- [ ] No `lle-tooltip` or `lle-word` elements/classes exist in the DOM during playback.
- [ ] CSS file no longer contains styles for the tooltip or word hover effects.
- [ ] The `literal` translation mode remains available in `ai.ts`.
