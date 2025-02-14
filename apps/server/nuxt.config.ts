// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
<<<<<<< HEAD
  compatibilityDate: "2024-07-30",
  future: { compatibilityVersion: 4 },
  modules: ["@nuxthub/core", "@nuxt/ui"],
  hub: {
    blob: true,
  },
  $development: {
    hub: {
      remote: true,
    },
  },
  experimental: {
    viewTransition: true,
  },
  devtools: { enabled: true },
});
=======
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true }
})
>>>>>>> 08dbcc6 (initialize Nuxt app with basic configuration and setup files)
