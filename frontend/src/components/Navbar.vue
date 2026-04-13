<script setup>
import { useRouter } from "vue-router";
import { computed } from "vue";

import Button from "./ui/Button.vue";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();
const emit = defineEmits(["toggle-sidebar"]);

const roleBadgeColor = computed(() => {
  switch (auth.userRole) {
    case "super_admin":
      return "bg-purple-100 text-purple-700";
    case "admin":
      return "bg-blue-100 text-blue-700";
    case "employee":
      return "bg-green-100 text-green-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
});

const roleLabel = computed(() => {
  switch (auth.userRole) {
    case "super_admin":
      return "Super Admin";
    case "admin":
      return "Admin";
    case "employee":
      return "Employee";
    default:
      return auth.userRole;
  }
});

function logout() {
  auth.logout();
  router.push("/");
}
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
      <div class="flex min-w-0 items-center gap-3">
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

        <div class="min-w-0">
        <p class="text-sm text-slate-500">Welcome back</p>
        <div class="flex min-w-0 items-center gap-2">
          <p class="truncate text-base font-semibold">
            {{ auth.loading ? "Loading..." : (auth.userName || "User") }}
          </p>
          <span 
            v-if="!auth.loading"
            :class="[roleBadgeColor, 'rounded-full px-2 py-0.5 text-xs font-semibold uppercase whitespace-nowrap']"
          >
            {{ roleLabel }}
          </span>
        </div>
      </div>
      </div>
      <Button 
        v-if="auth.isAuthenticated"
        variant="secondary" 
        size="sm"
        class="shrink-0"
        @click="logout"
      >
        Logout
      </Button>
    </div>
  </header>
</template>
