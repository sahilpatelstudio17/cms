<script setup>
import { useUIState, removeToast } from "../../services/ui";

const { toasts } = useUIState();

function toneClass(type) {
  if (type === "success") return "border-emerald-300 bg-emerald-50 text-emerald-900";
  if (type === "error") return "border-rose-300 bg-rose-50 text-rose-900";
  if (type === "warning") return "border-amber-300 bg-amber-50 text-amber-900";
  return "border-sky-300 bg-sky-50 text-sky-900";
}
</script>

<template>
  <Teleport to="body">
    <div class="pointer-events-none fixed right-4 top-4 z-[70] flex w-[min(360px,90vw)] flex-col gap-2">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto rounded-lg border p-3 shadow-md"
        :class="toneClass(toast.type)"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-semibold">{{ toast.title }}</p>
            <p v-if="toast.message" class="mt-1 text-xs opacity-90">{{ toast.message }}</p>
          </div>
          <button class="rounded bg-white/70 px-1.5 py-0.5 text-xs" @click="removeToast(toast.id)">x</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
