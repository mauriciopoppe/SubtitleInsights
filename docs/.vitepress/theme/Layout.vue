<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import Heart from './components/Heart.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <Layout>
    <template #layout-bottom>
      <footer v-if="frontmatter.layout === 'home'" class="footer container has-text-centered">
        Made with <Heart>♥</Heart> by
        <a href="https://mauriciopoppe.com" target="_blank" rel="noopener noreferrer">Mauricio Poppe</a>
      </footer>
    </template>
  </Layout>
</template>

<style scoped>
.footer {
  text-align: center;
  padding: 2rem;
  margin-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.footer a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.25s;
}

.footer a:hover {
  color: var(--vp-c-brand-2);
  text-decoration: underline;
}
</style>
