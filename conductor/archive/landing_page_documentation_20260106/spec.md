# Specification: Landing Page Documentation

## Overview
Transform the current documentation home page into a high-impact, single-page landing experience for Subtitle Insights. This page will serve as the primary entry point, showcasing the product's value proposition, core features, and technical privacy advantages using rich media (videos) and a modern UI layout provided by VitePress.

## Functional Requirements
- **Hero Section:**
    - High-impact headline and subheadline derived from the product mission.
    - Primary Call to Action (CTA) buttons: "Get Started" (linking to docs) and "View on GitHub".
    - High-quality visual representation (Hero image or video).
- **Feature Showcase:**
    - Dedicated sections for "AI-Powered Overlay" and "Smart Transcript Sidebar".
    - Embedded looping videos (`overlay.mp4` and `sidebar.mp4`) to demonstrate features in real-time.
    - Clear descriptions of how each feature aids language learning.
- **Privacy & Tech Highlight:**
    - Section explaining the "Local AI" advantage (Chrome Built-in AI).
    - Emphasize "Privacy-First" processing (no data leaves the device).
- **Navigation:**
    - Seamless integration with existing VitePress documentation structure.
    - Updated footer with social and repository links.

## Non-Functional Requirements
- **Responsive Design:** Must look great on mobile and desktop.
- **Visual Polish:** Leverage VitePress's built-in Home Page layout for a clean, professional aesthetic.
- **Performance:** Ensure videos are optimized for fast loading and don't block page interactivity.

## Acceptance Criteria
- [ ] `docs/index.md` is updated to use the VitePress `home` layout.
- [ ] The Hero section contains both a "Get Started" and a "GitHub" link.
- [ ] At least two feature blocks are present, each with a corresponding video (`overlay.mp4` and `sidebar.mp4`).
- [ ] A section specifically addressing Local AI and Privacy is included.
- [ ] The page passes a visual check on both desktop and mobile viewports.

## Out of Scope
- Development of custom Vue.js animation components (deferred for future iteration).
- Full rebranding or color scheme changes beyond standard VitePress customization.
