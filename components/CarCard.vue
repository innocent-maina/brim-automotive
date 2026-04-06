<!-- components/CarCard.vue -->
<template>
  <article
    class="bg-surface rounded-lg border border-surface-3 overflow-hidden card-lift shadow-card group"
  >
    <!-- Image -->
    <NuxtLink
      :to="`/cars/${listing.id}`"
      class="block relative aspect-[4/3] overflow-hidden bg-surface-2"
    >
      <img
        :src="imgSrc"
        :alt="`${listing.year} ${listing.make} ${listing.model}`"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
        loading="lazy"
        @error="imgSrc = '/placeholder-car.jpg'"
      />

      <!-- Market Score badge -->
      <span
        v-if="listing.market_score"
        class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-sm text-xs font-body font-500 tracking-wide"
        :class="marketScoreClass(listing.market_score)"
      >
        {{ marketScoreLabel(listing.market_score) }}
      </span>

      <!-- Save button -->
      <button
        class="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors shadow-sm"
        :title="saved ? 'Remove from saved' : 'Save car'"
        @click.prevent="handleSave"
      >
        <UIcon
          :name="saved ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
          class="w-4 h-4 transition-colors"
          :class="saved ? 'text-brand' : 'text-ink-muted'"
        />
      </button>

      <!-- Featured ribbon -->
      <span
        v-if="listing.is_featured"
        class="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-sm text-xs font-body font-500 bg-surface-inv/80 text-white backdrop-blur-sm"
      >
        Featured
      </span>
    </NuxtLink>

    <!-- Info -->
    <div class="p-4">
      <NuxtLink :to="`/cars/${listing.id}`" class="block">
        <h3
          class="font-display text-base text-ink leading-tight line-clamp-1 group-hover:text-brand transition-colors"
        >
          {{ listing.title }}
        </h3>
      </NuxtLink>

      <!-- Specs row -->
      <div
        class="flex items-center gap-3 mt-2 text-xs font-body text-ink-faint"
      >
        <span class="flex items-center gap-1">
          <UIcon name="i-heroicons-calendar-days" class="w-3.5 h-3.5" />
          {{ listing.year }}
        </span>
        <span class="text-surface-3">|</span>
        <span class="flex items-center gap-1">
          <UIcon name="i-heroicons-arrow-path" class="w-3.5 h-3.5" />
          {{ formatMileage(listing.mileage) }}
        </span>
        <span class="text-surface-3">|</span>
        <span class="capitalize">{{ listing.transmission }}</span>
      </div>

      <!-- Price + Compare -->
      <div class="flex items-end justify-between mt-3">
        <div>
          <p class="font-display text-lg text-ink leading-none">
            {{ formatPrice(listing.price) }}
          </p>
          <p class="text-xs font-body text-ink-faint mt-0.5">
            {{ listing.location }}
          </p>
        </div>

        <button
          class="flex items-center gap-1 text-xs font-body px-2.5 py-1.5 rounded-md border transition-colors"
          :class="
            inComparison
              ? 'border-brand text-brand bg-brand-subtle'
              : 'border-surface-3 text-ink-muted hover:border-brand hover:text-brand'
          "
          @click="toggleComparison(listing.id)"
        >
          <UIcon
            :name="
              inComparison ? 'i-heroicons-check' : 'i-heroicons-squares-plus'
            "
            class="w-3.5 h-3.5"
          />
          {{ inComparison ? "Added" : "Compare" }}
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { CarListingCard } from "~/types";

const props = defineProps<{ listing: CarListingCard }>();

const {
  formatPrice,
  formatMileage,
  marketScoreLabel,
  marketScoreClass,
  primaryImage,
} = useListings();
const { isSaved, toggleSaved } = useSavedCars();
const { isInComparison, toggleComparison, canAdd } = useComparison();

const imgSrc = ref(primaryImage(props.listing));
const saved = computed(() => isSaved(props.listing.id));
const inComparison = computed(() => isInComparison(props.listing.id));

const handleSave = () => toggleSaved(props.listing.id);
</script>
