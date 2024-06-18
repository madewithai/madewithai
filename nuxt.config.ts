// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxtjs/google-fonts'],
  googleFonts: {
    families: {
      'Press+Start+2P': true,
    },
  },
});
