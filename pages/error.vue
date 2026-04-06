<!-- error.vue -->
<template>
  <div class="min-h-screen bg-surface flex items-center justify-center px-4">
    <div class="text-center max-w-sm">
      <p class="font-display text-8xl text-surface-3 leading-none mb-4">
        {{ error?.statusCode }}
      </p>
      <h1 class="font-display text-2xl text-ink mb-2">
        {{
          error?.statusCode === 404 ? "Page not found" : "Something went wrong"
        }}
      </h1>
      <p class="font-body text-sm text-ink-muted mb-8">
        {{
          error?.statusCode === 404
            ? "The page you're looking for doesn't exist or has been moved."
            : "An unexpected error occurred. Please try again."
        }}
      </p>
      <div class="flex gap-3 justify-center">
        <UButton
          to="/"
          class="font-body font-400"
          style="background-color: var(--color-brand); color: white"
        >
          Back to Cars
        </UButton>
        <UButton variant="ghost" class="font-body" @click="handleError">
          Try again
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ error: any }>();
const handleError = () => clearError({ redirect: "/" });
</script>
