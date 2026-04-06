<!-- pages/dashboard/index.vue -->
<template>
  <div class="space-y-6">
    <div>
      <h1 class="font-display text-2xl text-ink">Overview</h1>
      <p class="font-body text-sm text-ink-muted mt-1">
        Hello, {{ profile?.full_name?.split(" ")[0] ?? "there" }}.
      </p>
    </div>

    <!-- Stats -->
    <div v-if="stats" class="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <div
        v-for="stat in statCards"
        :key="stat.label"
        class="bg-surface rounded-lg border border-surface-3 p-4 shadow-card"
      >
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs font-body text-ink-faint uppercase tracking-wide">
            {{ stat.label }}
          </p>
          <UIcon :name="stat.icon" class="w-4 h-4 text-ink-faint" />
        </div>
        <p class="font-display text-2xl text-ink">{{ stat.value }}</p>
        <p v-if="stat.note" class="text-xs font-body text-ink-faint mt-1">
          {{ stat.note }}
        </p>
      </div>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <div
        v-for="i in 6"
        :key="i"
        class="bg-surface-2 rounded-lg h-24 img-shimmer"
      />
    </div>

    <!-- Quick actions -->
    <div class="bg-surface rounded-lg border border-surface-3 p-5 shadow-card">
      <h2 class="font-display text-base text-ink mb-4">Quick Actions</h2>
      <div class="flex flex-wrap gap-3">
        <UButton
          to="/list-your-car"
          size="sm"
          class="font-body font-400"
          style="background-color: var(--color-brand); color: white"
        >
          <UIcon name="i-heroicons-plus" class="w-4 h-4" />
          List a New Car
        </UButton>
        <UButton
          to="/dashboard/listings"
          variant="outline"
          size="sm"
          class="font-body"
        >
          <UIcon name="i-heroicons-tag" class="w-4 h-4" />
          View My Listings
        </UButton>
        <UButton
          to="/dashboard/inquiries"
          variant="outline"
          size="sm"
          class="font-body"
        >
          <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="w-4 h-4" />
          View Inquiries
          <UBadge
            v-if="stats?.new_inquiries"
            :label="String(stats.new_inquiries)"
            color="error"
            size="xs"
          />
        </UButton>
      </div>
    </div>

    <!-- Recent listings -->
    <div
      class="bg-surface rounded-lg border border-surface-3 shadow-card overflow-hidden"
    >
      <div
        class="px-5 py-4 border-b border-surface-3 flex items-center justify-between"
      >
        <h2 class="font-display text-base text-ink">Recent Listings</h2>
        <NuxtLink
          to="/dashboard/listings"
          class="text-xs font-body text-brand hover:underline"
        >
          View all
        </NuxtLink>
      </div>
      <div v-if="listings.length > 0">
        <div
          v-for="l in listings.slice(0, 5)"
          :key="l.id"
          class="flex items-center gap-3 px-5 py-3 border-b border-surface-3 last:border-0 hover:bg-surface-2 transition-colors"
        >
          <div class="w-12 h-9 rounded bg-surface-2 overflow-hidden shrink-0">
            <img
              v-if="l.primary_image"
              :src="l.primary_image"
              :alt="l.title"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-body font-500 text-ink truncate">
              {{ l.title }}
            </p>
            <p class="text-xs font-body text-ink-faint">
              {{ formatPrice(l.price) }}
            </p>
          </div>
          <UBadge
            :label="l.status"
            :color="statusColor(l.status)"
            variant="soft"
            size="xs"
            class="font-body shrink-0 capitalize"
          />
        </div>
      </div>
      <div v-else class="px-5 py-8 text-center">
        <p class="text-sm font-body text-ink-muted">
          You have no listings yet.
        </p>
        <UButton
          to="/list-your-car"
          variant="ghost"
          size="sm"
          class="mt-2 font-body text-brand"
        >
          List your first car
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard", middleware: "auth" });
useSeo({ title: "Dashboard", noIndex: true });

const { profile } = useAuth();
const { formatPrice } = useListings();

const { data: statsRes } = await useFetch("/api/user/stats");
const { data: listingsRes } = await useFetch("/api/user/listings");

const stats = computed<any>(() => (statsRes.value as any)?.data);
const listings = computed<any[]>(() => (listingsRes.value as any)?.data ?? []);

const statCards = computed(() => [
  {
    label: "Total Listings",
    value: stats.value?.total_listings ?? 0,
    icon: "i-heroicons-tag",
    note: undefined,
  },
  {
    label: "Active",
    value: stats.value?.active_listings ?? 0,
    icon: "i-heroicons-check-circle",
    note: "Live on site",
  },
  {
    label: "Pending Review",
    value: stats.value?.pending_listings ?? 0,
    icon: "i-heroicons-clock",
    note: undefined,
  },
  {
    label: "Sold",
    value: stats.value?.sold_listings ?? 0,
    icon: "i-heroicons-banknotes",
    note: undefined,
  },
  {
    label: "Inquiries",
    value: stats.value?.total_inquiries ?? 0,
    icon: "i-heroicons-chat-bubble-left-ellipsis",
    note: undefined,
  },
  {
    label: "New Inquiries",
    value: stats.value?.new_inquiries ?? 0,
    icon: "i-heroicons-bell-alert",
    note: "Unread",
  },
]);

const statusColor = (status: string) => {
  const map: Record<string, string> = {
    active: "success",
    pending: "warning",
    sold: "neutral",
    rejected: "error",
  };
  return map[status] ?? "neutral";
};
</script>
