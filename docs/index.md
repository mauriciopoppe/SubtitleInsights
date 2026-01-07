---
layout: home

hero:
  name: Subtitle Insights
  text: Smart AI insights and translations for video subtitles
  tagline: Transform your language learning experience with free, local, and privacy-first AI.
  image:
    src: /logo.svg
    alt: Subtitle Insights Logo
  actions:
    - theme: brand
      text: Get Started
      link: /introduction/
    - theme: alt
      text: View on GitHub
      link: https://github.com/mauriciopoppe/SubtitleInsights

---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, var(--vp-c-brand-1) 30%, var(--vp-c-accent-1));
}

:deep(.VPHero) {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100% !important;
  max-width: 100% !important;
}

:deep(.VPHero .image-container img) {
  max-width: 480px !important;
  max-height: 480px !important;
  width: 100% !important;
  height: 100% !important;
}

@media (max-width: 960px) {
  :deep(.VPHero .image-container img) {
    max-width: 320px !important;
    max-height: 320px !important;
    width: 100% !important;
    height: 100% !important;
  }
}

@media (max-width: 640px) {
  :deep(.VPHero .image-container img) {
    max-width: 240px !important;
    max-height: 240px !important;
    width: 100% !important;
    height: 100% !important;
  }
}
</style>

<WhySection />

<FeatureRow
  title="Experience the AI-Powered Overlay"
  description="The overlay appears exactly when you need it, providing instant context for the current subtitle segment. Hover to pause, click to replay segments."
  videoSrc="./overlay.mp4"
/>

<FeatureRow
  title="Stay in Sync with the Smart Sidebar"
  description="Navigate the entire video transcript effortlessly. The sidebar stays perfectly synchronized with playback, allowing for quick reference of the current segment within the larger context."
  videoSrc="./sidebar.mp4"
/>

<div style="padding: 10rem 0; text-align: center; border-top: 1px solid var(--vp-c-divider); max-width: 1152px; margin: 0 auto;">

### Powered by Chrome Built-in AI

<TechBadges />

</div>
