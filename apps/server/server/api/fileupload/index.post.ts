export default eventHandler(async (event) => {
  // https://hub.nuxt.com/docs/storage/blob#handleupload
  return hubBlob().handleUpload(event, {
    multiple: false,
    put: {
      // addRandomSuffix: true,
    },
    ensure: {
      maxSize: "1024MB",
      // types: ['image/jpeg', 'image/png', 'image/gif', 'image/heic', 'image/webp']
    },
  });
});
