import { ref } from "vue";
import { defineStore } from "pinia";

import { createTask, deleteTask, getTasks, updateTask } from "../services/api";

function normalizeListPayload(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export const useTasksStore = defineStore("tasks", () => {
  const tasks = ref([]);
  const loading = ref(false);
  const initialized = ref(false);

  async function fetchTasks({ force = false, params = { page: 1, limit: 100 } } = {}) {
    if (initialized.value && !force) return tasks.value;

    loading.value = true;
    try {
      const data = await getTasks(params);
      tasks.value = normalizeListPayload(data);
      initialized.value = true;
      return tasks.value;
    } finally {
      loading.value = false;
    }
  }

  async function addTask(payload) {
    const created = await createTask(payload);
    await fetchTasks({ force: true });
    return created;
  }

  async function editTask(id, payload) {
    const updated = await updateTask(id, payload);
    await fetchTasks({ force: true });
    return updated;
  }

  async function removeTask(id) {
    await deleteTask(id);
    await fetchTasks({ force: true });
  }

  function clear() {
    tasks.value = [];
    initialized.value = false;
  }

  return {
    tasks,
    loading,
    initialized,
    fetchTasks,
    addTask,
    editTask,
    removeTask,
    clear,
  };
});
