import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Subtitle Insights',
  description: 'Smart AI insights and translations for YouTube subtitles',
  appearance: 'dark',
  base: '/SubtitleInsights/',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/SubtitleInsights/logo.svg' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=Inter:wght@400;500;600&display=swap'
      }
    ]
  ],
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/introduction/' }
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'What is Subtitle Insights?', link: '/introduction/' },
          { text: 'Getting Started', link: '/introduction/getting-started' },
          { text: 'Comparisons with other extensions', link: '/introduction/comparisons' }
        ]
      },
      {
        text: 'User Manual',
        items: [
          { text: 'UI Overview', link: '/user-manual/' },
          { text: 'Selecting Subtitles', link: '/user-manual/selecting-subtitles' },
          { text: 'Overlay', link: '/user-manual/overlay' },
          { text: 'Sidebar', link: '/user-manual/sidebar' },
          { text: 'AI Capabilities', link: '/user-manual/ai-capabilities' },
          { text: 'Profiles', link: '/user-manual/profiles' },
          { text: 'Keyboard Shortcuts', link: '/user-manual/keyboard-shortcuts' }
        ]
      },
      {
        text: 'Guides',
        items: [
          { text: 'Watching on YouTube', link: '/guides/youtube' },
          { text: 'Watching on Stremio Web', link: '/guides/stremio-web' },
          { text: 'Mining words with Yomitan', link: '/guides/yomitan-mining' },
          { text: 'Deeper insights with Gemini in Chrome', link: '/guides/gemini-side-panel' }
        ]
      },
      {
        text: 'Architecture',
        items: [{ text: 'Design Decisions', link: '/architecture/' }]
      }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/mauriciopoppe/SubtitleInsights' }]
  }
})
