// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-07-30",
  future: { compatibilityVersion: 4 },
  modules: ["@nuxthub/core", "@nuxt/ui"],
  hub: {
    blob: true,
  },
  // $development: {
  //   hub: {
  //     remote: true,
  //   },
  // },
  experimental: {
    viewTransition: true,
  },
  devtools: { enabled: true },
});
