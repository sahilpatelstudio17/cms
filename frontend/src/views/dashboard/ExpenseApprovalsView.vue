<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">Expense Approvals</h1>
        <p class="mt-1 text-sm text-slate-600">Review and approve pending expense requests.</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
        <p class="mt-4 text-slate-600">Loading pending expenses...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="expenses.length === 0" class="rounded-lg border border-slate-200 bg-white px-6 py-12 text-center">
      <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-slate-900">No pending expenses</h3>
      <p class="mt-1 text-sm text-slate-600">All expense requests have been reviewed.</p>
    </div>

    <!-- Expenses List -->
    <div v-else class="space-y-4">
      <div v-for="expense in expenses" :key="expense.id" class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-slate-900">
              {{ expense.employee?.name || "Unknown Employee" }}
            </h3>
            <p class="mt-1 text-sm text-slate-600">{{ expense.description }}</p>
            <div class="mt-3 flex items-center gap-4">
              <span class="text-sm text-slate-600">
                <span class="font-semibold text-slate-900">${{ Number(expense.amount).toFixed(2) }}</span>
              </span>
              <span class="text-sm text-slate-600">{{ formatCategory(expense.category) }}</span>
              <span class="text-xs text-slate-500">{{ formatDate(expense.created_at) }}</span>
            </div>
          </div>
          <div class="ml-4 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
            Pending
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-6 flex gap-3">
          <button
            @click="approveExpenseRequest(expense.id)"
            :disabled="actionInProgress === expense.id"
            class="flex-1 inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg v-if="actionInProgress !== expense.id" class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <div v-else class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            {{ actionInProgress === expense.id ? "Approving..." : "Approve" }}
          </button>

          <button
            @click="showRejectModal(expense.id)"
            :disabled="actionInProgress === expense.id"
            class="flex-1 inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg v-if="actionInProgress !== expense.id" class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <div v-else class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            {{ actionInProgress === expense.id ? "Rejecting..." : "Reject" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="showRejectDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="showRejectDialog = false">
      <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h3 class="text-lg font-semibold text-slate-900">Reject Expense Request</h3>
        <p class="mt-2 text-sm text-slate-600">Provide a reason for rejection (optional).</p>

        <textarea
          v-model="rejectMessage"
          placeholder="e.g., Receipt missing, amount exceeds limit, etc."
          class="mt-4 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          rows="4"
        ></textarea>

        <div class="mt-6 flex gap-3">
          <button
            @click="showRejectDialog = false"
            class="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmReject"
            :disabled="actionInProgress === rejectExpenseId"
            class="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ actionInProgress === rejectExpenseId ? "Rejecting..." : "Reject" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { listPendingExpenses, approveExpense, rejectExpense } from "../../services/api";
import { showToast } from "../../services/ui";

const expenses = ref([]);
const loading = ref(true);
const actionInProgress = ref(null);
const showRejectDialog = ref(false);
const rejectExpenseId = ref(null);
const rejectMessage = ref("");

function formatCategory(category) {
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function loadExpenses() {
  try {
    loading.value = true;
    const data = await listPendingExpenses();
    expenses.value = data || [];
  } catch (error) {
    showToast({
      title: "Error",
      message: error?.message || "Failed to load pending expenses",
      type: "error",
    });
  } finally {
    loading.value = false;
  }
}

async function approveExpenseRequest(expenseId) {
  try {
    actionInProgress.value = expenseId;
    await approveExpense(expenseId);
    showToast({
      title: "Success",
      message: "Expense approved successfully",
      type: "success",
    });
    await loadExpenses();
  } catch (error) {
    showToast({
      title: "Error",
      message: error?.message || "Failed to approve expense",
      type: "error",
    });
  } finally {
    actionInProgress.value = null;
  }
}

function showRejectModal(expenseId) {
  rejectExpenseId.value = expenseId;
  rejectMessage.value = "";
  showRejectDialog.value = true;
}

async function confirmReject() {
  try {
    actionInProgress.value = rejectExpenseId.value;
    await rejectExpense(rejectExpenseId.value, {
      message: rejectMessage.value || "Expense rejected by admin",
    });
    showToast({
      title: "Success",
      message: "Expense rejected successfully",
      type: "success",
    });
    showRejectDialog.value = false;
    await loadExpenses();
  } catch (error) {
    showToast({
      title: "Error",
      message: error?.message || "Failed to reject expense",
      type: "error",
    });
  } finally {
    actionInProgress.value = null;
  }
}

onMounted(() => {
  loadExpenses();
});
</script>
