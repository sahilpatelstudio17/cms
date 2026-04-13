import { ref } from "vue";
import { defineStore } from "pinia";

import api, { getCompany, updateCompany } from "../services/api";

export const useAppDataStore = defineStore("appData", () => {
  const company = ref(null);
  const dashboardStats = ref(null);

  const companyLoading = ref(false);
  const statsLoading = ref(false);

  const companyInitialized = ref(false);
  const statsInitialized = ref(false);

  async function fetchCompany({ force = false } = {}) {
    if (companyInitialized.value && !force) {
      return company.value;
    }

    companyLoading.value = true;
    try {
      company.value = await getCompany();
      companyInitialized.value = true;
      return company.value;
    } finally {
      companyLoading.value = false;
    }
  }

  async function saveCompany(payload) {
    const updated = await updateCompany(payload);
    company.value = {
      ...(company.value || {}),
      ...(updated || {}),
    };
    companyInitialized.value = true;
    return updated;
  }

  async function fetchDashboardStats({ force = false } = {}) {
    if (statsInitialized.value && !force) {
      return dashboardStats.value;
    }

    statsLoading.value = true;
    try {
      const response = await api.get("/dashboard/stats");
      dashboardStats.value = response.data?.data || null;
      statsInitialized.value = true;
      return dashboardStats.value;
    } finally {
      statsLoading.value = false;
    }
  }

  function clear() {
    company.value = null;
    dashboardStats.value = null;
    companyInitialized.value = false;
    statsInitialized.value = false;
  }

  return {
    company,
    dashboardStats,
    companyLoading,
    statsLoading,
    companyInitialized,
    statsInitialized,
    fetchCompany,
    saveCompany,
    fetchDashboardStats,
    clear,
  };
});
