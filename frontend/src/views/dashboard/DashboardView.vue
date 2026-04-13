<script setup>
import { onMounted, ref } from "vue";

import { useAppDataStore } from "../../stores/appData";

const company = ref(null);
const loading = ref(true);
const appDataStore = useAppDataStore();

const statsCards = ref([
  {
    title: "Total Employees",
    value: 0,
    note: "",
    accent: "from-emerald-500 to-emerald-600",
  },
  {
    title: "Open Tasks",
    value: 0,
    note: "",
    accent: "from-amber-500 to-amber-600",
  },
]);

onMounted(async () => {
  try {
    const [cachedCompany, dashboardStats] = await Promise.all([
      appDataStore.fetchCompany(),
      appDataStore.fetchDashboardStats(),
    ]);

    company.value = cachedCompany;

    // Update stats cards with real data
    statsCards.value[0].value = dashboardStats?.total_employees ?? 0;
    statsCards.value[1].value = dashboardStats?.open_tasks ?? 0;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section class="space-y-6">
    <header>
      <h2 class="text-2xl font-semibold">Dashboard</h2>
      <p class="mt-1 text-sm text-slate-500">Track team performance and daily operations at a glance.</p>
    </header>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
      <article
        v-for="card in statsCards"
        :key="card.title"
        class="overflow-hidden rounded-xl bg-white ring-1 ring-slate-200"
      >
        <div class="h-1.5 bg-gradient-to-r" :class="card.accent" />
        <div class="p-5">
          <p class="text-sm font-medium text-slate-500">{{ card.title }}</p>
          <p class="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{{ card.value }}</p>
          <p class="mt-1 text-sm text-slate-500">{{ card.note }}</p>
        </div>
      </article>
    </div>

    <div class="grid gap-6">
      <section class="card">
        <p class="text-sm uppercase tracking-wide text-slate-500">Company Profile</p>
        <p v-if="loading" class="mt-3 text-slate-500">Loading company profile...</p>
        <template v-else>
          <p class="mt-3 text-lg font-semibold">{{ company?.name || "Not available" }}</p>
          <p class="mt-1 text-slate-600">{{ company?.email || "Not available" }}</p>
        </template>
      </section>
    </div>
  </section>
</template>
