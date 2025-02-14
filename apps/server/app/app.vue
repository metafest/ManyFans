<script setup lang="ts">
useHead({
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "en",
  },
});

const title = "ManyFans Server";

useSeoMeta({
  title,
  ogTitle: title,
  // ogDescription: description,
  // ogSiteName: "NuxtHub image gallery template",
  // ogImage: "https://image-gallery.nuxt.dev/social-card.png",
  // twitterCard: "summary_large_image",
});
</script>

<template>
  <div class="bg-black min-h-[100dvh] overflow-x-auto relative">
    <UNotifications />
    <NuxtPage />
  </div>
</template>
