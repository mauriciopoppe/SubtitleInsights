<script setup lang="ts">
const features = [
  {
    icon: '🔒',
    title: 'Private, Local AI',
    description: 'Data never leaves your browser. All translations and insights are processed on-device using Chrome\'s built-in AI.'
  },
  {
    icon: '🧠',
    title: 'Automated Insights',
    description: 'Beyond word lookups. Gemini Nano analyzes entire sentences to explain complex grammar and cultural nuances.'
  },
  {
    icon: '⏯️',
    title: 'Smart Controls',
    description: 'Interactive controls appear only when needed. Hover to pause, replay segments instantly, and focus on learning without distractions.'
  },
  {
    icon: '🎬',
    title: 'Integrated Experience',
    description: 'Designed to blend perfectly with YouTube and Stremio Web. Feels like a native feature, not an added layer.'
  },
  {
    icon: '📁',
    title: 'Flexible Subtitles',
    description: 'Automatically capture YouTube captions or upload your own .srt files. Use the manual sync tool to align timing perfectly.'
  },
  {
    icon: '💰',
    title: '<strong style="color: var(--vp-c-brand-1)">100% Free</strong>',
    description: 'No subscriptions, no API keys, no hidden costs. Leveraging the power of your own hardware via Chrome.'
  }
]
</script>

<template>
  <section class="why-section">
    <h2 class="section-title">Why Subtitle Insights?</h2>
    <p class="section-subtitle">
      Bridging the gap between passive watching and active learning on <strong>YouTube</strong> and <strong>Stremio</strong>.
    </p>
    
    <div class="grid">
      <div v-for="feature in features" :key="feature.title" class="card">
        <div class="card-icon">{{ feature.icon }}</div>
        <h3 class="card-title">{{ feature.title }}</h3>
        <p class="card-description">{{ feature.description }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.why-section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  background-color: var(--vp-c-bg);
  text-align: center;
  width: 100%;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: -webkit-linear-gradient(120deg, var(--vp-c-brand-1) 30%, var(--vp-c-accent-1));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  border: none;
}

.section-subtitle {
  font-size: 1.25rem;
  color: var(--vp-c-text-2);
  margin-bottom: 4rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1152px;
  padding: 0 2rem;
}

.card {
  background-color: var(--vp-c-bg-soft);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  transition: transform 0.3s ease, border-color 0.3s ease;
  text-align: left;
}

.card:hover {
  transform: translateY(-8px);
  border-color: var(--vp-c-brand-1);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

.card-description {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .section-title {
    font-size: 2rem;
  }
  
  .why-section {
    padding: 2rem 0;
    height: auto;
    min-height: auto;
  }

  .grid {
    padding: 0 1rem;
  }
}
</style>
