export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: false },
  css: [
    '@fontsource/bagel-fat-one/400.css',
    '@fontsource/work-sans/400.css',
    '@fontsource/work-sans/500.css',
    '@fontsource/work-sans/600.css',
    '~/assets/css/main.css',
  ],

  runtimeConfig: {
    public: {
      // WordPress/WooCommerce address, e.g. http://localhost:8080
      // Set with NUXT_PUBLIC_WP_URL in .env. Leave empty to preview with sample data.
      wpUrl: '',
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Happy Corner – Sino-Mauritian home kitchen',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Sakima, macaroni cake and Chinese roast made at home in Mauritius. Order on WhatsApp.',
        },
        { name: 'theme-color', content: '#A3261B' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          // Only the two seal characters are downloaded
          href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@900&text=%E5%BF%AB%E4%B9%90&display=swap',
        },
      ],
    },
  },
})
