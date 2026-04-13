<script setup>
defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  rows: {
    type: Array,
    default: () => [],
  },
  emptyText: {
    type: String,
    default: "No records found.",
  },
  rowKey: {
    type: String,
    default: "id",
  },
});
</script>

<template>
  <div class="overflow-x-auto">
    <table class="min-w-[760px] w-full text-left text-sm">
      <thead class="border-b border-slate-200 text-slate-500">
        <tr>
          <th v-for="column in columns" :key="column.key" class="px-3 py-2 font-semibold whitespace-nowrap sm:px-4">
            {{ column.label }}
          </th>
          <th v-if="$slots.actions" class="px-3 py-2 font-semibold whitespace-nowrap sm:px-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row[rowKey]" class="border-b border-slate-100">
          <td v-for="column in columns" :key="column.key" class="px-3 py-3 whitespace-nowrap sm:px-4">
            <slot :name="`cell-${column.key}`" :row="row">
              {{ row[column.key] }}
            </slot>
          </td>
          <td v-if="$slots.actions" class="px-3 py-3 whitespace-nowrap sm:px-4">
            <slot name="actions" :row="row" />
          </td>
        </tr>
        <tr v-if="rows.length === 0">
          <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="px-3 py-6 text-center text-slate-500 sm:px-4">
            {{ emptyText }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
