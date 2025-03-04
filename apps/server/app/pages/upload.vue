<template>
  <div class="p-5">
    <div class="max-w-xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">Upload File</h1>
      <FileUploader @upload-complete="handleUploadComplete" />
    </div>
  </div>
</template>

<script setup lang="ts">
const toast = useToast();
const handleUploadComplete = () => {
  toast.add({
    title: "Success",
    description: "File uploaded successfully",
    color: "green",
  });
};
</script>
