// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxtjs/google-fonts', '@vueuse/nuxt', "@nuxt/icon"],
  googleFonts: {
    families: {
      'Press+Start+2P': true,
    },
  },
  runtimeConfig: {
    public: {
      ghToken: process.env.GITHUB_TOKEN,
      org: process.env.ORGANIZATION,
    },
  },
});