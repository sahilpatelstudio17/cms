import { defineStore } from "pinia";
import { ref } from "vue";

import { getPendingAdminRequests, getPendingUserApprovals } from "../services/api";

export const useApprovalsStore = defineStore("approvals", () => {
  const userRequestApprovals = ref([]);
  const adminApprovals = ref([]);
  const loading = ref(false);

  const initializedForUserRequests = ref(false);
  const initializedForAdminRequests = ref(false);

  const pendingRequestPromise = ref(null);

  async function fetchApprovalsByRole({ isSuperAdmin = false, force = false } = {}) {
    const initialized = isSuperAdmin ? initializedForAdminRequests.value : initializedForUserRequests.value;

    if (!force && initialized) {
      return;
    }

    // Prevent duplicate calls when multiple triggers happen at once.
    if (pendingRequestPromise.value) {
      return pendingRequestPromise.value;
    }

    loading.value = true;

    const requestPromise = (async () => {
      try {
        if (isSuperAdmin) {
          const adminData = await getPendingAdminRequests();
          adminApprovals.value = adminData || [];
          initializedForAdminRequests.value = true;
        } else {
          const userData = await getPendingUserApprovals();
          userRequestApprovals.value = userData || [];
          initializedForUserRequests.value = true;
        }
      } finally {
        loading.value = false;
        pendingRequestPromise.value = null;
      }
    })();

    pendingRequestPromise.value = requestPromise;
    return requestPromise;
  }

  function clear() {
    userRequestApprovals.value = [];
    adminApprovals.value = [];
    initializedForUserRequests.value = false;
    initializedForAdminRequests.value = false;
    pendingRequestPromise.value = null;
  }

  return {
    userRequestApprovals,
    adminApprovals,
    loading,
    initializedForUserRequests,
    initializedForAdminRequests,
    fetchApprovalsByRole,
    clear,
  };
});
