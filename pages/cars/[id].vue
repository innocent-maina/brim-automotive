<!-- pages/cars/[id].vue -->
<template>
  <div v-if="listing" class="container-brim py-8 max-w-6xl">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs font-body text-ink-faint mb-6">
      <NuxtLink to="/" class="hover:text-brand transition-colors"
        >Cars</NuxtLink
      >
      <UIcon name="i-heroicons-chevron-right" class="w-3 h-3" />
      <span class="text-ink-soft">{{ listing.make }} {{ listing.model }}</span>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left: Images + details -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Image gallery -->
        <div class="space-y-2">
          <div class="aspect-[16/10] rounded-lg overflow-hidden bg-surface-2">
            <img
              :src="activeImage"
              :alt="listing.title"
              class="w-full h-full object-cover"
              @error="activeImage = '/placeholder-car.jpg'"
            />
          </div>
          <div v-if="images.length > 1" class="flex gap-2 overflow-x-auto pb-1">
            <button
              v-for="img in images"
              :key="img.id"
              class="shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition-colors"
              :class="
                activeImage === img.url ? 'border-brand' : 'border-transparent'
              "
              @click="activeImage = img.url"
            >
              <img
                :src="img.url"
                :alt="listing.title"
                class="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        <!-- Title + Market Score -->
        <div>
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1
                class="font-display text-2xl sm:text-3xl text-ink leading-tight"
              >
                {{ listing.title }}
              </h1>
              <p class="font-body text-sm text-ink-muted mt-1">
                <UIcon
                  name="i-heroicons-map-pin"
                  class="w-3.5 h-3.5 inline mr-1"
                />
                {{ listing.location }}
              </p>
            </div>
            <MarketScoreBadge :score="listing.market_score" />
          </div>
        </div>

        <!-- Key specs grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div
            v-for="spec in keySpecs"
            :key="spec.label"
            class="bg-surface-2 rounded-md p-3 border border-surface-3"
          >
            <p class="text-xs font-body text-ink-faint uppercase tracking-wide">
              {{ spec.label }}
            </p>
            <p class="font-body font-500 text-ink mt-0.5 text-sm">
              {{ spec.value }}
            </p>
          </div>
        </div>

        <!-- Description -->
        <div v-if="listing.description">
          <h2 class="font-display text-lg text-ink mb-2">Description</h2>
          <p
            class="font-body text-sm text-ink-soft leading-relaxed whitespace-pre-line"
          >
            {{ listing.description }}
          </p>
        </div>

        <!-- Market Score explanation -->
        <div
          v-if="listing.market_score"
          class="rounded-lg border p-4 space-y-1"
          :class="scoreBoxClass"
        >
          <div class="flex items-center gap-2">
            <UIcon :name="scoreIcon" class="w-4 h-4" />
            <h3 class="font-body font-500 text-sm">About this Market Score</h3>
          </div>
          <p class="font-body text-xs leading-relaxed opacity-80">
            {{ scoreExplanation }}
          </p>
        </div>

        <!-- Compare button -->
        <div>
          <UButton
            variant="outline"
            class="font-body font-400 gap-2"
            :class="inComparison ? 'border-brand text-brand' : ''"
            @click="toggleComparison(listing.id)"
          >
            <UIcon
              :name="
                inComparison ? 'i-heroicons-check' : 'i-heroicons-squares-plus'
              "
              class="w-4 h-4"
            />
            {{ inComparison ? "Added to comparison" : "Add to compare" }}
          </UButton>
        </div>
      </div>

      <!-- Right: Price card + contact -->
      <div class="space-y-4">
        <div
          class="bg-surface rounded-lg border border-surface-3 p-5 shadow-card sticky top-20"
        >
          <!-- Price -->
          <p class="font-display text-3xl text-ink">
            {{ formatPrice(listing.price) }}
          </p>
          <p class="font-body text-xs text-ink-faint mt-0.5">Asking price</p>

          <!-- WhatsApp CTA -->
          <a
            :href="whatsappLink"
            target="_blank"
            rel="noopener"
            class="mt-5 flex items-center justify-center gap-2.5 w-full py-3 rounded-md font-body font-500 text-sm text-white transition-opacity hover:opacity-90"
            style="background-color: #25d366"
          >
            <UIcon
              name="i-heroicons-chat-bubble-left-ellipsis"
              class="w-4 h-4"
            />
            Inquire on WhatsApp
          </a>

          <!-- Save -->
          <button
            class="mt-2 flex items-center justify-center gap-2 w-full py-2.5 rounded-md border border-surface-3 font-body text-sm text-ink-soft hover:border-brand hover:text-brand transition-colors"
            @click="handleSave"
          >
            <UIcon
              :name="saved ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
              class="w-4 h-4"
              :class="saved ? 'text-brand' : ''"
            />
            {{ saved ? "Saved" : "Save this car" }}
          </button>

          <!-- Seller info -->
          <div class="mt-5 pt-5 border-t border-surface-3">
            <p
              class="text-xs font-body text-ink-faint uppercase tracking-wide mb-2"
            >
              Listed by
            </p>
            <p class="font-body text-sm font-500 text-ink">
              {{ listing.profiles?.full_name ?? "BRIM Automotive" }}
            </p>
            <p class="font-body text-xs text-ink-muted mt-0.5">
              Roysambu, Nairobi
            </p>
          </div>

          <!-- Quick specs summary -->
          <div class="mt-4 pt-4 border-t border-surface-3 space-y-2">
            <div
              v-for="s in summarySpecs"
              :key="s.label"
              class="flex justify-between text-xs font-body"
            >
              <span class="text-ink-faint">{{ s.label }}</span>
              <span class="text-ink font-500 capitalize">{{ s.value }}</span>
            </div>
          </div>
        </div>

        <!-- Share -->
        <div class="text-center">
          <button
            class="text-xs font-body text-ink-faint hover:text-brand transition-colors flex items-center gap-1.5 mx-auto"
            @click="copyLink"
          >
            <UIcon name="i-heroicons-link" class="w-3.5 h-3.5" />
            {{ copied ? "Link copied!" : "Copy listing link" }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="error" class="container-brim py-20 text-center">
    <p class="font-display text-2xl text-ink-soft">Car not found</p>
    <NuxtLink
      to="/"
      class="mt-4 inline-block font-body text-sm text-brand hover:underline"
    >
      Back to listings
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { CarListing } from "~/types";

const route = useRoute();
const { formatPrice, formatMileage } = useListings();
const { buildInquiryLink } = useWhatsApp();
const { isSaved, toggleSaved } = useSavedCars();
const { isInComparison, toggleComparison } = useComparison();

const { data: res, error } = await useFetch(`/api/listings/${route.params.id}`);
const listing = computed<CarListing | null>(
  () => (res.value as any)?.data ?? null,
);

// SEO
watch(
  listing,
  (l) => {
    if (!l) return;
    useSeo({
      title: l.title,
      description: `${l.year} ${l.make} ${l.model} for sale in ${l.location}. ${formatPrice(l.price)} — ${formatMileage(l.mileage)}.`,
      type: "article",
    });
  },
  { immediate: true },
);

const images = computed(() => listing.value?.car_images ?? []);
const activeImage = ref("");

watch(
  images,
  (imgs) => {
    const primary = imgs.find((i) => i.is_primary) ?? imgs[0];
    activeImage.value = primary?.url ?? "/placeholder-car.jpg";
  },
  { immediate: true },
);

const whatsappLink = computed(() =>
  listing.value ? buildInquiryLink(listing.value) : "#",
);

const saved = computed(() =>
  listing.value ? isSaved(listing.value.id) : false,
);
const inComparison = computed(() =>
  listing.value ? isInComparison(listing.value.id) : false,
);

const handleSave = () => {
  if (listing.value) toggleSaved(listing.value.id);
};

// Copied link
const copied = ref(false);
const copyLink = async () => {
  await navigator.clipboard.writeText(window.location.href);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
};

// Spec grids
const keySpecs = computed(() => {
  if (!listing.value) return [];
  const l = listing.value;
  return [
    { label: "Year", value: String(l.year) },
    { label: "Mileage", value: formatMileage(l.mileage) },
    { label: "Engine", value: l.engine_size ? `${l.engine_size}L` : "—" },
    { label: "Transmission", value: l.transmission },
    { label: "Fuel", value: l.fuel_type },
    { label: "Drive", value: l.drive_type },
    { label: "Colour", value: l.color ?? "—" },
    { label: "Body", value: l.body_type ?? "—" },
    { label: "Condition", value: l.condition },
  ];
});

const summarySpecs = computed(() => {
  if (!listing.value) return [];
  const l = listing.value;
  return [
    { label: "Year", value: String(l.year) },
    { label: "Fuel", value: l.fuel_type },
    { label: "Drive", value: l.drive_type },
    { label: "Condition", value: l.condition },
  ];
});

// Market score UI
const scoreBoxClass = computed(() => {
  const map: Record<string, string> = {
    good_deal: "border-green-200 bg-green-50 text-green-800",
    fair_price: "border-amber-200 bg-amber-50 text-amber-800",
    overpriced: "border-red-200 bg-red-50 text-red-800",
  };
  return listing.value?.market_score ? map[listing.value.market_score] : "";
});

const scoreIcon = computed(() => {
  const map: Record<string, string> = {
    good_deal: "i-heroicons-arrow-trending-down",
    fair_price: "i-heroicons-check-circle",
    overpriced: "i-heroicons-arrow-trending-up",
  };
  return listing.value?.market_score ? map[listing.value.market_score] : "";
});

const scoreExplanation = computed(() => {
  const map: Record<string, string> = {
    good_deal:
      "This car is priced below the typical market rate for its make, model, and year. It represents strong value for money.",
    fair_price:
      "This car is priced within the expected market range for its make, model, and year. A fair deal for both buyer and seller.",
    overpriced:
      "This car is priced above the typical market rate. You may want to negotiate or compare similar listings.",
  };
  return listing.value?.market_score ? map[listing.value.market_score] : "";
});
</script>
