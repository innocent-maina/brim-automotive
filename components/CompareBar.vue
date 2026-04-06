<!-- components/CompareBar.vue -->
<template>
  <Transition name="bar">
    <div
      v-if="count > 0"
      class="fixed bottom-0 inset-x-0 z-40 bg-surface-inv text-white border-t border-white/10"
    >
      <div class="container-brim py-3 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <span class="text-sm font-body text-white/70">
            {{ count }} car{{ count > 1 ? "s" : "" }} selected
          </span>
          <span class="text-white/20">—</span>
          <span class="text-xs font-body text-white/40"
            >{{ MAX_COMPARE - count }} slot{{
              MAX_COMPARE - count !== 1 ? "s" : ""
            }}
            left</span
          >
        </div>
        <div class="flex items-center gap-2">
          <UButton
            variant="ghost"
            size="xs"
            class="text-white/50 hover:text-white font-body"
            @click="clearComparison"
          >
            Clear
          </UButton>
          <UButton
            to="/compare"
            size="sm"
            :disabled="count < 2"
            class="font-body font-400"
            style="background-color: var(--color-brand); color: white"
          >
            Compare Now
          </UButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { count, clearComparison, MAX_COMPARE } = useComparison();
</script>

<style scoped>
.bar-enter-active,
.bar-leave-active {
  transition: transform 0.2s ease;
}
.bar-enter-from,
.bar-leave-to {
  transform: translateY(100%);
}
</style>
