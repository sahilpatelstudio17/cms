import { ref } from "vue";
import { defineStore } from "pinia";

import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from "../services/api";

function normalizeListPayload(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export const useEmployeesStore = defineStore("employees", () => {
  const employees = ref([]);
  const loading = ref(false);
  const initialized = ref(false);

  async function fetchEmployees({ force = false, params = { page: 1, limit: 100 } } = {}) {
    if (initialized.value && !force) return employees.value;

    loading.value = true;
    try {
      const data = await getEmployees(params);
      employees.value = normalizeListPayload(data);
      initialized.value = true;
      return employees.value;
    } finally {
      loading.value = false;
    }
  }

  async function addEmployee(payload) {
    const created = await createEmployee(payload);
    await fetchEmployees({ force: true });
    return created;
  }

  async function editEmployee(id, payload) {
    const updated = await updateEmployee(id, payload);
    await fetchEmployees({ force: true });
    return updated;
  }

  async function removeEmployee(id) {
    await deleteEmployee(id);
    await fetchEmployees({ force: true });
  }

  function clear() {
    employees.value = [];
    initialized.value = false;
  }

  return {
    employees,
    loading,
    initialized,
    fetchEmployees,
    addEmployee,
    editEmployee,
    removeEmployee,
    clear,
  };
});
