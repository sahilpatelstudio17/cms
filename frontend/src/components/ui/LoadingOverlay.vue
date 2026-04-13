<script setup>
import { computed } from "vue";
import { useUIState } from "../../services/ui";

const { loadingCount } = useUIState();
const visible = computed(() => loadingCount.value > 0);
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="pointer-events-none fixed inset-0 z-[60] grid place-items-center bg-slate-900/15">
      <div class="rounded-lg bg-white px-4 py-3 shadow-lg ring-1 ring-slate-200">
        <div class="flex items-center gap-2 text-sm font-medium text-slate-700">
          <span class="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
          Loading...
        </div>
      </div>
    </div>
  </Teleport>
</template>
