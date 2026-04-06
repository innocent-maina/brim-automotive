<!-- pages/dashboard/inquiries.vue -->
<template>
  <div class="space-y-5">
    <div>
      <h1 class="font-display text-2xl text-ink">Inquiries</h1>
      <p class="font-body text-sm text-ink-muted mt-0.5">
        Messages from buyers interested in your cars.
      </p>
    </div>

    <div v-if="loading" class="space-y-3">
      <div
        v-for="i in 4"
        :key="i"
        class="bg-surface-2 rounded-lg h-24 img-shimmer"
      />
    </div>

    <div
      v-else-if="inquiries.length === 0"
      class="bg-surface rounded-lg border border-surface-3 p-12 text-center shadow-card"
    >
      <UIcon
        name="i-heroicons-chat-bubble-left-ellipsis"
        class="w-10 h-10 text-ink-faint mx-auto mb-3"
      />
      <p class="font-display text-lg text-ink-soft">No inquiries yet</p>
      <p class="font-body text-sm text-ink-faint mt-1">
        When buyers contact you, they'll appear here.
      </p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="inquiry in inquiries"
        :key="inquiry.id"
        class="bg-surface rounded-lg border border-surface-3 shadow-card overflow-hidden"
        :class="inquiry.status === 'new' ? 'border-l-4' : ''"
        :style="
          inquiry.status === 'new'
            ? 'border-left-color: var(--color-brand);'
            : ''
        "
      >
        <div class="px-5 py-4">
          <div class="flex items-start justify-between gap-3 mb-3">
            <div>
              <p class="font-body font-500 text-sm text-ink">
                {{ inquiry.name }}
              </p>
              <div class="flex items-center gap-3 mt-0.5">
                <span
                  v-if="inquiry.phone"
                  class="text-xs font-body text-ink-muted flex items-center gap-1"
                >
                  <UIcon name="i-heroicons-phone" class="w-3 h-3" />{{
                    inquiry.phone
                  }}
                </span>
                <span
                  v-if="inquiry.email"
                  class="text-xs font-body text-ink-muted flex items-center gap-1"
                >
                  <UIcon name="i-heroicons-envelope" class="w-3 h-3" />{{
                    inquiry.email
                  }}
                </span>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <UBadge
                :label="inquiry.status"
                :color="inquiry.status === 'new' ? 'error' : 'neutral'"
                variant="soft"
                size="xs"
                class="font-body capitalize"
              />
              <span class="text-xs font-body text-ink-faint">{{
                formatDate(inquiry.created_at)
              }}</span>
            </div>
          </div>

          <div
            v-if="inquiry.car_listings"
            class="text-xs font-body text-ink-faint bg-surface-2 rounded px-2.5 py-1.5 mb-3 inline-flex items-center gap-1.5"
          >
            <UIcon name="i-heroicons-tag" class="w-3 h-3" />
            Re: {{ inquiry.car_listings.year }} {{ inquiry.car_listings.make }}
            {{ inquiry.car_listings.model }}
          </div>

          <p class="font-body text-sm text-ink-soft leading-relaxed">
            {{ inquiry.message }}
          </p>

          <div class="mt-4 flex items-center gap-3">
            <a
              v-if="inquiry.phone"
              :href="`https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello ' + inquiry.name + ', thank you for your interest!')}`"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-1.5 text-xs font-body font-500 px-3 py-1.5 rounded-md text-white hover:opacity-80 transition-opacity"
              style="background-color: #25d366"
            >
              <UIcon
                name="i-heroicons-chat-bubble-left-ellipsis"
                class="w-3.5 h-3.5"
              />Reply on WhatsApp
            </a>
            <a
              v-if="inquiry.email"
              :href="`mailto:${inquiry.email}?subject=Re: ${inquiry.car_listings?.title ?? 'Your Inquiry'}`"
              class="inline-flex items-center gap-1.5 text-xs font-body text-ink-soft border border-surface-3 px-3 py-1.5 rounded-md hover:border-brand hover:text-brand transition-colors"
            >
              <UIcon name="i-heroicons-envelope" class="w-3.5 h-3.5" />Reply by
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "dashboard", middleware: "auth" });
useSeo({ title: "Inquiries", noIndex: true });

const { authFetch } = useAuth();
const inquiries = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await authFetch<any>("/api/user/inquiries");
    inquiries.value = res?.data ?? [];
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
