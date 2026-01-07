# Specification: Implement Brand Visual Identity in Extension CSS

## Overview

Transition the extension's UI from generic colors to the established brand identity. The focus is on a professional, high-end "grayscale" aesthetic where Brand Blue (#3ea6ff) is used exclusively to denote active states and structural focus.

## Functional Requirements

- **CSS Variables Definition:** Define the core brand palette in `src/content/styles.css` using `:root` variables:
  - `--si-color-brand-blue: #3ea6ff`
  - `--si-color-accent-yellow: #ffd600`
  - `--si-color-bg-canvas: #0f0f0f`
  - `--si-color-text-primary: #f8fafc`
- **Sidebar Aesthetic:**
  - Ensure the sidebar background is transparent or matches the player canvas smoothly.
  - **Active Segment:** The `border-left` of the currently playing segment must use `--si-color-brand-blue`.
- **Interactive Element States:**
  - **Active State:** Any "Active" or "Enabled" button/toggle state (excluding the YouTube player toggle) should transition to `--si-color-brand-blue`.
  - **Neutral/Hover States:** Maintain a bland, grayscale look (shades of gray/white) to keep the focus on content.
- **YouTube Toggle Consistency:** The extension icon's red underline in the YouTube player control bar remains `#f00` to align with the platform's visual language for active features (like CC).

## Non-Functional Requirements

- **High-End Feel:** Maintain a minimalist, professional look by using color sparingly.
- **Accessibility:** Ensure all color combinations (especially blue on dark) meet WCAG readability standards.

## Acceptance Criteria

- [ ] Brand colors are defined as CSS variables in `src/content/styles.css`.
- [ ] The active sidebar segment features a Brand Blue left border.
- [ ] Active UI toggles use Brand Blue.
- [ ] The general UI (hover, non-active) is grayscale.
- [ ] The YouTube toggle underline remains red.

## Out of Scope

- Adding the brand logo/waveform (to be handled in a separate asset-focused track).
- Changes to the settings page (options.html).
