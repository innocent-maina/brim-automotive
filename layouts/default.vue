<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen flex flex-col bg-surface">
    <AppNavbar />
    <main class="flex-1 pt-nav">
      <slot />
    </main>
    <AppFooter />
    <CompareBar />
  </div>
</template>
