import { ref } from "vue";
import { defineStore } from "pinia";

import { approveSale, createSale, deleteSale, listSales, rejectSale, updateSale } from "../services/api";

function normalizeListPayload(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export const useSalesStore = defineStore("sales", () => {
  const sales = ref([]);
  const loading = ref(false);
  const initialized = ref(false);

  async function fetchSales({ force = false, params = { page: 1, limit: 100 } } = {}) {
    if (initialized.value && !force) return sales.value;

    loading.value = true;
    try {
      const data = await listSales(params);
      sales.value = normalizeListPayload(data);
      initialized.value = true;
      return sales.value;
    } finally {
      loading.value = false;
    }
  }

  async function submitSale(payload) {
    const created = await createSale(payload);
    await fetchSales({ force: true });
    return created;
  }

  async function editSale(id, payload) {
    const updated = await updateSale(id, payload);
    await fetchSales({ force: true });
    return updated;
  }

  async function removeSale(id) {
    await deleteSale(id);
    await fetchSales({ force: true });
  }

  async function approveSaleRecord(id) {
    const result = await approveSale(id);
    await fetchSales({ force: true });
    return result;
  }

  async function rejectSaleRecord(id, payload) {
    const result = await rejectSale(id, payload);
    await fetchSales({ force: true });
    return result;
  }

  function clear() {
    sales.value = [];
    initialized.value = false;
  }

  return {
    sales,
    loading,
    initialized,
    fetchSales,
    submitSale,
    editSale,
    removeSale,
    approveSaleRecord,
    rejectSaleRecord,
    clear,
  };
});
