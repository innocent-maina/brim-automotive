<!-- layouts/auth.vue -->
<template>
  <div class="min-h-screen bg-surface-2 flex flex-col">
    <header
      class="h-16 flex items-center px-6 border-b border-surface-3 bg-surface"
    >
      <NuxtLink to="/" class="flex items-center gap-2">
        <BrimLogo />
      </NuxtLink>
    </header>
    <main class="flex-1 flex items-center justify-center py-12 px-4">
      <slot />
    </main>
    <footer class="py-6 text-center">
      <p class="text-sm text-ink-faint font-body">
        &copy; {{ new Date().getFullYear() }} BRIM Automotive. All rights
        reserved.
      </p>
    </footer>
  </div>
</template>
