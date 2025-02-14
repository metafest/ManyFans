<template>
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
  <div class="p-5">
    <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
      <UInput v-model="q" placeholder="Filter files..." />
    </div>

    <UTable :rows="filteredRows" :columns="columns">
      <template #size-data="{ row }">
        {{ formatFileSize(row.size) }}
      </template>

      <template #uploadedAt-data="{ row }">
        {{ formatDate(row.uploadedAt) }}
      </template>

      <template #actions-data="{ row }">
        <UButton
          label="Open in new Tab"
          color="gray"
          size="xs"
          variant="ghost"
          :to="'/api/files/' + row.pathname"
          target="_blank"
        />
      </template>
    </UTable>

    <UPagination
      v-model="page"
      :total="filteredRows.length"
      :per-page="perPage"
      class="mt-4"
    />
  </div>
<<<<<<< HEAD
</template>

<script setup lang="ts">
const { data } = await useFetch("/api/images/");

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
const perPage = ref(5);

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

const filteredRows = computed(() => {
  let rows = data.value || [];

  if (q.value) {
    rows = rows.filter((file) => {
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
=======
  <main>
    <ImageGallery />
  </main>
</template>
<<<<<<< HEAD
>>>>>>> cf91573 (add server configuration, API endpoints, and image handling components)
=======
</template>

<script setup lang="ts">
const { data } = await useFetch("/api/images/");

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
const perPage = ref(5);

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

const filteredRows = computed(() => {
  let rows = data.value || [];

  if (q.value) {
    rows = rows.filter((file) => {
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
>>>>>>> f67f057 (remove unused components, API endpoints, and update nuxt.config to streamline the application)
=======
>>>>>>> 3ae8324 (add server configuration, API endpoints, and image handling components)
<<<<<<< HEAD
>>>>>>> f2a68fd (add server configuration, API endpoints, and image handling components)
=======
=======
</template>

<script setup lang="ts">
const { data } = await useFetch("/api/images/");

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
const perPage = ref(5);

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

const filteredRows = computed(() => {
  let rows = data.value || [];

  if (q.value) {
    rows = rows.filter((file) => {
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
>>>>>>> 294b92f (remove unused components, API endpoints, and update nuxt.config to streamline the application)
>>>>>>> f3c9738 (remove unused components, API endpoints, and update nuxt.config to streamline the application)
