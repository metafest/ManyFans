// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
<<<<<<< HEAD
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
=======
  compatibilityDate: "2024-07-30",
  future: { compatibilityVersion: 4 },
  modules: ["@nuxthub/core", "@nuxt/ui", "@vueuse/nuxt", "nuxt-auth-utils"],
  hub: {
    blob: true,
  },
<<<<<<< HEAD
>>>>>>> cf91573 (add server configuration, API endpoints, and image handling components)
=======
  $development: {
    hub: {
      remote: true,
    },
  },
>>>>>>> dfa015d (add GitHub Actions workflow for NuxtHub deployment and update nuxt.config for development environment)
  experimental: {
    viewTransition: true,
  },
  devtools: { enabled: true },
});
<<<<<<< HEAD
=======
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true }
})
>>>>>>> 08dbcc6 (initialize Nuxt app with basic configuration and setup files)
=======
>>>>>>> cf91573 (add server configuration, API endpoints, and image handling components)
