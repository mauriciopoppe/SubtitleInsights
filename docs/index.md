---
layout: home

hero:
  name: Subtitle Insights
  text: Smart AI insights and translations for video subtitles
  tagline: "Subtitle data, clarified. Transform your language learning experience with <strong style='color: var(--vp-c-brand-1)'>free, local, and privacy-first AI</strong>."
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

<div class="pricing-section">
  <div class="pricing-container">
    <div class="pricing-annotation-wrapper">
      <div class="pricing-annotation">
        Translation & Insights run on your device thanks to Chrome Bult-in AI
      </div>
      <svg class="arrow-svg" viewBox="0 0 100 50" width="80" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10,10 C30,40 70,0 90,30 l-10,-5 M90,30 l-5,-10" />
      </svg>
    </div>
    <div class="pricing-card">
      <div class="pricing-header">
        <div class="price">
          <span class="amount">Free</span>
        </div>
      </div>
      <ul class="pricing-features">
        <li>✅ Unlimited Translations</li>
        <li>✅ Unlimited AI Insights</li>
        <li>✅ Privacy-First (Local AI)</li>
        <li>✅ No API Keys Required</li>
        <li>✅ No Account Needed</li>
      </ul>
      <div class="pricing-actions">
        <a href="./introduction/" class="action-btn primary">Get Started</a>
        <p class="donation-text">Finding it useful?</p>
        <a href="https://buymeacoffee.com/d7pj0jyto6" target="_blank" class="action-btn donation">
          ☕ Buy me a coffee
        </a>
      </div>
    </div>
    <div class="donation-annotation-wrapper">
      <svg class="arrow-svg-bottom" viewBox="0 0 100 50" width="80" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M90,40 C70,10 30,50 10,20 l10,5 M10,20 l5,10" />
      </svg>
      <div class="donation-annotation">
        Every <s>coffee</s> chai helps me maintain the project!
      </div>
    </div>
  </div>
</div>

<style>
.pricing-section {
  display: flex;
  justify-content: center;
  padding: 4rem 0;
}

.pricing-container {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.pricing-annotation-wrapper,
.donation-annotation-wrapper {
  position: absolute;
  width: 200px;
  display: none;
}

.pricing-annotation-wrapper {
  left: -220px;
  top: 20px;
}

.donation-annotation-wrapper {
  right: -220px;
  bottom: 20px;
}

@media (min-width: 1100px) {
  .pricing-annotation-wrapper,
  .donation-annotation-wrapper {
    display: block;
  }
}

.pricing-annotation,
.donation-annotation {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-brand-1);
  font-size: 1.1rem;
  font-weight: 500;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-brand-1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  line-height: 1.4;
  font-family: cursive, sans-serif;
}

.pricing-annotation {
  transform: rotate(-5deg);
}

.donation-annotation {
  transform: rotate(5deg);
}

.arrow-svg {
  position: absolute;
  right: -60px;
  top: 40px;
  color: var(--vp-c-brand-1);
  transform: rotate(10deg);
}

.arrow-svg-bottom {
  position: absolute;
  left: -60px;
  top: -20px;
  color: var(--vp-c-brand-1);
  transform: rotate(-10deg);
}

.pricing-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 3rem;
  width: 100%;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  z-index: 1;
}

.pricing-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  border-color: var(--vp-c-brand-1);
}

.pricing-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

.price {
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 2rem;
}

.pricing-features {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  text-align: left;
}

.pricing-features li {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
}

.pricing-features li:last-child {
  border-bottom: none;
}

.pricing-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-btn {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.action-btn.primary {
  background-color: var(--vp-c-brand-1);
  color: var(--vp-button-brand-text);
}

.action-btn.primary:hover {
  background-color: var(--vp-c-brand-2);
  color: var(--vp-button-brand-hover-text);
}

.donation-text {
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.action-btn.donation {
  background-color: #FFDD00;
  color: #000;
}

.action-btn.donation:hover {
  background-color: #FFEA00;
  transform: scale(1.02);
}
</style>
