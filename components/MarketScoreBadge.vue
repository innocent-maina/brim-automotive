<!-- components/MarketScoreBadge.vue -->
<template>
  <div
    v-if="score"
    class="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-body font-500"
    :class="badgeClass"
  >
    <UIcon :name="icon" class="w-4 h-4" />
    <span>{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import type { MarketScore } from "~/types";

const props = defineProps<{ score: MarketScore | null }>();

const badgeClass = computed(() => {
  const map: Record<string, string> = {
    good_deal: "badge-good-deal",
    fair_price: "badge-fair-price",
    overpriced: "badge-overpriced",
  };
  return props.score ? map[props.score] : "";
});

const icon = computed(() => {
  const map: Record<string, string> = {
    good_deal: "i-heroicons-arrow-trending-down",
    fair_price: "i-heroicons-check-circle",
    overpriced: "i-heroicons-arrow-trending-up",
  };
  return props.score ? map[props.score] : "";
});

const label = computed(() => {
  const map: Record<string, string> = {
    good_deal: "Good Deal — Priced below market",
    fair_price: "Fair Price — Market rate",
    overpriced: "Overpriced — Above market",
  };
  return props.score ? map[props.score] : "";
});
</script>
