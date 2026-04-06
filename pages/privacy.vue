<!-- pages/privacy.vue -->
<template>
  <div class="container-brim py-12 max-w-2xl">
    <h1 class="font-display text-4xl text-ink mb-2">Privacy Policy</h1>
    <p class="font-body text-xs text-ink-faint mb-10">
      Last updated: January 2025
    </p>

    <div class="space-y-8 font-body text-sm text-ink-soft leading-relaxed">
      <section>
        <h2 class="font-display text-xl text-ink mb-3">
          Information we collect
        </h2>
        <p>
          We collect information you provide when creating an account (name,
          email, phone) and when submitting car listings. We also collect basic
          usage data to improve the platform.
        </p>
      </section>

      <section>
        <h2 class="font-display text-xl text-ink mb-3">
          How we use your information
        </h2>
        <p>
          Your information is used to operate the BRIM Automotive platform —
          publishing listings, facilitating buyer-seller communication, and
          sending account-related emails. We do not sell your data to third
          parties.
        </p>
      </section>

      <section>
        <h2 class="font-display text-xl text-ink mb-3">Data storage</h2>
        <p>
          Your data is stored securely on Supabase infrastructure with row-level
          security. Passwords are encrypted. We do not store payment
          information.
        </p>
      </section>

      <section>
        <h2 class="font-display text-xl text-ink mb-3">WhatsApp inquiries</h2>
        <p>
          When you click "Inquire on WhatsApp", you are redirected to WhatsApp's
          platform. BRIM records a log of the inquiry details you submit through
          our contact form, but WhatsApp conversations happen outside our
          platform.
        </p>
      </section>

      <section>
        <h2 class="font-display text-xl text-ink mb-3">Your rights</h2>
        <p>
          You may request deletion of your account and associated data at any
          time by contacting us on WhatsApp. Listings you have submitted will be
          removed within 7 business days.
        </p>
      </section>

      <section>
        <h2 class="font-display text-xl text-ink mb-3">Contact</h2>
        <p>
          For privacy concerns, reach us via WhatsApp at
          <a
            :href="`https://wa.me/${whatsapp}`"
            class="text-brand hover:underline"
            target="_blank"
            rel="noopener"
            >+{{ whatsapp }}</a
          >.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeo({
  title: "Privacy Policy",
  description:
    "BRIM Automotive privacy policy — how we collect, store and use your information.",
});
const config = useRuntimeConfig();
const whatsapp = config.public.whatsappNumber;
</script>
