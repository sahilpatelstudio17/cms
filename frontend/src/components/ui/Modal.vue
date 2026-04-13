<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

function close() {
  emit("update:modelValue", false);
}
</script>

<template>
  <Teleport to="body">
    <div v-if="props.modelValue" class="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4" @click.self="close">
      <div class="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl">
        <div class="mb-4 flex items-center justify-between gap-3">
          <h3 class="text-lg font-semibold text-slate-900">{{ title }}</h3>
          <button class="rounded-md bg-slate-100 px-2 py-1 text-sm text-slate-600" @click="close">Close</button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
