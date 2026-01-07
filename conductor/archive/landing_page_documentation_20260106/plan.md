# Plan: Landing Page Documentation

Transform the documentation home page into a high-impact landing page using the VitePress `home` layout, incorporating videos and privacy-focused messaging.

## Phase 1: Asset Preparation & Setup

- [x] Task: Verify video file availability and accessibility in the `docs/` directory.
- [x] Task: Audit `docs/.vitepress/config.ts` for existing home page configurations.

## Phase 2: Landing Page Implementation

- [x] Task: Update `docs/index.md` frontmatter to use `layout: home`.
- [x] Task: Configure the `hero` section with headline, tagline, and CTA links (Get Started & GitHub).
- [x] Task: Implement the `features` grid with descriptions for Overlay, Sidebar, and Local AI.
- [x] Task: Add custom Markdown content below the features grid to embed `overlay.mp4` and `sidebar.mp4`.
- [x] Task: Refine the "Local AI & Privacy" section content for maximum impact.

## Phase 3: Verification & Polish (Initial)

- [x] Task: Verify responsiveness on mobile and desktop viewports.
- [x] Task: Ensure all links (GitHub, Documentation) are functional.
- [x] Task: Run `npm run docs:build` to ensure the landing page generates correctly without errors.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Verification & Polish' (Protocol in workflow.md)

## Phase 4: Enhanced Layout & Components

- [x] Task: Create a `FeatureRow.vue` component for alternating text/video layouts.
- [x] Task: Implement "AI Powered" badges/icons (Gemini Nano, Chrome) in the hero or footer.
- [x] Task: Update `docs/index.md` to use `FeatureRow` for the Overlay and Sidebar sections.
- [x] Task: Ensure the "Free" and "In-Device" messaging is prominent in the new layout.
- [x] Task: Conductor - User Manual Verification 'Phase 4: Enhanced Layout & Components' (Protocol in workflow.md)
