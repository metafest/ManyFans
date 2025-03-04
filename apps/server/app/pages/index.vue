<template>
  <div class="p-5">
    <div class="flex justify-between items-center">
      <div class="ml-auto">
        <UButton label="Upload File" color="green" size="sm" to="/upload" />
      </div>
    </div>
    <div class="h-full w-full pt-5">
      <div
        class="flex items-center justify-between gap-5 py-3.5 border-b border-gray-200 dark:border-gray-700"
      >
        <UInput v-model="q" placeholder="Filter files..." class="max-w-md" />

        <p>
          <span class="font-bold">Total Files:</span>
          <span class="pl-2 text-red-600">
            {{ data?.length }}
          </span>
        </p>
      </div>

      <div class="w-full">
        <UTable :rows="filteredRows" :columns="columns">
          <template #pathname-data="{ row }">
            <div class="max-w-[200px] truncate" :title="row.pathname">
              {{ row.pathname }}
            </div>
          </template>

          <template #size-data="{ row }">
            {{ formatFileSize(row.size) }}
          </template>

          <template #uploadedAt-data="{ row }">
            {{ formatDate(row.uploadedAt) }}
          </template>

          <template #actions-data="{ row }">
            <div class="flex space-x-2">
              <UButton
                label="View"
                color="green"
                size="xs"
                variant="ghost"
                :to="'/api/files/' + row.pathname"
                target="_blank"
              />
              <UButton
                label="Download"
                color="blue"
                size="xs"
                variant="ghost"
                @click="downloadFile(row.pathname)"
              />
              <UButton
                label="Delete"
                color="red"
                size="xs"
                variant="ghost"
                @click="deleteFile(row.pathname)"
              />
            </div>
          </template>
        </UTable>
      </div>

      <UPagination
        v-model="page"
        :total="filteredRows.length"
        :per-page="perPage"
        class="mt-4 px-4"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { data, refresh } = await useFetch("/api/files");

const columns = [
  {
    key: "pathname",
    label: "Name",
  },
  {
    key: "contentType",
    label: "File Type",
  },
  {
    key: "size",
    label: "Size",
  },
  {
    key: "uploadedAt",
    label: "Uploaded",
  },
  {
    key: "actions",
    label: "Actions",
  },
];

const q = ref("");
const page = ref(1);
const perPage = ref(25);

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const deleteFile = async (pathname: string) => {
  try {
    await $fetch(`/api/files/${pathname}`, { method: "DELETE" });
    await refresh(); // Refresh the file list after deletion
  } catch (error) {
    console.error("Failed to delete file:", error);
    // Optionally show an error toast/notification
  }
};

function downloadFile(path: string): void {
  const link = document.createElement("a");
  link.href = window.location.origin + "/api/files/" + path;
  link.download = getFilenameFromUrl(path);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Helper function to extract filename from URL
function getFilenameFromUrl(url: string): string {
  try {
    // Try to get filename from URL path
    const pathname = new URL(url).pathname;
    const filename = pathname.split("/").pop();

    // If no filename found, generate a default name based on timestamp
    return filename || `download-${Date.now()}`;
  } catch {
    // Fallback if URL parsing fails
    return `download-${Date.now()}`;
  }
}

const filteredRows = computed(() => {
  let rows = data.value || [];

  if (q.value) {
    rows = rows.filter((file: { pathname: string; contentType?: string }) => {
      return (
        file.pathname.toLowerCase().includes(q.value.toLowerCase()) ||
        file?.contentType?.toLowerCase().includes(q.value.toLowerCase())
      );
    });
  }

  const start = (page.value - 1) * perPage.value;
  const end = start + perPage.value;

  return rows.slice(start, end);
});
</script>
