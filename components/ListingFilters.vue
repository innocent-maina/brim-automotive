<!-- components/ListingFilters.vue -->
<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="font-display text-base text-ink">Filters</h3>
      <button
        v-if="hasActiveFilters"
        class="text-xs font-body text-brand hover:underline"
        @click="clearAll"
      >
        Clear all
      </button>
    </div>

    <!-- Make -->
    <div>
      <label
        class="block text-xs font-body font-500 text-ink-muted uppercase tracking-wide mb-2"
        >Make</label
      >
      <USelect
        v-model="local.make"
        :items="makeOptions"
        placeholder="Any make"
        size="sm"
        class="font-body"
      />
    </div>

    <!-- Body type -->
    <div>
      <label
        class="block text-xs font-body font-500 text-ink-muted uppercase tracking-wide mb-2"
        >Body Type</label
      >
      <USelect
        v-model="local.body_type"
        :items="bodyTypeOptions"
        placeholder="Any type"
        size="sm"
        class="font-body"
      />
    </div>

    <!-- Transmission -->
    <div>
      <label
        class="block text-xs font-body font-500 text-ink-muted uppercase tracking-wide mb-2"
        >Transmission</label
      >
      <div class="flex gap-2">
        <button
          v-for="t in transmissionOptions"
          :key="t.value"
          class="flex-1 py-1.5 text-xs font-body rounded-md border transition-colors"
          :class="
            local.transmission === t.value
              ? 'border-brand bg-brand-subtle text-brand font-500'
              : 'border-surface-3 text-ink-soft hover:border-ink-faint'
          "
          @click="
            local.transmission = local.transmission === t.value ? '' : t.value
          "
        >
          {{ t.label }}
        </button>
      </div>
    </div>

    <!-- Fuel type -->
    <div>
      <label
        class="block text-xs font-body font-500 text-ink-muted uppercase tracking-wide mb-2"
        >Fuel</label
      >
      <div class="flex flex-wrap gap-2">
        <button
          v-for="f in fuelOptions"
          :key="f.value"
          class="px-3 py-1 text-xs font-body rounded-full border transition-colors"
          :class="
            local.fuel_type === f.value
              ? 'border-brand bg-brand-subtle text-brand font-500'
              : 'border-surface-3 text-ink-soft hover:border-ink-faint'
          "
          @click="local.fuel_type = local.fuel_type === f.value ? '' : f.value"
        >
          {{ f.label }}
        </button>
      </div>
    </div>

    <!-- Price range -->
    <div>
      <label
        class="block text-xs font-body font-500 text-ink-muted uppercase tracking-wide mb-2"
      >
        Price (KES)
      </label>
      <div class="flex gap-2">
        <UInput
          v-model="priceMinStr"
          placeholder="Min"
          size="sm"
          type="number"
          class="font-body flex-1"
        />
        <UInput
          v-model="priceMaxStr"
          placeholder="Max"
          size="sm"
          type="number"
          class="font-body flex-1"
        />
      </div>
    </div>

    <!-- Year range -->
    <div>
      <label
        class="block text-xs font-body font-500 text-ink-muted uppercase tracking-wide mb-2"
        >Year</label
      >
      <div class="flex gap-2">
        <USelect
          v-model="yearMinStr"
          :items="yearOptions"
          placeholder="From"
          size="sm"
          class="font-body flex-1"
        />
        <USelect
          v-model="yearMaxStr"
          :items="yearOptions"
          placeholder="To"
          size="sm"
          class="font-body flex-1"
        />
      </div>
    </div>

    <!-- Market Score -->
    <div>
      <label
        class="block text-xs font-body font-500 text-ink-muted uppercase tracking-wide mb-2"
        >Market Score</label
      >
      <div class="space-y-1.5">
        <button
          v-for="ms in marketScoreOptions"
          :key="ms.value"
          class="w-full flex items-center gap-2.5 px-3 py-2 rounded-md border text-xs font-body transition-colors text-left"
          :class="
            local.market_score === ms.value
              ? 'border-brand bg-brand-subtle text-brand'
              : 'border-surface-3 text-ink-soft hover:border-ink-faint'
          "
          @click="
            local.market_score = local.market_score === ms.value ? '' : ms.value
          "
        >
          <span
            class="w-2 h-2 rounded-full shrink-0"
            :style="{ backgroundColor: ms.color }"
          />
          {{ ms.label }}
        </button>
      </div>
    </div>

    <!-- Apply button (mobile) -->
    <UButton
      block
      class="font-body font-400 lg:hidden"
      style="background-color: var(--color-brand); color: white"
      @click="$emit('apply')"
    >
      Apply Filters
    </UButton>
  </div>
</template>

<script setup lang="ts">
import type { ListingFilters } from "~/types";

const props = defineProps<{ modelValue: ListingFilters }>();
const emit = defineEmits<{
  "update:modelValue": [ListingFilters];
  apply: [];
}>();

// Nuxt UI v3 USelect: value must never be ''. Use undefined for "unset" state.
const local = reactive<ListingFilters>({
  ...props.modelValue,
  make: props.modelValue.make || undefined,
  body_type: props.modelValue.body_type || undefined,
  transmission: props.modelValue.transmission || undefined,
  fuel_type: props.modelValue.fuel_type || undefined,
  market_score: props.modelValue.market_score || undefined,
});

const priceMinStr = ref(
  props.modelValue.price_min ? String(props.modelValue.price_min) : "",
);
const priceMaxStr = ref(
  props.modelValue.price_max ? String(props.modelValue.price_max) : "",
);
const yearMinStr = ref(
  props.modelValue.year_min ? String(props.modelValue.year_min) : "",
);
const yearMaxStr = ref(
  props.modelValue.year_max ? String(props.modelValue.year_max) : "",
);

watch([priceMinStr, priceMaxStr, yearMinStr, yearMaxStr], () => {
  local.price_min = priceMinStr.value ? parseInt(priceMinStr.value) : undefined;
  local.price_max = priceMaxStr.value ? parseInt(priceMaxStr.value) : undefined;
  local.year_min = yearMinStr.value ? parseInt(yearMinStr.value) : undefined;
  local.year_max = yearMaxStr.value ? parseInt(yearMaxStr.value) : undefined;
});

watch(local, () => emit("update:modelValue", { ...local }), { deep: true });

const hasActiveFilters = computed(
  () =>
    !!(
      local.make ||
      local.body_type ||
      local.transmission ||
      local.fuel_type ||
      local.price_min ||
      local.price_max ||
      local.year_min ||
      local.year_max ||
      local.market_score
    ),
);

const clearAll = () => {
  Object.assign(local, {
    make: undefined,
    body_type: undefined,
    transmission: undefined,
    fuel_type: undefined,
    market_score: undefined,
    price_min: undefined,
    price_max: undefined,
    year_min: undefined,
    year_max: undefined,
  });
  priceMinStr.value = "";
  priceMaxStr.value = "";
  yearMinStr.value = "";
  yearMaxStr.value = "";
};

// Nuxt UI v3: placeholder option must be omitted — USelect shows placeholder
// automatically when modelValue is undefined. No need for an "Any" entry.
const makeOptions = [
  "Toyota",
  "Mazda",
  "Subaru",
  "Honda",
  "Nissan",
  "Mercedes-Benz",
  "BMW",
  "Volkswagen",
  "Mitsubishi",
  "Isuzu",
].map((m) => ({ label: m, value: m }));

const bodyTypeOptions = [
  "Sedan",
  "Station Wagon",
  "SUV",
  "Hatchback",
  "Pickup",
  "Coupe",
  "Van",
].map((b) => ({ label: b, value: b }));

const transmissionOptions = [
  { label: "Auto", value: "automatic" },
  { label: "Manual", value: "manual" },
];

const fuelOptions = [
  { label: "Petrol", value: "petrol" },
  { label: "Diesel", value: "diesel" },
  { label: "Hybrid", value: "hybrid" },
  { label: "Electric", value: "electric" },
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: currentYear - 2008 }, (_, i) => {
  const y = currentYear - i;
  return { label: String(y), value: String(y) };
});

const marketScoreOptions = [
  { label: "Good Deal", value: "good_deal", color: "var(--color-good-deal)" },
  {
    label: "Fair Price",
    value: "fair_price",
    color: "var(--color-fair-price)",
  },
  {
    label: "Overpriced",
    value: "overpriced",
    color: "var(--color-overpriced)",
  },
];
</script>
