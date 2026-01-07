import DefaultTheme from 'vitepress/theme'
import FeatureRow from './components/FeatureRow.vue'
import TechBadges from './components/TechBadges.vue'
import WhySection from './components/WhySection.vue'
import Layout from './Layout.vue'
import './custom.css'

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('FeatureRow', FeatureRow)
    app.component('TechBadges', TechBadges)
    app.component('WhySection', WhySection)
  }
}
