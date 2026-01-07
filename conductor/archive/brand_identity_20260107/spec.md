# Specification: Brand & Identity Definition

## Overview
Establish a formal brand identity for "Subtitle Insights" by documenting the visual guidelines, color palette, motto, and logo concept in the core product documentation. This ensures consistency in future UI/UX decisions and marketing materials.

## Functional Requirements
- **Documentation Update:** Add a new "Brand & Identity" section to `conductor/product.md` following the "Core Value Proposition" section.
- **Brand Motto:** Document the official motto: "Subtitle data, clarified."
- **Logo Concept:** Document the "Waveform Text" concept (Minimalist): Three horizontal lines of varying lengths (representing subtitle lines) where the middle line turns into a bar chart or a pulse/waveform.
- **Color Palette Definition:**
  - **Brand Blue (#3ea6ff):** Cool and trustworthy. Used for Action & Structure (Links, Primary Buttons, Navbar).
  - **Accent Yellow (#ffd600):** Urgent, Intelligence & Focus. Used for highlights (Error warnings, Active segments, "Pro" features).
  - **Background (#0f0f0f):** The "Canvas" (Main workspace, Sidebar).
  - **Neutral (Paper White) (#f8fafc):** Primary text for readability (WCAG AAA compliance).
- **Design Guidelines:**
  - Include the "Checklist for Yellow on Dark Backgrounds":
    - Avoid Yellow Text (use for icons, borders, and accents instead).
    - Contrast Ratio: Maintain high accessibility (13:1).
    - Sparing Usage: Use yellow bright accents sparingly for maximum impact.

## Non-Functional Requirements
- **Consistency:** Ensure the tone of the documentation matches the established "Functional Brevity" guideline.

## Acceptance Criteria
- [ ] `conductor/product.md` contains a new "Brand & Identity" section.
- [ ] The motto and logo concept are clearly described.
- [ ] The color palette and specific hex codes are documented.
- [ ] The technical usage rules for yellow on dark backgrounds are included.

## Out of Scope
- Implementing these colors in the extension's CSS (reserved for a future track).
- Generating image assets for the logo.
