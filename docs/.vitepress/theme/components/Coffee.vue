<script setup>
import { onMounted, ref } from 'vue'

const coffeeRef = ref(null)
let vapors = []

onMounted(async () => {
  // Dynamic import from CDN to avoid SSR issues
  const mojsModule = await import('https://cdn.jsdelivr.net/npm/@mojs/core/+esm')
  const mojs = mojsModule.default || mojsModule
  const { CustomShape, ShapeSwirl } = mojs

  // Define a custom vapor shape (wavy line)
  class Vapor extends CustomShape {
    getShape() {
      // S-curve centered
      return '<path d="M50,100 C80,75 20,50 50,0" stroke-linecap="round" />'
    }
  }

  // Register shape
  if (!mojs.shapesMap['vapor']) {
    mojs.addShape('vapor', Vapor)
  }

  // Create vapor instances
  for (let i = 0; i < 5; i++) {
    const vapor = new ShapeSwirl({
      parent: coffeeRef.value,
      shape: 'circle',
      fill: '#ffd600',
      radius: 'rand(2, 5)',
      x: { 0: 'rand(-10, 10)' },
      y: { '-10': -50 }, // Quote negative key
      swirlSize: 'rand(5, 12)',
      swirlFrequency: 'rand(2, 4)',
      duration: 'rand(1000, 1500)',
      direction: 1,
      opacity: { 0.8: 0 },
      delay: i * 250,
      isIsForce3d: true
    })
    vapors.push(vapor)
  }
})

const animateVapor = () => {
  vapors.forEach(vapor => {
    vapor.generate().replay()
  })
}
</script>

<template>
  <span ref="coffeeRef" class="coffee-container" @mouseenter="animateVapor" @click="animateVapor">
    <slot />
  </span>
</template>

<style scoped>
.coffee-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  vertical-align: middle;
}
/* Ensure the generated element is positioned correctly relative to the slot */
:deep([data-name='mojs-shape']) {
  position: absolute !important;
  left: 50% !important;
  top: 50% !important; /* Center anchor */
  pointer-events: none;
  z-index: 10; /* Ensure visibility for debugging */
}
</style>
