<!-- pages/admin/listings.vue -->
<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl text-ink">All Listings</h1>
        <p class="font-body text-sm text-ink-muted mt-0.5">
          {{ filtered.length }} listing{{ filtered.length !== 1 ? "s" : "" }}
        </p>
      </div>
    </div>

    <div class="flex gap-1 border-b border-surface-3">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="px-4 py-2 text-sm font-body border-b-2 transition-colors -mb-px"
        :class="
          activeStatus === tab.value
            ? 'border-brand text-brand font-500'
            : 'border-transparent text-ink-muted hover:text-ink'
        "
        @click="activeStatus = tab.value"
      >
        {{ tab.label }}
        <span
          v-if="tab.count > 0"
          class="ml-1.5 px-1.5 py-0.5 rounded-full text-xs"
          :class="
            activeStatus === tab.value
              ? 'bg-brand-subtle text-brand'
              : 'bg-surface-2 text-ink-faint'
          "
        >
          {{ tab.count }}
        </span>
      </button>
    </div>

    <div v-if="loading" class="space-y-3">
      <div
        v-for="i in 5"
        :key="i"
        class="bg-surface-2 rounded-lg h-20 img-shimmer"
      />
    </div>

    <div
      v-else-if="filtered.length === 0"
      class="bg-surface rounded-lg border border-surface-3 p-10 text-center shadow-card"
    >
      <p class="font-body text-sm text-ink-muted">
        No listings with status "{{ activeStatus }}".
      </p>
    </div>

    <div
      v-else
      class="bg-surface rounded-lg border border-surface-3 shadow-card overflow-hidden"
    >
      <div
        v-for="listing in filtered"
        :key="listing.id"
        class="flex items-center gap-4 px-5 py-3 border-b border-surface-3 last:border-0 hover:bg-surface-2 transition-colors"
      >
        <div class="w-16 h-12 rounded bg-surface-2 overflow-hidden shrink-0">
          <img
            v-if="listing.primary_image"
            :src="listing.primary_image"
            :alt="listing.title"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-body font-500 text-ink truncate">
            {{ listing.title }}
          </p>
          <div
            class="flex items-center gap-3 mt-0.5 text-xs font-body text-ink-faint"
          >
            <span>{{ formatPrice(listing.price) }}</span>
            <span>·</span>
            <span>{{ listing.profiles?.full_name ?? "Unknown" }}</span>
            <span>·</span>
            <span>{{ formatDate(listing.created_at) }}</span>
          </div>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <UBadge
            :label="listing.status"
            :color="statusColor(listing.status)"
            variant="soft"
            size="xs"
            class="font-body capitalize"
          />
          <template v-if="listing.status === 'pending'">
            <UButton
              size="xs"
              color="success"
              variant="soft"
              class="font-body"
              @click="updateStatus(listing.id, 'active')"
              >Approve</UButton
            >
            <UButton
              size="xs"
              color="error"
              variant="soft"
              class="font-body"
              @click="updateStatus(listing.id, 'rejected')"
              >Reject</UButton
            >
          </template>
          <template v-else-if="listing.status === 'active'">
            <UButton
              size="xs"
              variant="soft"
              class="font-body"
              @click="updateStatus(listing.id, 'sold')"
              >Mark Sold</UButton
            >
          </template>
          <UButton
            size="xs"
            variant="ghost"
            icon="i-heroicons-trash"
            class="text-ink-faint hover:text-red-500"
            @click="deleteListing(listing.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard", middleware: "admin" });
useSeo({ title: "All Listings", noIndex: true });

const route = useRoute();
const { formatPrice } = useListings();
const { authFetch } = useAuth();

const activeStatus = ref((route.query.status as string) || "all");
const allListings = ref<any[]>([]);
const loading = ref(true);

const loadListings = async () => {
  loading.value = true;
  try {
    const res = await authFetch<any>("/api/admin/listings");
    allListings.value = res?.data ?? [];
  } finally {
    loading.value = false;
  }
};

onMounted(loadListings);

const filtered = computed(() =>
  activeStatus.value === "all"
    ? allListings.value
    : allListings.value.filter((l: any) => l.status === activeStatus.value),
);
const countByStatus = (s: string) =>
  allListings.value.filter((l: any) => l.status === s).length;
const tabs = computed(() => [
  { label: "All", value: "all", count: allListings.value.length },
  { label: "Pending", value: "pending", count: countByStatus("pending") },
  { label: "Active", value: "active", count: countByStatus("active") },
  { label: "Sold", value: "sold", count: countByStatus("sold") },
  { label: "Rejected", value: "rejected", count: countByStatus("rejected") },
]);

const statusColor = (s: string) =>
  ({
    active: "success",
    pending: "warning",
    sold: "neutral",
    rejected: "error",
  })[s] ?? "neutral";
const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));

const updateStatus = async (id: string, status: string) => {
  await authFetch(`/api/listings/${id}`, { method: "PATCH", body: { status } });
  await loadListings();
};

const deleteListing = async (id: string) => {
  if (!confirm("Delete this listing permanently?")) return;
  await authFetch(`/api/listings/${id}`, { method: "DELETE" });
  await loadListings();
};
</script>
