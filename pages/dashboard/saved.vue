<!-- pages/dashboard/saved.vue -->
<template>
  <div class="space-y-5">
    <div>
      <h1 class="font-display text-2xl text-ink">Saved Cars</h1>
      <p class="font-body text-sm text-ink-muted mt-0.5">
        Cars you've bookmarked for later.
      </p>
    </div>

    <div
      v-if="loading"
      class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
    >
      <div
        v-for="i in 3"
        :key="i"
        class="bg-surface-2 rounded-lg aspect-[4/5] img-shimmer"
      />
    </div>

    <div
      v-else-if="savedListings.length === 0"
      class="bg-surface rounded-lg border border-surface-3 p-12 text-center shadow-card"
    >
      <UIcon
        name="i-heroicons-heart"
        class="w-10 h-10 text-ink-faint mx-auto mb-3"
      />
      <p class="font-display text-lg text-ink-soft">No saved cars</p>
      <p class="font-body text-sm text-ink-faint mt-1">
        Click the heart on any listing to save it here.
      </p>
      <UButton
        to="/"
        class="mt-5 font-body font-400"
        style="background-color: var(--color-brand); color: white"
        >Browse Cars</UButton
      >
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      <CarCard
        v-for="listing in savedListings"
        :key="listing.id"
        :listing="listing"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard", middleware: "auth" });
useSeo({ title: "Saved Cars", noIndex: true });

const { savedIds } = useSavedCars();
const { authFetch } = useAuth();

const allListings = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await authFetch<any>("/api/listings?limit=100&page=1");
    allListings.value = res?.data ?? [];
  } finally {
    loading.value = false;
  }
});

const savedListings = computed(() =>
  allListings.value.filter((l: any) => savedIds.value.includes(l.id)),
);
</script>
