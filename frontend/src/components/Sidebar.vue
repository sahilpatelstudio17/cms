<script setup>
import { RouterLink, useRoute } from "vue-router";
import { computed } from "vue";

import { useAuthStore } from "../stores/auth";

const route = useRoute();
const auth = useAuthStore();
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["close"]);

const navItems = [
  { label: "Dashboard", to: "/dashboard", roles: ["admin", "employee", "developer", "staff", "salesman", "manager"] },
  { label: "Admin Dashboard", to: "/super-admin", roles: ["super_admin"] },
  // { label: "Employees", to: "/employees", roles: ["developer", "staff", "salesman", "manager", "employee"] },
  { label: "Employees", to: "/employees", roles: ["manager"] },
  { label: "Team Management", to: "/team", roles: ["admin"] },
  { label: "Tasks", to: "/tasks", roles: ["admin", "employee", "developer", "staff", "salesman", "manager"] },
  { label: "Expenses", to: "/expenses", roles: ["admin", "employee", "developer", "staff", "salesman", "manager"] },
  { label: "Sales", to: "/sales", roles: ["admin", "employee", "developer", "staff", "salesman", "manager"] },
  { label: "Approvals", to: "/approvals", roles: ["super_admin","admin"] },
  { label: "Settings", to: "/settings", roles: ["admin"] },
  { label: "Users", to: "/users", roles: ["admin"] },
  { label: "My Profile", to: "/profile", roles: ["admin", "employee", "super_admin", "developer", "staff", "salesman", "manager"] },
];

const visibleNavItems = computed(() => navItems.filter((item) => auth.hasRole(item.roles)));
</script>

<template>
  <div>
    <div
      v-if="open"
      class="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
      @click="emit('close')"
    ></div>

    <aside
      class="fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white shadow-xl transition-transform duration-300 lg:translate-x-0"
      :class="open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <div class="border-b border-slate-800/80 px-5 py-5">
        <div class="flex items-start justify-between gap-2">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">SaaS Platform</p>
            <h1 class="mt-2 text-xl font-semibold tracking-tight">Company Console</h1>
          </div>
          <button
            type="button"
            class="rounded-md p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white lg:hidden"
            @click="emit('close')"
            aria-label="Close sidebar"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <nav class="flex-1 space-y-1.5 overflow-y-auto px-3 py-5">
        <RouterLink
          v-for="item in visibleNavItems"
          :key="item.to"
          :to="item.to"
          class="group flex items-center rounded-xl px-3.5 py-2.5 text-sm font-medium transition"
          :class="route.path === item.to ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-200 hover:bg-slate-800/80 hover:text-white'"
          @click="emit('close')"
        >
          <span
            class="mr-3 inline-block h-1.5 w-1.5 rounded-full"
            :class="route.path === item.to ? 'bg-slate-900' : 'bg-slate-500 group-hover:bg-slate-300'"
          ></span>
          {{ item.label }}
        </RouterLink>
      </nav>
    </aside>
  </div>
</template>
