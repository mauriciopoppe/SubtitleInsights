# Specification: Extension Icon Visibility Improvements

## Overview
The extension icon in the YouTube toolbar is currently hard to distinguish between enabled and disabled states. Other YouTube icons are more visible due to clear outlines and distinct opacity levels. This track will enhance the visibility of our logo by adding a stroke/outline to the SVG elements and standardizing the styling via CSS classes.

## Functional Requirements

### 1. SVG Outline Enhancement
- Modify the inline SVG in `src/content/components/ExtensionToggle.tsx`.
- Add `stroke="currentColor"` and `stroke-width="1.5"` (or similar appropriate value) to the primary paths/elements of the logo.
- Ensure the `stroke-linejoin="round"` and `stroke-linecap="round"` attributes are used for a consistent look.

### 2. Standardized Icon Styling (CSS)
- Move styling logic from inline `ExtensionToggle.tsx` to `src/content/styles.css`.
- Define classes for Enabled and Disabled states:
    - **Enabled:** `opacity: 1.0`, `filter: grayscale(1)`.
    - **Disabled:** `opacity: 0.4`, `filter: grayscale(1)`.
- The icon should remain monochrome (monochrome grayscale) to match YouTube's aesthetic.

### 3. State Management in Component
- Update `ExtensionToggle.tsx` to apply the new CSS classes based on the `isEnabled` state.
- Keep the existing `.active` class logic for the red underline when the settings menu is open.

## Non-Functional Requirements
- **Legibility:** The icon should be easily recognizable at small sizes (approx 24x24px).
- **Consistency:** The stroke and opacity should match the visual weight of neighboring YouTube toolbar icons (CC, Settings, etc.).

## Acceptance Criteria
- [ ] The extension icon has a visible outline/stroke.
- [ ] There is a clear visual difference in opacity between the enabled and disabled states.
- [ ] All icon styling is handled via CSS classes instead of inline styles.
- [ ] The icon remains grayscale in both states.
