<script setup lang="ts">
defineProps<{
  title: string
  description: string
  videoSrc: string
  sourceLink?: string
  sourceName?: string
}>()
</script>

<template>
  <div class="feature-row">
    <div class="text-content">
      <h3 class="title">{{ title }}</h3>
      <p class="description">{{ description }}</p>
    </div>
    <div class="media-content">
      <video controls autoplay loop muted playsinline class="video">
        <source :src="videoSrc" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <p v-if="sourceLink" class="source-attribution">
        Source: <a :href="sourceLink" target="_blank" rel="noopener">{{ sourceName || 'YouTube' }}</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.feature-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin: 0;
  padding: 8rem 0;
  min-height: 80vh;
  justify-content: center;
  width: 100%;
}

.text-content {
  text-align: center;
  max-width: 800px;
  padding: 0 2rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: -webkit-linear-gradient(120deg, var(--vp-c-brand-1) 30%, var(--vp-c-accent-1));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
  border: none;
}

.description {
  font-size: 1.2rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.media-content {
  width: 100%;
  max-width: 1152px;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.video {
  width: 100%;
  border-radius: 12px;
  box-shadow: var(--vp-shadow-4);
  border: 1px solid var(--vp-c-divider);
}

.source-attribution {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.source-attribution a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.source-attribution a:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .title {
    font-size: 2rem;
  }
  .feature-row {
    padding: 4rem 0;
  }
  .text-content,
  .media-content {
    padding: 0 1rem;
  }
}
</style>
