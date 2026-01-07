---
layout: home

hero:
  name: Subtitle Insights
  text: Smart AI insights and translations for video subtitles
  tagline: "Subtitle data, clarified. Transform your language learning experience with free, local, and privacy-first AI."
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
  :deep(.VPHero .container) {
    padding: 0 24px;
  }
  :deep(.VPHero .image-container img) {
    max-width: 240px !important;
    max-height: 240px !important;
    width: 100% !important;
    height: 100% !important;
  }
}

.waveform-separator {
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(62, 166, 255, 0.2) 20%,
    var(--vp-c-brand-1) 50%,
    rgba(62, 166, 255, 0.2) 80%,
    transparent 100%
  );
  margin: 4rem 0;
}
</style>

<FeatureRow
  title="Subtitle data, clarified."
  description="Subtitle Insights transforms your favorite videos into interactive lessons. Get real-time translations and grammatical breakdowns without leaving the player."
  videoSrc="./intro_web.mp4"
  sourceLink="https://www.youtube.com/@cijapanese"
  sourceName="Comprehensible Japanese"
/>

<div class="waveform-separator"></div>

<WhySection />

<div class="waveform-separator"></div>

<FeatureRow
  title="Experience the AI-Powered Overlay"
  description="The overlay appears exactly when you need it, providing instant context for the current subtitle segment. Hover to pause, click to replay segments."
  videoSrc="./overlay.mp4"
  sourceLink="https://www.youtube.com/@cijapanese"
  sourceName="Comprehensible Japanese"
/>

<div class="waveform-separator"></div>

<FeatureRow
  title="Stay in Sync with the Smart Sidebar"
  description="Navigate the entire video transcript effortlessly. The sidebar stays perfectly synchronized with playback, allowing for quick reference of the current segment within the larger context."
  videoSrc="./sidebar.mp4"
  sourceLink="https://www.youtube.com/@cijapanese"
  sourceName="Comprehensible Japanese"
/>

<div class="waveform-separator"></div>

### Powered by Chrome Built-in AI

<TechBadges />

