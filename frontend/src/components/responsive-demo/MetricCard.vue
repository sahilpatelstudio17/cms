<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  change: {
    type: String,
    required: true,
  },
  positive: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
    <p class="text-xs font-medium uppercase tracking-wide text-slate-500">{{ title }}</p>
    <p class="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{{ value }}</p>
    <p :class="['mt-2 text-sm font-medium', positive ? 'text-emerald-600' : 'text-rose-600']">{{ change }}</p>
  </article>
</template>
