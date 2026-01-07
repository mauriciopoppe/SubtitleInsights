<script setup lang="ts">
defineProps<{
  title: string
  description: string
  videoSrc: string
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
        <source :src="videoSrc" type="video/mp4">
        Your browser does not support the video tag.
      </video>
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
  max-width: 1152px;
  margin: 0 auto;
}

.text-content {
  text-align: center;
  max-width: 800px;
}

.title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

.description {
  font-size: 1.2rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.media-content {
  width: 100%;
}

.video {
  width: 100%;
  border-radius: 12px;
  box-shadow: var(--vp-shadow-4);
  border: 1px solid var(--vp-c-divider);
}

@media (max-width: 640px) {
  .title {
    font-size: 2rem;
  }
  .feature-row {
    padding: 4rem 1rem;
  }
}
</style>