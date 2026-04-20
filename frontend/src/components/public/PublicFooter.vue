<template>
  <footer class="border-t border-slate-200 bg-white/90">
    <div class="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
      <div>
        <h3 class="text-2xl font-black text-slate-900">CMS</h3>
        <p class="mt-3 max-w-sm text-sm text-slate-600">
          A flexible business workspace for teams managing employees, tasks, expenses, and sales.
        </p>
      </div>
      <div>
        <h4 class="text-sm font-bold uppercase tracking-wide text-slate-500">Pages</h4>
        <ul class="mt-3 space-y-2">
          <li v-for="link in navLinks" :key="`footer-${link.to}`">
            <router-link class="text-sm font-medium text-slate-700 hover:text-slate-900" :to="link.to">
              {{ link.label }}
            </router-link>
          </li>
        </ul>
      </div>
      <div>
        <h4 class="text-sm font-bold uppercase tracking-wide text-slate-500">Support</h4>
        <ul class="mt-3 space-y-2 text-sm text-slate-700">
          <li>support@cmspro.com</li>
          <li>+91 98765 43210</li>
          <li>Mon-Fri, 9AM-6PM PST</li>
        </ul>
      </div>
    </div>
    <div class="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
      Copyright {{ year }} CMS. All rights reserved.
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";

import { navLinks } from "../../data/publicContent";

const year = computed(() => new Date().getFullYear());
</script>
