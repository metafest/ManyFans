<template>
  <div class="w-full">
    <!-- Upload Zone -->
    <div
      class="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center"
      @drop.prevent="onDrop"
      @dragover.prevent
      @click="triggerFileInput"
    >
      <input
        type="file"
        ref="fileInputRef"
        @change="onFileSelect"
        class="hidden"
      />
      <div class="cursor-pointer">
        <div class="text-gray-500 mb-2">
          <i class="fas fa-cloud-upload-alt text-3xl"></i>
        </div>
        <p class="text-gray-600 dark:text-gray-400">
          Click to select a file or drag and drop it here
        </p>
      </div>
    </div>

    <!-- File Preview -->
    <div v-if="file" class="mt-4">
      <div class="flex items-center justify-between p-2 border-b">
        <div>
          <p class="font-medium">{{ file.name }}</p>
          <p class="text-sm text-gray-500">{{ formatFileSize(file.size) }}</p>
        </div>
        <UButton
          @click="clearFile"
          color="red"
          size="xs"
          variant="ghost"
          icon="i-heroicons-trash"
        />
      </div>

      <!-- Progress Bar -->
      <div v-if="uploadProgress > 0 || uploadedBytes > 0" class="mt-2">
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div
            class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          />
        </div>
        <p class="text-sm text-gray-500 mt-1">
          {{ uploadProgress.toFixed(1) }}% uploaded
        </p>
      </div>
    </div>

    <!-- Upload Button -->
    <div class="flex justify-end mt-4">
      <UButton
        label="Upload File"
        color="green"
        :loading="isUploading"
        :disabled="!file"
        @click="startUpload"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
const emit = defineEmits<{
  (e: "upload-complete"): void;
  (e: "upload-error", error: Error): void;
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const file = ref<File | null>(null);
const isUploading = ref(false);
const uploadProgress = ref<number>(0);
const uploadedBytes = ref(0);

const upload = useMultipartUpload("/api/files/multipart");

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const triggerFileInput = (): void => {
  fileInputRef.value?.click();
};

const onFileSelect = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  const selectedFile = input.files?.[0];
  if (selectedFile && selectedFile instanceof File) {
    file.value = selectedFile;
    uploadProgress.value = 0;
    uploadedBytes.value = 0;
  }
};

const onDrop = (event: DragEvent): void => {
  const droppedFile = event.dataTransfer?.files[0];
  if (droppedFile && droppedFile instanceof File) {
    file.value = droppedFile;
    uploadProgress.value = 0;
    uploadedBytes.value = 0;
  }
};

const clearFile = (): void => {
  file.value = null;
  uploadProgress.value = 0;
  uploadedBytes.value = 0;
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
};

const startUpload = async (): Promise<void> => {
  if (!file.value || isUploading.value) return;

  isUploading.value = true;
  const { progress: uploadProgressRef, completed } = upload(file.value);

  watch(uploadProgressRef, (newProgress) => {
    uploadProgress.value = newProgress;
  });

  try {
    await completed;
    emit("upload-complete");
  } catch (error) {
    emit("upload-error", error as Error);
  } finally {
    clearFile();
    isUploading.value = false;
  }
};
</script>
