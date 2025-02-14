<script setup lang="ts">
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f2a68fd (add server configuration, API endpoints, and image handling components)
=======
>>>>>>> f3c9738 (remove unused components, API endpoints, and update nuxt.config to streamline the application)
useHead({
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "en",
  },
});

const title = "ManyFans Server";
=======
const { getImages } = useFile()

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f67f057 (remove unused components, API endpoints, and update nuxt.config to streamline the application)
useHead({
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "en",
  },
});

<<<<<<< HEAD
const title = 'NuxtHub Image Gallery Starter'
const description = 'A Nuxt template to build your full-stack image gallery application on the edge.'
>>>>>>> cf91573 (add server configuration, API endpoints, and image handling components)
=======
const title = "ManyFans Server";
>>>>>>> f67f057 (remove unused components, API endpoints, and update nuxt.config to streamline the application)
=======
=======
=======
>>>>>>> 294b92f (remove unused components, API endpoints, and update nuxt.config to streamline the application)
>>>>>>> f3c9738 (remove unused components, API endpoints, and update nuxt.config to streamline the application)
useHead({
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "en",
  },
});

<<<<<<< HEAD
const title = 'NuxtHub Image Gallery Starter'
const description = 'A Nuxt template to build your full-stack image gallery application on the edge.'
>>>>>>> 3ae8324 (add server configuration, API endpoints, and image handling components)
<<<<<<< HEAD
>>>>>>> f2a68fd (add server configuration, API endpoints, and image handling components)
=======
=======
const title = "ManyFans Server";
>>>>>>> 294b92f (remove unused components, API endpoints, and update nuxt.config to streamline the application)
>>>>>>> f3c9738 (remove unused components, API endpoints, and update nuxt.config to streamline the application)

useSeoMeta({
  title,
  ogTitle: title,
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f67f057 (remove unused components, API endpoints, and update nuxt.config to streamline the application)
=======
>>>>>>> f2a68fd (add server configuration, API endpoints, and image handling components)
=======
=======
>>>>>>> 294b92f (remove unused components, API endpoints, and update nuxt.config to streamline the application)
>>>>>>> f3c9738 (remove unused components, API endpoints, and update nuxt.config to streamline the application)
  // ogDescription: description,
  // ogSiteName: "NuxtHub image gallery template",
  // ogImage: "https://image-gallery.nuxt.dev/social-card.png",
  // twitterCard: "summary_large_image",
});
<<<<<<< HEAD
</script>

<template>
  <div class="bg-black min-h-[100dvh] overflow-x-auto relative">
    <UNotifications />
    <NuxtPage />
=======
  description,
  ogDescription: description,
  ogSiteName: 'NuxtHub image gallery template',
  ogImage: 'https://image-gallery.nuxt.dev/social-card.png',
  twitterCard: 'summary_large_image'
})

await getImages()
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f67f057 (remove unused components, API endpoints, and update nuxt.config to streamline the application)
</script>

<template>
  <div class="bg-black min-h-[100dvh] overflow-x-auto relative">
    <UNotifications />
    <NuxtPage />
<<<<<<< HEAD
    <ImageThumbnailList :class="$router.currentRoute.value.fullPath !== '/' ? 'opacity-100 z-[9999]' : 'opacity-0 z-[-1]'" />
>>>>>>> cf91573 (add server configuration, API endpoints, and image handling components)
=======
>>>>>>> f67f057 (remove unused components, API endpoints, and update nuxt.config to streamline the application)
=======
=======
=======
>>>>>>> 294b92f (remove unused components, API endpoints, and update nuxt.config to streamline the application)
>>>>>>> f3c9738 (remove unused components, API endpoints, and update nuxt.config to streamline the application)
</script>

<template>
  <div class="bg-black min-h-[100dvh] overflow-x-auto relative">
    <UNotifications />
    <NuxtPage />
<<<<<<< HEAD
    <ImageThumbnailList :class="$router.currentRoute.value.fullPath !== '/' ? 'opacity-100 z-[9999]' : 'opacity-0 z-[-1]'" />
>>>>>>> 3ae8324 (add server configuration, API endpoints, and image handling components)
<<<<<<< HEAD
>>>>>>> f2a68fd (add server configuration, API endpoints, and image handling components)
=======
=======
>>>>>>> 294b92f (remove unused components, API endpoints, and update nuxt.config to streamline the application)
>>>>>>> f3c9738 (remove unused components, API endpoints, and update nuxt.config to streamline the application)
  </div>
</template>
