---
layout: home

hero:
  name: Subtitle Insights
  text: Smart AI insights and translations for video subtitles
  tagline: Transform your language learning experience with free, local, and privacy-first AI.
  actions:
    - theme: brand
      text: Get Started
      link: /introduction/
    - theme: alt
      text: View on GitHub
      link: https://github.com/mauriciopoppe/SubtitleInsights

features:
  - icon: 🎯
    title: AI-Powered Overlay
    details: Real-time translations and grammatical insights directly over your video player.
  - icon: 📜
    title: Smart Transcript Sidebar
    details: Full video transcript with automatic scroll sync and manual timing adjustments.
  - icon: 🔒
    title: Free & Privacy-First
    details: Powered by Chrome's built-in AI APIs (Gemini Nano). All processing happens on-device for free, with zero data sent to the cloud.
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);
}
</style>

<WhySection />

<FeatureRow
  title="Experience the AI-Powered Overlay"
  description="The overlay appears exactly when you need it, providing instant context for the current subtitle segment. Hover to pause, click to get deep grammatical insights."
  videoSrc="/overlay.mp4"
/>

<FeatureRow
  title="Stay in Sync with the Smart Sidebar"
  description="Navigate the entire video transcript effortlessly. The sidebar stays perfectly synchronized with your playback, allowing you to jump to any sentence instantly."
  videoSrc="/sidebar.mp4"
/>

<div style="padding: 10rem 0; text-align: center; border-top: 1px solid var(--vp-c-divider); max-width: 1152px; margin: 0 auto;">

### Powered by Chrome Built-in AI

<TechBadges />

</div>
