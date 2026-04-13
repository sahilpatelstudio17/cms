import { defineStore } from "pinia";
import { ref } from "vue";

import api from "../services/api";

function normalizeAdminsPayload(responseData) {
  const payload = responseData?.data ?? responseData;

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
}

export const useAdminsStore = defineStore("admins", () => {
  const admins = ref([]);
  const loading = ref(false);
  const initialized = ref(false);
  const inFlight = ref(null);

  const adminCount = ref(0);

  async function fetchAdmins({ force = false } = {}) {
    if (initialized.value && !force) {
      return admins.value;
    }

    if (inFlight.value) {
      return inFlight.value;
    }

    loading.value = true;

    const request = (async () => {
      try {
        const response = await api.get("/admins");
        admins.value = normalizeAdminsPayload(response.data);
        adminCount.value = admins.value.length;
        initialized.value = true;
        return admins.value;
      } finally {
        loading.value = false;
        inFlight.value = null;
      }
    })();

    inFlight.value = request;
    return request;
  }

  async function createAdmin(payload) {
    const response = await api.post("/admins", payload);
    await fetchAdmins({ force: true });
    return response.data;
  }

  async function deleteAdmin(adminId) {
    await api.delete(`/admins/${adminId}`);
    await fetchAdmins({ force: true });
  }

  function clear() {
    admins.value = [];
    adminCount.value = 0;
    initialized.value = false;
    inFlight.value = null;
  }

  return {
    admins,
    adminCount,
    loading,
    initialized,
    fetchAdmins,
    createAdmin,
    deleteAdmin,
    clear,
  };
});
