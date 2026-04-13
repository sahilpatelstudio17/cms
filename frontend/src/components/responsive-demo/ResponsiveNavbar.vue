<script setup>
const emit = defineEmits(["toggle-sidebar"]);

const links = [
  { label: "Overview", href: "#overview" },
  { label: "Reports", href: "#reports" },
  { label: "Settings", href: "#settings" },
];
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="mx-auto flex h-16 w-full items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-700 transition hover:bg-slate-100 lg:hidden"
          @click="emit('toggle-sidebar')"
          aria-label="Toggle sidebar"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <p class="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">Adaptive Admin</p>
          <p class="text-xs text-slate-500">Responsive demo interface</p>
        </div>
      </div>

      <nav class="hidden items-center gap-6 lg:flex">
        <a
          v-for="link in links"
          :key="link.label"
          :href="link.href"
          class="text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          {{ link.label }}
        </a>
      </nav>

      <div class="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          class="hidden rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
        >
          Export
        </button>
        <img
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=96&q=80"
          alt="User avatar"
          class="h-9 w-9 rounded-full object-cover"
        />
      </div>
    </div>
  </header>
</template>
