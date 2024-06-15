// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@primevue/nuxt-module',
  ],
  primevue: {
    options: {
      unstyled: true,
    },
  },
  future: {
    compatibilityVersion: 4,
  },
});
