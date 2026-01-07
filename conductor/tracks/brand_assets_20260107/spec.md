# Specification: Brand Asset Integration & Extension Theming

## Overview
Integrate the newly defined brand assets (logo, colors, motto) into the extension's core UI components, including the YouTube toolbar enabler, the manifest icon, and the settings page. This also includes aligning the settings page and documentation site with the full brand identity.

## Functional Requirements
- **Manifest Integration:**
  - Update `manifest.json` to use `docs/public/logo.svg` as the extension icon (assuming modern Chrome support).
- **YouTube Toolbar Enabler:**
  - Replace the current extension icon/enabler in the YouTube video control bar with `logo.svg`.
  - Apply `filter: grayscale(1)` via CSS when the extension is disabled.
- **Settings Page (options.html) Branding:**
  - **Logo:** Center the logo at the top of the settings page.
  - **Motto:** Include "Subtitle data, clarified." in the header.
  - **Colors:**
    - Header/Navbar accents in Brand Blue (#3ea6ff).
    - Primary buttons in Brand Blue.
    - Warnings or analytical highlights in Accent Yellow (#ffd600) (respecting the "Avoid Yellow Text" rule).
  - **Waveform Concept:** Use the waveform motif as a visual separator between settings sections.
- **Documentation Site Refinement:**
  - Add the Brand Motto to the documentation site header/home page.
  - Integrate the waveform concept as a stylized separator or background element.

## Non-Functional Requirements
- **Visual Consistency:** The grayscale filter on the toolbar should feel native to YouTube's "Off" state for features like CC.
- **Grayscale Clarity:** Ensure the logo remains recognizable even when grayscale.

## Acceptance Criteria
- [ ] Extension icon in Chrome's extension manager is the new logo.
- [ ] YouTube toolbar icon uses the new logo and turns grayscale when disabled.
- [ ] Settings page features the centered logo, motto, and brand colors.
- [ ] Settings page uses the waveform motif as a separator.
- [ ] Documentation site header or home page includes the motto.

## Out of Scope
- Creating a separate grayscale SVG file.
- Changes to the internal AI processing logic.
