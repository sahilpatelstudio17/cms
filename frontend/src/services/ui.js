import { readonly, ref } from "vue";

const loadingCount = ref(0);
const toasts = ref([]);

function beginLoading() {
  loadingCount.value += 1;
}

function endLoading() {
  loadingCount.value = Math.max(0, loadingCount.value - 1);
}

function showToast({ title, message = "", type = "info", duration = 3200 }) {
  const id = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  toasts.value.push({ id, title, message, type });

  if (duration > 0) {
    window.setTimeout(() => removeToast(id), duration);
  }

  return id;
}

function removeToast(id) {
  toasts.value = toasts.value.filter((item) => item.id !== id);
}

export function useUIState() {
  return {
    loadingCount: readonly(loadingCount),
    toasts: readonly(toasts),
  };
}

export {
  beginLoading,
  endLoading,
  showToast,
  removeToast,
};
