<!-- pages/articles/[slug].vue -->
<template>
  <div v-if="article" class="container-brim py-10 max-w-2xl">
    <NuxtLink
      to="/articles"
      class="flex items-center gap-1.5 text-xs font-body text-ink-faint hover:text-brand mb-8 transition-colors"
    >
      <UIcon name="i-heroicons-arrow-left" class="w-3.5 h-3.5" />
      Back to Guides
    </NuxtLink>

    <div
      v-if="article.cover_url"
      class="rounded-lg overflow-hidden mb-8 aspect-video bg-surface-2"
    >
      <img
        :src="article.cover_url"
        :alt="article.title"
        class="w-full h-full object-cover"
      />
    </div>

    <p class="text-xs font-body text-ink-faint mb-3">
      {{ formatDate(article.created_at) }}
    </p>

    <h1 class="font-display text-3xl sm:text-4xl text-ink leading-tight mb-4">
      {{ article.title }}
    </h1>

    <p
      v-if="article.excerpt"
      class="font-body text-base text-ink-muted leading-relaxed mb-8 border-l-2 pl-4"
      style="border-color: var(--color-brand)"
    >
      {{ article.excerpt }}
    </p>

    <div
      class="font-body text-sm text-ink-soft leading-relaxed whitespace-pre-line prose-brim"
    >
      {{ article.content }}
    </div>

    <div class="mt-12 pt-8 border-t border-surface-3">
      <p class="font-body text-sm text-ink-muted mb-4">Looking for a car?</p>
      <UButton
        to="/"
        class="font-body font-400"
        style="background-color: var(--color-brand); color: white"
      >
        Browse BRIM Listings
      </UButton>
    </div>
  </div>

  <div v-else class="container-brim py-20 text-center">
    <p class="font-display text-2xl text-ink-soft">Article not found</p>
    <NuxtLink
      to="/articles"
      class="mt-4 inline-block font-body text-sm text-brand hover:underline"
    >
      Back to guides
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { Article } from "~/types";

const route = useRoute();
const { data: res } = await useFetch(`/api/articles/${route.params.slug}`);
const article = computed<Article | null>(
  () => (res.value as any)?.data ?? null,
);

watch(
  article,
  (a) => {
    if (!a) return;
    useSeo({
      title: a.title,
      description: a.excerpt ?? `Read ${a.title} on BRIM Automotive.`,
      type: "article",
    });
  },
  { immediate: true },
);

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
</script>
