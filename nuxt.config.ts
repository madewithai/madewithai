// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxtjs/google-fonts', '@vueuse/nuxt', '@nuxt/icon'],

  googleFonts: {
    families: {
      'Press+Start+2P': true,
    },
  },

  runtimeConfig: {
    public: {
      githubToken: process.env.GITHUB_TOKEN,
      githubOrg: process.env.ORGANIZATION,
    },
  },

  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-01-30',
});
