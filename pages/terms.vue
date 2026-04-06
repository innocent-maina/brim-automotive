<!-- pages/terms.vue -->
<template>
  <div class="container-brim py-12 max-w-2xl">
    <h1 class="font-display text-4xl text-ink mb-2">Terms of Service</h1>
    <p class="font-body text-xs text-ink-faint mb-10">
      Last updated: January 2025
    </p>

    <div class="space-y-8 font-body text-sm text-ink-soft leading-relaxed">
      <section>
        <h2 class="font-display text-xl text-ink mb-3">Acceptance</h2>
        <p>
          By creating an account or using BRIM Automotive, you agree to these
          terms. If you do not agree, do not use the platform.
        </p>
      </section>

      <section>
        <h2 class="font-display text-xl text-ink mb-3">Listing accuracy</h2>
        <p>
          Sellers are responsible for the accuracy of their listings. Providing
          false information — including misrepresenting a vehicle's mileage,
          condition, or ownership — may result in immediate removal of your
          listing and account suspension.
        </p>
      </section>

      <section>
        <h2 class="font-display text-xl text-ink mb-3">Market Score</h2>
        <p>
          The Market Score is provided for informational purposes only, based on
          reference price ranges at the time of listing. BRIM does not guarantee
          that any car will sell at its listed price or within any particular
          timeframe.
        </p>
      </section>

      <section>
        <h2 class="font-display text-xl text-ink mb-3">Transactions</h2>
        <p>
          BRIM Automotive is a listing platform. We do not facilitate or
          guarantee the completion of any sale. Buyers and sellers transact
          directly and are responsible for conducting appropriate due diligence,
          including vehicle inspection and NTSA transfer.
        </p>
      </section>

      <section>
        <h2 class="font-display text-xl text-ink mb-3">Prohibited use</h2>
        <p>
          You may not use BRIM to list stolen vehicles, post fraudulent
          listings, spam other users, or violate any applicable Kenyan law.
        </p>
      </section>

      <section>
        <h2 class="font-display text-xl text-ink mb-3">Modifications</h2>
        <p>
          BRIM reserves the right to modify these terms at any time. Continued
          use of the platform after changes constitutes acceptance of the
          updated terms.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeo({
  title: "Terms of Service",
  description:
    "BRIM Automotive terms of service for buyers and sellers on the platform.",
});
</script>
