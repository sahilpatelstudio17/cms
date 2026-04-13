<script setup>
defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

const navItems = [
  { label: "Dashboard", icon: "M3 12h18M3 6h18M3 18h18" },
  { label: "Analytics", icon: "M5 12h3v7H5zm5-5h3v12h-3zm5 3h3v9h-3z" },
  { label: "Customers", icon: "M17 20h5V4H2v16h5" },
  { label: "Team", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" },
  { label: "Support", icon: "M18.364 5.636l-1.414 1.414M12 2v2m0 16v2m8-10h2M2 12H4" },
];
</script>

<template>
  <div>
    <div
      v-if="open"
      class="fixed inset-0 z-20 bg-slate-900/40 lg:hidden"
      @click="emit('close')"
    ></div>

    <aside
      class="fixed inset-y-0 left-0 z-30 w-72 border-r border-slate-200 bg-white transition-transform duration-300 lg:static lg:z-0 lg:translate-x-0"
      :class="open ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex h-16 items-center justify-between border-b border-slate-200 px-4 sm:px-5 lg:hidden">
        <p class="text-sm font-semibold text-slate-900">Navigation</p>
        <button
          type="button"
          class="rounded-md p-2 text-slate-600 hover:bg-slate-100"
          @click="emit('close')"
          aria-label="Close sidebar"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav class="space-y-1 p-3 sm:p-4">
        <a
          v-for="(item, index) in navItems"
          :key="item.label"
          href="#"
          :class="[
            'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
            index === 0 ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
          ]"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
          </svg>
          <span>{{ item.label }}</span>
        </a>
      </nav>
    </aside>
  </div>
</template>
