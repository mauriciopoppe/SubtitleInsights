import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Subtitle Insights",
  description: "Smart AI insights and translations for YouTube subtitles",
  appearance: 'dark',
  themeConfig: {
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
          { text: 'Extension Settings', link: '/user-manual/extension-settings' },
          { text: 'Selecting Subtitles', link: '/user-manual/selecting-subtitles' },
          { text: 'Overlay', link: '/user-manual/overlay' },
          { text: 'Sidebar', link: '/user-manual/sidebar' },
          { text: 'AI Capabilities', link: '/user-manual/ai-capabilities' },
          { text: 'Profiles', link: '/user-manual/profiles' }
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
        items: [
          { text: 'Design Decisions', link: '/architecture/' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/mauriciopoppe/SubtitleInsights' }
    ]
  }
})
