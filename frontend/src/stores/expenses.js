import { ref } from "vue";
import { defineStore } from "pinia";

import { approveExpense, createExpense, listExpenses, rejectExpense } from "../services/api";

function normalizeListPayload(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export const useExpensesStore = defineStore("expenses", () => {
  const expenses = ref([]);
  const loading = ref(false);
  const initialized = ref(false);

  async function fetchExpenses({ force = false, params = { page: 1, limit: 100 } } = {}) {
    if (initialized.value && !force) return expenses.value;

    loading.value = true;
    try {
      const data = await listExpenses(params);
      expenses.value = normalizeListPayload(data);
      initialized.value = true;
      return expenses.value;
    } finally {
      loading.value = false;
    }
  }

  async function submitExpense(payload) {
    const created = await createExpense(payload);
    await fetchExpenses({ force: true });
    return created;
  }

  async function approveExpenseRequest(expenseId) {
    const result = await approveExpense(expenseId);
    await fetchExpenses({ force: true });
    return result;
  }

  async function rejectExpenseRequest(expenseId, payload) {
    const result = await rejectExpense(expenseId, payload);
    await fetchExpenses({ force: true });
    return result;
  }

  function clear() {
    expenses.value = [];
    initialized.value = false;
  }

  return {
    expenses,
    loading,
    initialized,
    fetchExpenses,
    submitExpense,
    approveExpenseRequest,
    rejectExpenseRequest,
    clear,
  };
});
