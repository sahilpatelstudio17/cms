<script setup>
defineProps({
  rows: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <section id="reports" class="rounded-xl border border-slate-200 bg-white shadow-sm">
    <div class="border-b border-slate-200 px-4 py-4 sm:px-6">
      <h2 class="text-base font-semibold text-slate-900 sm:text-lg">Latest Orders</h2>
      <p class="text-xs text-slate-500 sm:text-sm">Horizontal scroll is enabled on small screens.</p>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-[720px] w-full text-left text-sm">
        <thead class="bg-slate-50 text-slate-700">
          <tr>
            <th class="px-4 py-3 font-semibold sm:px-6">Order</th>
            <th class="px-4 py-3 font-semibold sm:px-6">Customer</th>
            <th class="px-4 py-3 font-semibold sm:px-6">Region</th>
            <th class="px-4 py-3 font-semibold sm:px-6">Amount</th>
            <th class="px-4 py-3 font-semibold sm:px-6">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id" class="border-t border-slate-100 hover:bg-slate-50 transition">
            <td class="px-4 py-3 font-medium text-slate-900 sm:px-6">#{{ row.id }}</td>
            <td class="px-4 py-3 text-slate-700 sm:px-6">{{ row.customer }}</td>
            <td class="px-4 py-3 text-slate-600 sm:px-6">{{ row.region }}</td>
            <td class="px-4 py-3 text-slate-900 sm:px-6">${{ row.amount }}</td>
            <td class="px-4 py-3 sm:px-6">
              <span
                :class="[
                  'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
                  row.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700',
                ]"
              >
                {{ row.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
