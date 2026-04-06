<!-- pages/admin/users.vue -->
<template>
  <div class="space-y-5">
    <div>
      <h1 class="font-display text-2xl text-ink">Users</h1>
      <p class="font-body text-sm text-ink-muted mt-0.5">
        {{ users.length }} registered accounts.
      </p>
    </div>

    <div v-if="loading" class="space-y-3">
      <div
        v-for="i in 5"
        :key="i"
        class="bg-surface-2 rounded-lg h-16 img-shimmer"
      />
    </div>

    <div
      v-else
      class="bg-surface rounded-lg border border-surface-3 shadow-card overflow-hidden"
    >
      <div
        v-for="u in users"
        :key="u.id"
        class="flex items-center gap-4 px-5 py-3 border-b border-surface-3 last:border-0"
      >
        <div
          class="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center shrink-0 text-xs font-body font-500 text-ink-muted uppercase"
        >
          {{ u.full_name?.[0] ?? "?" }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-body font-500 text-ink">
            {{ u.full_name ?? "Unnamed" }}
          </p>
          <p class="text-xs font-body text-ink-faint">
            {{ formatDate(u.created_at) }}
          </p>
        </div>
        <UBadge
          :label="u.role"
          :color="u.role === 'admin' ? 'error' : 'neutral'"
          variant="soft"
          size="xs"
          class="font-body capitalize"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard", middleware: "admin" });
useSeo({ title: "Users", noIndex: true });

const { authFetch } = useAuth();
const users = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await authFetch<any>("/api/admin/users");
    users.value = res?.data ?? [];
  } finally {
    loading.value = false;
  }
});

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
</script>
