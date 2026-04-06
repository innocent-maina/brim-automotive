<!-- pages/compare.vue -->
<template>
  <div class="container-brim py-8 max-w-6xl">
    <div class="mb-6">
      <h1 class="font-display text-3xl text-ink">Compare Cars</h1>
      <p class="font-body text-sm text-ink-muted mt-1">
        Select up to 3 cars from any listing to compare side by side.
      </p>
    </div>

    <!-- Empty state -->
    <div v-if="compareIds.length === 0" class="text-center py-20">
      <UIcon
        name="i-heroicons-squares-plus"
        class="w-12 h-12 text-ink-faint mx-auto mb-4"
      />
      <p class="font-display text-xl text-ink-soft">No cars selected</p>
      <p class="font-body text-sm text-ink-faint mt-2">
        Browse listings and click "Compare" on any car to add it here.
      </p>
      <UButton
        to="/"
        class="mt-5 font-body font-400"
        style="background-color: var(--color-brand); color: white"
      >
        Browse Cars
      </UButton>
    </div>

    <!-- Need more -->
    <div v-else-if="compareIds.length === 1" class="text-center py-20">
      <UIcon
        name="i-heroicons-plus-circle"
        class="w-12 h-12 text-ink-faint mx-auto mb-4"
      />
      <p class="font-display text-xl text-ink-soft">Add one more car</p>
      <p class="font-body text-sm text-ink-faint mt-2">
        You need at least 2 cars to compare.
      </p>
      <UButton
        to="/"
        class="mt-5 font-body font-400"
        style="background-color: var(--color-brand); color: white"
      >
        Browse Cars
      </UButton>
    </div>

    <!-- Comparison table -->
    <div v-else-if="listings.length >= 2">
      <!-- Pending -->
      <div v-if="pending" class="flex gap-4">
        <div
          v-for="i in compareIds.length"
          :key="i"
          class="flex-1 bg-surface-2 rounded-lg h-96 img-shimmer"
        />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full border-collapse">
          <!-- Header row: car cards -->
          <thead>
            <tr>
              <th class="text-left w-36 pr-4 pb-4">
                <span
                  class="text-xs font-body font-500 uppercase tracking-wide text-ink-faint"
                >
                  Comparing {{ listings.length }} cars
                </span>
              </th>
              <th
                v-for="car in listings"
                :key="car.id"
                class="pb-4 px-3 text-left align-top"
              >
                <div
                  class="bg-surface rounded-lg border border-surface-3 overflow-hidden shadow-card"
                >
                  <div class="aspect-[4/3] overflow-hidden bg-surface-2">
                    <img
                      :src="car.primary_image ?? '/placeholder-car.jpg'"
                      :alt="car.title"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="p-3">
                    <NuxtLink
                      :to="`/cars/${car.id}`"
                      class="font-display text-sm text-ink hover:text-brand transition-colors line-clamp-2 leading-tight"
                    >
                      {{ car.title }}
                    </NuxtLink>
                    <p class="font-display text-base text-ink mt-1.5">
                      {{ formatPrice(car.price) }}
                    </p>
                    <MarketScoreBadge
                      :score="car.market_score"
                      class="mt-2 text-xs"
                    />
                  </div>
                  <div class="px-3 pb-3">
                    <button
                      class="text-xs font-body text-ink-faint hover:text-brand transition-colors flex items-center gap-1"
                      @click="removeFromComparison(car.id)"
                    >
                      <UIcon name="i-heroicons-x-mark" class="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              </th>
            </tr>
          </thead>

          <!-- Spec rows -->
          <tbody>
            <tr
              v-for="(spec, idx) in specs"
              :key="spec.key"
              :class="idx % 2 === 0 ? 'bg-surface-2' : 'bg-surface'"
            >
              <td
                class="py-3 pr-4 pl-2 text-xs font-body font-500 text-ink-muted rounded-l-md"
              >
                {{ spec.label }}
              </td>
              <td
                v-for="car in listings"
                :key="car.id"
                class="py-3 px-3 text-sm font-body text-ink"
                :class="
                  isHighlighted(spec, car) ? 'font-500 text-green-700' : ''
                "
              >
                {{ formatSpecValue(spec, car) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- WhatsApp CTA row -->
      <div class="mt-6 flex gap-4 overflow-x-auto">
        <div class="w-36 shrink-0" />
        <a
          v-for="car in listings"
          :key="car.id"
          :href="buildInquiryLink(car as any)"
          target="_blank"
          rel="noopener"
          class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-body font-500 text-white transition-opacity hover:opacity-90 whitespace-nowrap"
          style="background-color: #25d366; min-width: 180px"
        >
          <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="w-4 h-4" />
          Inquire
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarListingCard } from "~/types";

useSeo({
  title: "Compare Cars",
  description:
    "Compare up to 3 used cars side by side. See specs, mileage, price, and Market Score.",
});

const { compareIds, removeFromComparison } = useComparison();
const { formatPrice, formatMileage } = useListings();
const { buildInquiryLink } = useWhatsApp();

const { data: res, pending } = await useLazyFetch("/api/listings/compare", {
  query: computed(() => ({ ids: compareIds.value.join(",") })),
  watch: [compareIds],
});

const listings = computed<CarListingCard[]>(
  () => (res.value as any)?.data ?? [],
);

const specs = [
  { label: "Year", key: "year", format: "year", higherBetter: true },
  { label: "Price (KES)", key: "price", format: "currency", lowerBetter: true },
  { label: "Mileage", key: "mileage", format: "km", lowerBetter: true },
  { label: "Engine", key: "engine_size", format: "engine" },
  { label: "Transmission", key: "transmission", format: "text" },
  { label: "Fuel Type", key: "fuel_type", format: "text" },
  { label: "Drive Type", key: "drive_type", format: "text" },
  { label: "Body Type", key: "body_type", format: "text" },
  { label: "Colour", key: "color", format: "text" },
  { label: "Condition", key: "condition", format: "text" },
  { label: "Location", key: "location", format: "text" },
  { label: "Market Score", key: "market_score", format: "score" },
];

const formatSpecValue = (spec: any, car: any): string => {
  const val = car[spec.key];
  if (val === null || val === undefined) return "—";
  if (spec.format === "currency") return formatPrice(val);
  if (spec.format === "km") return formatMileage(val);
  if (spec.format === "engine") return `${val}L`;
  if (spec.format === "score")
    return val
      .replace("_", " ")
      .replace(/\b\w/g, (c: string) => c.toUpperCase());
  return String(val);
};

// Highlight the best value in numeric specs
const isHighlighted = (spec: any, car: any): boolean => {
  if (!spec.lowerBetter && !spec.higherBetter) return false;
  const vals = listings.value
    .map((c) => (c as any)[spec.key])
    .filter((v: any) => v !== null);
  const carVal = (car as any)[spec.key];
  if (spec.lowerBetter) return carVal === Math.min(...vals);
  if (spec.higherBetter) return carVal === Math.max(...vals);
  return false;
};
</script>
