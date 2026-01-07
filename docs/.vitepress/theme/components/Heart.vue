<script setup>
import { onMounted, ref } from 'vue'

const heartRef = ref(null)
// Store hearts instances to access them in the animate function
let hearts = []

onMounted(async () => {
  // Dynamic import from CDN to avoid SSR issues and local build problems
  const mojsModule = await import('https://cdn.jsdelivr.net/npm/@mojs/core/+esm')
  const mojs = mojsModule.default || mojsModule
  const { CustomShape, ShapeSwirl } = mojs

  class MoHeart extends CustomShape {
    getShape() {
      return '<path d="M92.5939814,7.35914503 C82.6692916,-2.45304834 66.6322927,-2.45304834 56.7076029,7.35914503 L52.3452392,11.6965095 C51.0327802,12.9714696 48.9328458,12.9839693 47.6203869,11.6715103 L47.6203869,11.6715103 L43.2705228,7.35914503 C33.3833318,-2.45304834 17.3213337,-2.45304834 7.43414268,7.35914503 C-2.47804756,17.1963376 -2.47804756,33.12084 7.43414268,42.9205337 L29.7959439,65.11984 C29.7959439,65.1323396 29.8084435,65.1323396 29.8084435,65.1448392 L43.2580232,78.4819224 C46.9704072,82.1818068 52.9952189,82.1818068 56.7076029,78.4819224 L70.1696822,65.1448392 C70.1696822,65.1448392 70.1696822,65.1323396 70.1821818,65.1323396 L92.5939814,42.9205337 C102.468673,33.12084 102.468673,17.1963376 92.5939814,7.35914503 L92.5939814,7.35914503 Z"></path>'
    }
    getLength() {
      return 292.110107421875
    }
  }

  // Register shape only if it hasn't been registered yet to avoid errors
  if (!mojs.shapesMap['heart']) {
    mojs.addShape('heart', MoHeart)
  }

  for (let i = 0; i < 10; i++) {
    const heart = new ShapeSwirl({
      parent: heartRef.value,
      shape: 'heart',
      fill: { white: 'deeppink' },
      degreeShift: 'rand(-20, 20)',
      duration: 'rand(600, 1500)',
      radius: 'rand(10, 20)',
      pathScale: 'rand(.5, 1)',
      swirlFrequency: 'rand(2,4)',
      swirlSize: 'rand(6,14)'
    })
    hearts.push(heart)
  }
})

const animateHearts = () => {
  hearts.forEach(heart => {
    heart
      .tune({ x: 0, y: { 0: 'rand(-75, -50)' } })
      .generate()
      .replay()
  })
}
</script>

<template>
  <span ref="heartRef" class="heart-container" @mouseenter="animateHearts" @click="animateHearts">
    <slot />
  </span>
</template>

<style scoped>
.heart-container {
  font-size: 1.5em;
  color: deeppink;
  position: relative;
  cursor: pointer;
  display: inline-block;
}
</style>
