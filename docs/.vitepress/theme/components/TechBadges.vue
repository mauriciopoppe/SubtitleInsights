<script setup lang="ts"></script>

<template>
  <div class="tech-badges">
    <div class="badges">
      <div class="badge chrome">
        <span class="icon">✨</span>
        <span class="text">Gemini Nano</span>
      </div>
      <div class="badge chrome">
        <span class="icon">🌐</span>
        <span class="text">Chrome AI</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tech-badges {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
}

.powered-by {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  font-size: 0.9rem;
  font-weight: 600;
  transition:
    transform 0.2s,
    background-color 0.2s;
}

.badge:hover {
  transform: translateY(-2px);
  background-color: var(--vp-c-bg-mute);
}
</style>
