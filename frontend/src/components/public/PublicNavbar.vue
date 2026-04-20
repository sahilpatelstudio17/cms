<template>
  <header class="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur">
    <div class="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-3 sm:h-16 sm:px-6 lg:px-8">
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-700 md:hidden"
          @click="isMenuOpen = !isMenuOpen"
          aria-label="Toggle menu"
        >
          <svg v-if="!isMenuOpen" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <router-link to="/" class="mr-1 inline-flex items-baseline rounded-md px-1 py-1 text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
          <span>CMS</span>
        </router-link>
      </div>

      <nav class="hidden items-center gap-3 lg:gap-4 md:flex">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="whitespace-nowrap text-sm font-semibold text-slate-700 transition hover:text-slate-900"
          :class="route.path === link.to ? 'text-slate-900' : ''"
        >
          {{ link.label }}
        </router-link>
      </nav>

      <div class="hidden items-center gap-3 md:flex">
        <router-link
          v-if="!isAuthenticated"
          to="/login"
          class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Login
        </router-link>
        <template v-else>
          <router-link to="/dashboard" class="text-sm font-semibold text-slate-700 transition hover:text-slate-900">
            Dashboard
          </router-link>
          <button
            type="button"
            class="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
            @click="handleLogout"
          >
            Logout
          </button>
        </template>
      </div>

      <div class="md:hidden">
        <router-link
          v-if="!isAuthenticated"
          to="/login"
          class="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white"
        >
          Login
        </router-link>
        <button
          v-else
          type="button"
          class="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white"
          @click="handleLogout"
        >
          Logout
        </button>
      </div>
    </div>

    <div v-if="isMenuOpen" class="border-t border-slate-200 bg-white px-3 pb-4 pt-2.5 md:hidden">
      <nav class="space-y-1">
        <router-link
          v-for="link in navLinks"
          :key="`mobile-${link.to}`"
          :to="link.to"
          class="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700"
          :class="route.path === link.to ? 'bg-slate-100 text-slate-900' : 'hover:bg-slate-50'"
          @click="isMenuOpen = false"
        >
          {{ link.label }}
        </router-link>
      </nav>

      <div class="mt-3 border-t border-slate-200 pt-3">
        <router-link
          v-if="!isAuthenticated"
          to="/login"
          class="block rounded-lg bg-slate-900 px-3 py-2 text-center text-sm font-semibold text-white"
          @click="isMenuOpen = false"
        >
          Login
        </router-link>
        <template v-else>
          <router-link
            to="/dashboard"
            class="mb-2 block rounded-lg bg-slate-100 px-3 py-2 text-center text-sm font-semibold text-slate-800"
            @click="isMenuOpen = false"
          >
            Dashboard
          </router-link>
          <button
            type="button"
            class="block w-full rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white"
            @click="handleMobileLogout"
          >
            Logout
          </button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useAuthStore } from "../../stores/auth";
import { navLinks } from "../../data/publicContent";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const isMenuOpen = ref(false);
const isAuthenticated = computed(() => authStore.isAuthenticated);

watch(
  () => route.fullPath,
  () => {
    isMenuOpen.value = false;
  }
);

const handleLogout = () => {
  authStore.logout();
  router.push("/");
};

const handleMobileLogout = () => {
  isMenuOpen.value = false;
  handleLogout();
};
</script>
