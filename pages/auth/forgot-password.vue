<!-- pages/auth/forgot-password.vue -->
<template>
  <div class="w-full max-w-sm">
    <div class="bg-surface rounded-xl border border-surface-3 shadow-card p-8">
      <NuxtLink
        to="/auth/login"
        class="flex items-center gap-1.5 text-xs font-body text-ink-faint hover:text-brand mb-6 transition-colors"
      >
        <UIcon name="i-heroicons-arrow-left" class="w-3.5 h-3.5" />
        Back to Sign In
      </NuxtLink>

      <h1 class="font-display text-2xl text-ink mb-1">Reset Password</h1>
      <p class="font-body text-sm text-ink-muted mb-6">
        Enter your email and we'll send you a reset link.
      </p>

      <div v-if="!sent">
        <form class="space-y-4" @submit.prevent="handleReset">
          <div>
            <label
              class="block text-xs font-body font-500 text-ink-muted mb-1.5"
              >Email</label
            >
            <UInput
              v-model="email"
              type="email"
              placeholder="your@email.com"
              class="font-body"
              required
            />
          </div>
          <UAlert v-if="error" color="error" variant="soft" :title="error" />
          <UButton
            type="submit"
            block
            :loading="loading"
            class="font-body font-400"
            style="background-color: var(--color-brand); color: white"
          >
            Send Reset Link
          </UButton>
        </form>
      </div>

      <div v-else class="text-center py-4">
        <UIcon
          name="i-heroicons-envelope"
          class="w-8 h-8 text-brand mx-auto mb-3"
        />
        <p class="font-body text-sm text-ink">
          Check your inbox for a reset link.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "auth" });
useSeo({ title: "Reset Password", noIndex: true });

const { resetPassword } = useAuth();
const email = ref("");
const loading = ref(false);
const error = ref("");
const sent = ref(false);

const handleReset = async () => {
  loading.value = true;
  error.value = "";
  try {
    await resetPassword(email.value);
    sent.value = true;
  } catch (e: any) {
    error.value = e?.message ?? "Failed to send reset email.";
  } finally {
    loading.value = false;
  }
};
</script>
