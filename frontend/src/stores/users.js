import { ref } from "vue";
import { defineStore } from "pinia";

import api from "../services/api";

function normalizeUsersPayload(responseData) {
  const payload = responseData?.data ?? responseData;

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}

export const useUsersStore = defineStore("users", () => {
  const users = ref([]);
  const loading = ref(false);
  const initialized = ref(false);

  async function fetchUsers({ force = false } = {}) {
    if (initialized.value && !force) {
      return users.value;
    }

    loading.value = true;
    try {
      const response = await api.get("/users");
      users.value = normalizeUsersPayload(response.data);
      initialized.value = true;
      return users.value;
    } finally {
      loading.value = false;
    }
  }

  async function createUser(payload) {
    const response = await api.post("/users", payload);
    await fetchUsers({ force: true });
    return response.data;
  }

  async function updateUser(userId, payload) {
    const response = await api.put(`/users/${userId}`, payload);
    await fetchUsers({ force: true });
    return response.data;
  }

  async function deleteUser(userId) {
    await api.delete(`/users/${userId}`);
    await fetchUsers({ force: true });
  }

  async function importUsers(formData) {
    const response = await api.post("/users/bulk-import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    await fetchUsers({ force: true });
    return response.data;
  }

  function clear() {
    users.value = [];
    initialized.value = false;
  }

  return {
    users,
    loading,
    initialized,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    importUsers,
    clear,
  };
});
