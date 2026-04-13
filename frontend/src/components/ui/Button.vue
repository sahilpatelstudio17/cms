<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "primary",
  },
  size: {
    type: String,
    default: "md",
  },
  block: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "button",
  },
});

const variantClass = computed(() => {
  if (props.variant === "secondary") return "bg-slate-900 text-white hover:bg-slate-700";
  if (props.variant === "ghost") return "bg-slate-100 text-slate-700 hover:bg-slate-200";
  if (props.variant === "danger") return "bg-rose-600 text-white hover:bg-rose-700";
  return "bg-brand-700 text-white hover:bg-brand-900";
});

const sizeClass = computed(() => {
  if (props.size === "sm") return "px-3 py-1.5 text-xs";
  if (props.size === "lg") return "px-5 py-3 text-base";
  return "px-4 py-2 text-sm";
});

const classes = computed(() => [
  "inline-flex items-center justify-center rounded-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
  variantClass.value,
  sizeClass.value,
  props.block ? "w-full" : "",
]);
</script>

<template>
  <button :type="type" :disabled="disabled || loading" :class="classes">
    <span v-if="loading" class="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/50 border-t-white" />
    <slot />
  </button>
</template>
