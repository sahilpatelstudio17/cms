import { defineStore } from "pinia";
import { ref } from "vue";

import api from "../services/api";

export const useProfileStore = defineStore("profile", () => {
  const profile = ref({
    id: null,
    name: "",
    email: "",
    role: "",
    status: "",
    company_id: null,
    admin: null,
  });

  const loading = ref(false);
  const initialized = ref(false);
  const inFlight = ref(null);

  async function fetchProfile({ force = false } = {}) {
    if (initialized.value && !force) {
      return profile.value;
    }

    if (inFlight.value) {
      return inFlight.value;
    }

    loading.value = true;

    const request = (async () => {
      try {
        const response = await api.get("/auth/me");
        profile.value = response.data?.data || profile.value;
        initialized.value = true;
        return profile.value;
      } finally {
        loading.value = false;
        inFlight.value = null;
      }
    })();

    inFlight.value = request;
    return request;
  }

  async function updateProfile(payload) {
    const response = await api.put("/auth/profile", payload);

    profile.value = {
      ...profile.value,
      ...(response.data?.data || {}),
      name: payload?.name ?? profile.value.name,
      email: payload?.email ?? profile.value.email,
    };

    initialized.value = true;
    return profile.value;
  }

  function clear() {
    profile.value = {
      id: null,
      name: "",
      email: "",
      role: "",
      status: "",
      company_id: null,
      admin: null,
    };
    initialized.value = false;
    inFlight.value = null;
  }

  return {
    profile,
    loading,
    initialized,
    fetchProfile,
    updateProfile,
    clear,
  };
});
