<!-- pages/dashboard/listings.vue -->
<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl text-ink">My Listings</h1>
        <p class="font-body text-sm text-ink-muted mt-0.5">
          {{ listings.length }} listing{{
            listings.length !== 1 ? "s" : ""
          }}
          total
        </p>
      </div>
      <UButton
        to="/list-your-car"
        size="sm"
        class="font-body font-400 shrink-0"
        style="background-color: var(--color-brand); color: white"
      >
        <UIcon name="i-heroicons-plus" class="w-4 h-4" /> New Listing
      </UButton>
    </div>

    <UAlert
      v-if="submitted"
      color="success"
      variant="soft"
      title="Listing submitted for review"
      description="BRIM will review and publish your listing within 24 hours."
      icon="i-heroicons-check-circle"
    />

    <div v-if="loading" class="space-y-3">
      <div
        v-for="i in 3"
        :key="i"
        class="bg-surface-2 rounded-lg h-20 img-shimmer"
      />
    </div>

    <div
      v-else-if="listings.length === 0"
      class="bg-surface rounded-lg border border-surface-3 p-12 text-center shadow-card"
    >
      <UIcon
        name="i-heroicons-tag"
        class="w-10 h-10 text-ink-faint mx-auto mb-3"
      />
      <p class="font-display text-lg text-ink-soft">No listings yet</p>
      <p class="font-body text-sm text-ink-faint mt-1">
        List your first car and reach buyers across Nairobi.
      </p>
      <UButton
        to="/list-your-car"
        class="mt-5 font-body font-400"
        style="background-color: var(--color-brand); color: white"
        >List a Car</UButton
      >
    </div>

    <div
      v-else
      class="bg-surface rounded-lg border border-surface-3 shadow-card overflow-hidden"
    >
      <div
        v-for="listing in listings"
        :key="listing.id"
        class="flex items-center gap-4 px-5 py-4 border-b border-surface-3 last:border-0 hover:bg-surface-2 transition-colors"
      >
        <div class="w-16 h-12 rounded bg-surface-2 overflow-hidden shrink-0">
          <img
            v-if="listing.primary_image"
            :src="listing.primary_image"
            :alt="listing.title"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <UIcon name="i-heroicons-photo" class="w-5 h-5 text-ink-faint" />
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-body font-500 text-ink truncate">
            {{ listing.title }}
          </p>
          <div class="flex items-center gap-3 mt-0.5">
            <span class="text-xs font-body text-ink-faint">{{
              formatPrice(listing.price)
            }}</span>
            <span class="text-surface-3 text-xs">|</span>
            <span class="text-xs font-body text-ink-faint capitalize">{{
              listing.condition
            }}</span>
          </div>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <UBadge
            :label="listing.status"
            :color="statusColor(listing.status)"
            variant="soft"
            size="xs"
            class="font-body capitalize hidden sm:flex"
          />
          <div class="flex items-center gap-1">
            <UButton
              v-if="listing.status === 'active'"
              :to="`/cars/${listing.id}`"
              variant="ghost"
              size="xs"
              icon="i-heroicons-arrow-top-right-on-square"
              class="text-ink-faint hover:text-brand"
            />
            <UButton
              variant="ghost"
              size="xs"
              icon="i-heroicons-trash"
              class="text-ink-faint hover:text-red-500"
              @click="confirmDelete(listing)"
            />
          </div>
        </div>
      </div>
    </div>

    <UModal v-model:open="deleteModal">
      <template #content>
        <div class="p-6">
          <h3 class="font-display text-lg text-ink mb-2">Remove listing?</h3>
          <p class="font-body text-sm text-ink-muted mb-5">
            This will permanently remove
            <strong class="text-ink">{{ deletingListing?.title }}</strong
            >.
          </p>
          <div class="flex gap-3 justify-end">
            <UButton
              variant="ghost"
              class="font-body"
              @click="deleteModal = false"
              >Cancel</UButton
            >
            <UButton
              color="error"
              :loading="deleting"
              class="font-body"
              @click="doDelete"
              >Remove</UButton
            >
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard", middleware: "auth" });
useSeo({ title: "My Listings", noIndex: true });

const route = useRoute();
const { formatPrice } = useListings();
const { authFetch } = useAuth();

const submitted = computed(() => route.query.submitted === "1");
const listings = ref<any[]>([]);
const loading = ref(true);
const deleteModal = ref(false);
const deletingListing = ref<any>(null);
const deleting = ref(false);

const load = async () => {
  loading.value = true;
  try {
    const res = await authFetch<any>("/api/user/listings");
    listings.value = res?.data ?? [];
  } finally {
    loading.value = false;
  }
};

onMounted(load);

const statusColor = (s: string) =>
  ({
    active: "success",
    pending: "warning",
    sold: "neutral",
    rejected: "error",
  })[s] ?? "neutral";

const confirmDelete = (listing: any) => {
  deletingListing.value = listing;
  deleteModal.value = true;
};

const doDelete = async () => {
  if (!deletingListing.value) return;
  deleting.value = true;
  try {
    await authFetch(`/api/listings/${deletingListing.value.id}`, {
      method: "DELETE",
    });
    deleteModal.value = false;
    await load();
  } finally {
    deleting.value = false;
  }
};
</script>
