<template>
  <div class="p-5">
    <div class="max-w-xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">Upload File</h1>

      <div
        class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center mb-4"
      >
        <input
          type="file"
          ref="fileInput"
          @change="handleFileChange"
          class="hidden"
        />
        <div @click="$refs.fileInput.click()" class="cursor-pointer">
          <div class="text-gray-500 mb-2">
            <i class="fas fa-cloud-upload-alt text-3xl"></i>
          </div>
          <p class="text-gray-600 dark:text-gray-400">
            Click to select a file or drag and drop it here
          </p>
        </div>
      </div>

      <div v-if="selectedFile" class="mb-4">
        <h2 class="text-lg font-semibold mb-2">Selected File</h2>
        <div class="flex items-center justify-between p-2 border-b">
          <div>
            <p class="font-medium">{{ selectedFile.name }}</p>
            <p class="text-sm text-gray-500">
              {{ formatFileSize(selectedFile.size) }}
            </p>
          </div>
          <UButton
            @click="removeFile"
            color="red"
            size="xs"
            variant="ghost"
            icon="i-heroicons-trash"
          />
        </div>
        <div v-if="uploadProgress > 0" class="mt-2">
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-blue-600 h-2.5 rounded-full"
              :style="{ width: `${uploadProgress}%` }"
            ></div>
          </div>
          <p class="text-sm text-gray-500 mt-1">
            {{ uploadProgress }}% uploaded
          </p>
        </div>
      </div>

      <div class="flex justify-end">
        <UButton
          label="Upload File"
          color="green"
          :loading="uploading"
          :disabled="!selectedFile"
          @click="uploadFile"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const uploading = ref(false);
const uploadProgress = ref(0);

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0];
    uploadProgress.value = 0;
  }
};

const removeFile = () => {
  selectedFile.value = null;
  uploadProgress.value = 0;
};

const uploadFile = async () => {
  if (!selectedFile.value) return;
  uploading.value = true;

  try {
    const upload = useMultipartUpload("/api/files/multipart");
    const { progress, completed } = upload(selectedFile.value);

    watch(progress, (newProgress) => {
      uploadProgress.value = Math.round(newProgress * 100);
    });

    await completed;
    selectedFile.value = null;
    uploadProgress.value = 0;
  } catch (error) {
    console.error("Upload failed:", error);
  } finally {
    uploading.value = false;
  }
};
</script>
