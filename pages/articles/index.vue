<!-- pages/articles/index.vue -->
<template>
  <div class="container-brim py-10 max-w-4xl">
    <div class="mb-8">
      <h1 class="font-display text-3xl text-ink">Car Guides</h1>
      <p class="font-body text-sm text-ink-muted mt-2">
        Practical advice for buying and owning a car in Kenya.
      </p>
    </div>

    <div v-if="pending" class="space-y-4">
      <div
        v-for="i in 3"
        :key="i"
        class="bg-surface-2 rounded-lg h-28 img-shimmer"
      />
    </div>

    <div v-else-if="articles.length === 0" class="text-center py-16">
      <p class="font-display text-xl text-ink-soft">No articles yet</p>
    </div>

    <div v-else class="space-y-4">
      <NuxtLink
        v-for="article in articles"
        :key="article.id"
        :to="`/articles/${article.slug}`"
        class="block bg-surface rounded-lg border border-surface-3 p-5 shadow-card card-lift group"
      >
        <div class="flex gap-5">
          <div
            v-if="article.cover_url"
            class="w-24 h-18 rounded overflow-hidden bg-surface-2 shrink-0"
          >
            <img
              :src="article.cover_url"
              :alt="article.title"
              class="w-full h-full object-cover"
            />
          </div>
          <div>
            <p class="text-xs font-body text-ink-faint mb-2">
              {{ formatDate(article.created_at) }}
            </p>
            <h2
              class="font-display text-lg text-ink group-hover:text-brand transition-colors leading-tight"
            >
              {{ article.title }}
            </h2>
            <p
              v-if="article.excerpt"
              class="font-body text-sm text-ink-muted mt-2 line-clamp-2"
            >
              {{ article.excerpt }}
            </p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Article } from "~/types";

useSeo({
  title: "Car Guides",
  description:
    "Practical car buying and ownership guides for Kenya. Tips on inspection, NTSA transfers, insurance and more.",
});

const { data: res, pending } = await useFetch("/api/articles");
const articles = computed<Article[]>(() => (res.value as any)?.data ?? []);

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
</script>
