<!-- pages/list-your-car.vue -->
<template>
  <div class="container-brim py-10 max-w-2xl">
    <div class="mb-8">
      <h1 class="font-display text-3xl text-ink">List Your Car</h1>
      <p class="font-body text-sm text-ink-muted mt-2">
        Fill in the details below. BRIM will review your listing and publish it
        within 24 hours. We'll also show you your Market Score — so you know if
        your price is competitive.
      </p>
    </div>

    <!-- Auth gate -->
    <div
      v-if="!isAuthenticated"
      class="bg-surface-2 rounded-lg border border-surface-3 p-8 text-center"
    >
      <UIcon
        name="i-heroicons-lock-closed"
        class="w-8 h-8 text-ink-faint mx-auto mb-3"
      />
      <p class="font-body font-500 text-ink">Sign in to list your car</p>
      <p class="font-body text-sm text-ink-muted mt-1">
        Create a free account to submit your listing.
      </p>
      <div class="flex gap-3 justify-center mt-5">
        <UButton to="/auth/login" variant="outline" class="font-body"
          >Sign In</UButton
        >
        <UButton
          to="/auth/register"
          class="font-body font-400"
          style="background-color: var(--color-brand); color: white"
        >
          Create Account
        </UButton>
      </div>
    </div>

    <!-- Form -->
    <form v-else class="space-y-8" @submit.prevent="submit">
      <!-- Images -->
      <section class="space-y-3">
        <h2 class="font-display text-lg text-ink">Photos</h2>
        <ImageUploader v-model="form.images" :max-images="6" />
      </section>

      <!-- Basic info -->
      <section class="space-y-4">
        <h2 class="font-display text-lg text-ink">Car Details</h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              class="block text-xs font-body font-500 text-ink-muted mb-1.5"
              >Make *</label
            >
            <USelect
              v-model="form.make"
              :items="makeOptions"
              placeholder="Select make"
              class="font-body"
              required
            />
          </div>
          <div>
            <label
              class="block text-xs font-body font-500 text-ink-muted mb-1.5"
              >Model *</label
            >
            <UInput
              v-model="form.model"
              placeholder="e.g. Fielder, Axio, Premio"
              class="font-body"
              required
            />
          </div>
          <div>
            <label
              class="block text-xs font-body font-500 text-ink-muted mb-1.5"
              >Year *</label
            >
            <USelect
              v-model="form.year"
              :items="yearOptions"
              placeholder="Year"
              class="font-body"
              required
            />
          </div>
          <div>
            <label
              class="block text-xs font-body font-500 text-ink-muted mb-1.5"
              >Colour</label
            >
            <UInput
              v-model="form.color"
              placeholder="e.g. Pearl White"
              class="font-body"
            />
          </div>
          <div>
            <label
              class="block text-xs font-body font-500 text-ink-muted mb-1.5"
              >Body Type</label
            >
            <USelect
              v-model="form.body_type"
              :items="bodyTypeOptions"
              placeholder="Select type"
              class="font-body"
            />
          </div>
          <div>
            <label
              class="block text-xs font-body font-500 text-ink-muted mb-1.5"
              >Condition *</label
            >
            <USelect
              v-model="form.condition"
              :items="conditionOptions"
              class="font-body"
              required
            />
          </div>
        </div>
      </section>

      <!-- Performance -->
      <section class="space-y-4">
        <h2 class="font-display text-lg text-ink">Engine & Transmission</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              class="block text-xs font-body font-500 text-ink-muted mb-1.5"
              >Engine Size (L)</label
            >
            <UInput
              v-model="form.engine_size"
              type="number"
              step="0.1"
              placeholder="e.g. 1.5"
              class="font-body"
            />
          </div>
          <div>
            <label
              class="block text-xs font-body font-500 text-ink-muted mb-1.5"
              >Transmission *</label
            >
            <div class="flex gap-2">
              <button
                v-for="t in transmissionOptions"
                :key="t.value"
                type="button"
                class="flex-1 py-2 text-sm font-body rounded-md border transition-colors"
                :class="
                  form.transmission === t.value
                    ? 'border-brand bg-brand-subtle text-brand font-500'
                    : 'border-surface-3 text-ink-soft hover:border-ink-faint'
                "
                @click="form.transmission = t.value"
              >
                {{ t.label }}
              </button>
            </div>
          </div>
          <div>
            <label
              class="block text-xs font-body font-500 text-ink-muted mb-1.5"
              >Fuel Type *</label
            >
            <USelect
              v-model="form.fuel_type"
              :items="fuelOptions"
              class="font-body"
              required
            />
          </div>
          <div>
            <label
              class="block text-xs font-body font-500 text-ink-muted mb-1.5"
              >Drive Type</label
            >
            <USelect
              v-model="form.drive_type"
              :items="driveOptions"
              class="font-body"
            />
          </div>
          <div>
            <label
              class="block text-xs font-body font-500 text-ink-muted mb-1.5"
              >Mileage (km) *</label
            >
            <UInput
              v-model="form.mileage"
              type="number"
              placeholder="e.g. 65000"
              class="font-body"
              required
            />
          </div>
        </div>
      </section>

      <!-- Pricing -->
      <section class="space-y-4">
        <h2 class="font-display text-lg text-ink">Pricing</h2>
        <div>
          <label class="block text-xs font-body font-500 text-ink-muted mb-1.5"
            >Asking Price (KES) *</label
          >
          <UInput
            v-model="form.price"
            type="number"
            placeholder="e.g. 1200000"
            class="font-body"
            required
          />
        </div>

        <!-- Live market score preview -->
        <div
          v-if="scorePreview"
          class="p-3 rounded-md border"
          :class="scorePreviewClass"
        >
          <p class="text-xs font-body font-500">Market Score Preview</p>
          <p class="text-xs font-body mt-0.5 opacity-80">
            {{ scorePreviewText }}
          </p>
        </div>
      </section>

      <!-- Description -->
      <section class="space-y-3">
        <h2 class="font-display text-lg text-ink">Description</h2>
        <div>
          <label class="block text-xs font-body font-500 text-ink-muted mb-1.5"
            >Tell buyers about this car</label
          >
          <textarea
            v-model="form.description"
            rows="5"
            placeholder="Service history, modifications, why you're selling..."
            class="w-full px-3 py-2.5 text-sm font-body bg-surface border border-surface-3 rounded-md focus:outline-none focus:border-brand text-ink placeholder:text-ink-faint resize-none transition-colors"
          />
        </div>
        <div>
          <label class="block text-xs font-body font-500 text-ink-muted mb-1.5"
            >Location</label
          >
          <UInput
            v-model="form.location"
            placeholder="e.g. Nairobi, Westlands"
            class="font-body"
          />
        </div>
      </section>

      <!-- Listing title -->
      <section>
        <label class="block text-xs font-body font-500 text-ink-muted mb-1.5"
          >Listing Title *</label
        >
        <UInput
          v-model="form.title"
          placeholder="e.g. 2016 Toyota Fielder X — Low Mileage"
          class="font-body"
          required
        />
        <p class="text-xs font-body text-ink-faint mt-1">
          Make it descriptive — buyers search by title.
        </p>
      </section>

      <!-- Error -->
      <UAlert
        v-if="submitError"
        color="error"
        variant="soft"
        :title="submitError"
        icon="i-heroicons-exclamation-triangle"
      />

      <!-- Submit -->
      <UButton
        type="submit"
        block
        :loading="submitting"
        class="font-body font-400 py-3"
        style="background-color: var(--color-brand); color: white"
      >
        Submit Listing for Review
      </UButton>

      <p class="text-xs font-body text-ink-faint text-center">
        BRIM reviews all listings before publishing. Usually within 24 hours.
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
useSeo({
  title: "List Your Car",
  description:
    "Sell your car on BRIM Automotive. Get a Market Score to see if your price is competitive. Free to list.",
});

const { isAuthenticated } = useAuth();
const router = useRouter();

const submitting = ref(false);
const submitError = ref("");
const scorePreview = ref<string | null>(null);

// make, body_type, year use undefined so USelect placeholder shows correctly
const form = reactive({
  title: "",
  make: undefined as string | undefined,
  model: "",
  year: undefined as string | undefined,
  price: "",
  mileage: "",
  engine_size: "",
  transmission: "automatic" as "automatic" | "manual",
  fuel_type: "petrol",
  drive_type: "2WD",
  color: "",
  body_type: undefined as string | undefined,
  condition: "foreign used",
  description: "",
  location: "Nairobi",
  images: [] as { url: string; is_primary: boolean }[],
});

// Compute market score preview from hardcoded reference ranges
const marketPriceRanges: Record<string, { min: number; max: number }> = {
  Toyota_Fielder: { min: 1050000, max: 1350000 },
  Toyota_Axio: { min: 850000, max: 1150000 },
  Toyota_Premio: { min: 900000, max: 1200000 },
  Toyota_Harrier: { min: 2800000, max: 3800000 },
  "Toyota_Land Cruiser Prado": { min: 4500000, max: 6500000 },
  Mazda_Demio: { min: 650000, max: 950000 },
  Subaru_Forester: { min: 1500000, max: 2000000 },
  Honda_Fit: { min: 700000, max: 950000 },
  Nissan_Note: { min: 700000, max: 950000 },
  "Mercedes-Benz_C200": { min: 3500000, max: 5000000 },
};

watch([() => form.make, () => form.model, () => form.price], () => {
  const key = `${form.make}_${form.model}`;
  const price = parseInt(form.price);
  const ref = marketPriceRanges[key];
  if (!ref || !price) {
    scorePreview.value = null;
    return;
  }
  if (price < ref.min) scorePreview.value = "good_deal";
  else if (price > ref.max) scorePreview.value = "overpriced";
  else scorePreview.value = "fair_price";
});

const scorePreviewClass = computed(() => {
  const map: Record<string, string> = {
    good_deal: "border-green-200 bg-green-50 text-green-800",
    fair_price: "border-amber-200 bg-amber-50 text-amber-800",
    overpriced: "border-red-200 bg-red-50 text-red-800",
  };
  return scorePreview.value ? map[scorePreview.value] : "";
});

const scorePreviewText = computed(() => {
  const map: Record<string, string> = {
    good_deal: "Your price looks like a good deal compared to market rates.",
    fair_price:
      "Your price is within the expected market range. Good positioning.",
    overpriced:
      "Your price is above the typical market rate. Consider adjusting to attract more buyers.",
  };
  return scorePreview.value ? map[scorePreview.value] : "";
});

const submit = async () => {
  submitting.value = true;
  submitError.value = "";
  try {
    const res = await $fetch<any>("/api/listings", {
      method: "POST",
      body: {
        ...form,
        year: parseInt(form.year),
        price: parseInt(form.price),
        mileage: parseInt(form.mileage),
        engine_size: form.engine_size ? parseFloat(form.engine_size) : null,
      },
    });

    const listingId = res.data?.id;
    if (!listingId) throw new Error("Unexpected response");

    // Upload image URLs to the images table
    for (const img of form.images) {
      await $fetch(`/api/listings/${listingId}/images`, {
        method: "POST",
        body: { url: img.url, is_primary: img.is_primary },
      });
    }

    await router.push("/dashboard/listings?submitted=1");
  } catch (e: any) {
    submitError.value =
      e?.data?.message ?? "Failed to submit listing. Please try again.";
  } finally {
    submitting.value = false;
  }
};

// Options — Nuxt UI v3: empty string values not allowed in USelect items
const currentYear = new Date().getFullYear();
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
  "Other",
].map((m) => ({ label: m, value: m }));
const yearOptions = Array.from({ length: currentYear - 2004 }, (_, i) => {
  const y = currentYear - i;
  return { label: String(y), value: String(y) };
});
const bodyTypeOptions = [
  "Sedan",
  "Station Wagon",
  "SUV",
  "Hatchback",
  "Pickup",
  "Coupe",
  "Van",
  "Minivan",
].map((b) => ({ label: b, value: b }));
const conditionOptions = [
  { label: "Foreign Used", value: "foreign used" },
  { label: "Locally Used", value: "locally used" },
  { label: "Brand New", value: "new" },
];
const transmissionOptions = [
  { label: "Automatic", value: "automatic" },
  { label: "Manual", value: "manual" },
];
const fuelOptions = [
  { label: "Petrol", value: "petrol" },
  { label: "Diesel", value: "diesel" },
  { label: "Hybrid", value: "hybrid" },
  { label: "Electric", value: "electric" },
];
const driveOptions = [
  { label: "2WD", value: "2WD" },
  { label: "4WD", value: "4WD" },
  { label: "AWD", value: "AWD" },
];
</script>
