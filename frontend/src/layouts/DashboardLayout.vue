<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";

const route = useRoute();
const sidebarOpen = ref(false);

watch(
  () => route.fullPath,
  () => {
    sidebarOpen.value = false;
  }
);
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-900">
    <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="flex min-h-screen flex-col lg:pl-72">
      <Navbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div class="mx-auto w-full max-w-7xl min-w-0">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>
