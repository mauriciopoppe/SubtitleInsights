<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import Heart from './components/Heart.vue'
import Coffee from './components/Coffee.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <Coffee class="nav-coffee">
        <a href="https://buymeacoffee.com/d7pj0jyto6" target="_blank" rel="noopener noreferrer" class="nav-coffee-link">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path
              d="M20,8H18V5A1,1,0,0,0,17,4H4.44A1,1,0,0,0,3.5,5.05L4.56,17.67A3,3,0,0,0,7.54,20H14.46a3,3,0,0,0,3-2.33L18,17A3,3,0,0,0,21,14V11A3,3,0,0,0,20,8ZM14.46,18H7.54a1,1,0,0,1-1-.78L5.47,6H16V17.22A1,1,0,0,1,14.46,18ZM19,14a1,1,0,0,1-1,1H17.82l.09-1.07.54-6.42H19Z"
              fill="currentColor"
            />
          </svg>
        </a>
      </Coffee>
    </template>
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

.nav-coffee {
  margin-left: 12px;
  display: flex;
  align-items: center;
}

.nav-coffee-link {
  color: var(--vp-c-text-2);
  transition: color 0.25s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-coffee-link:hover {
  color: var(--vp-c-text-1);
}
</style>
