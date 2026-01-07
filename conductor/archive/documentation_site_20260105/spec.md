# Specification: Documentation Site (VitePress)

## Overview

Create a professional, flat documentation website for Subtitle Insights using VitePress. The site will be located in a new `docs/` directory and will serve as the primary user guide, explaining the extension's features and setup process.

## Functional Requirements

### 1. VitePress Setup

- Initialize VitePress in the `docs/` directory.
- Configure `docs/.vitepress/config.ts` with the project name "Subtitle Insights".
- Implement a custom dark-first theme using YouTube's color palette (Background: `#0f0f0f`, Accents: `#3ea6ff`).

### 2. Information Architecture

The documentation will have a flat sidebar with three primary sections:

#### Section 1: Introduction

- **What is Subtitle Insights?**: High-level overview based on the Core Value Proposition in `product.md`.
- **Getting Started**:
  - Requirement for Chrome 127+ (or Canary).
  - Guide for enabling experimental flags (`chrome://flags`).
  - Steps to load the extension via "Load unpacked" in Developer Mode.
- **Comparisons with other extensions**: Comparisons highlighting Local AI/Privacy, Zero-server architecture, and seamless native UX compared to tools like asbplayer.

#### Section 2: Features

- **Selecting Subtitles**: Hybrid guide covering automatic capture from YouTube/Stremio and manual `.srt` upload.
- **Overlay**: Details on the in-page overlay, "Pause on Hover," and proximity-based controls.
- **Sidebar**: Explanation of the transcript view and scroll-sync.
- **Manual Timing Offset**: Instructions on how to use the "Sync" button (revealed on hover) to shift all subtitles to match the current video time.
- **AI Capabilities**: Combined guide covering:
  - **Local AI Translation**: Privacy-first translation using Chrome's Translation API.
  - **AI Insights**: Gemini Nano-powered grammatical breakdowns and cultural context.
- **Profiles**: How to create and manage profiles, customize AI system prompts, and switch between language configurations.

#### Section 3: Guides

- **Watching on YouTube**: Guide on using the extension on YouTube, covering typical interaction flows and UI elements.
- **Watching on Stremio Web**: Specific guide for using the extension on `web.stremio.com`, highlighting the fixed sidebar layout and specific integration details.
- **Mining words with Yomitan**: Guide on how Subtitle Insights complements pop-up dictionaries like Yomitan for a streamlined vocabulary mining workflow.

### 3. Content Strategy

- Content will be derived from `conductor/product.md`.
- Use professional, concise language.
- Include placeholder sections for screenshots (noted as `[Screenshot Placeholder]`).

## Non-Functional Requirements

- **Performance**: The site should be lightweight and fast-loading.
- **Responsiveness**: Fully functional on mobile and desktop browsers.

## Acceptance Criteria

- [ ] `docs/` directory created with a working VitePress installation.
- [ ] `npm run docs:dev` successfully launches the documentation site.
- [ ] Sidebar contains the "Introduction", "Features", and "Guides" sections as specified.
- [ ] All pages (12 total) are present and populated with accurate content.
- [ ] Theme uses the YouTube-inspired dark palette.

## Out of Scope

- Deployment to hosting services (e.g., GitHub Pages, Vercel).
- Internationalization (i18n) of the documentation.
