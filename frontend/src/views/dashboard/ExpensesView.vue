<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">Expenses</h1>
        <p class="mt-1 text-sm text-slate-600">
          {{ isAdmin ? "View all employee expense requests" : "Submit and track your expense requests." }}
        </p>
      </div>
    </div>

    <!-- EMPLOYEE VIEW -->
    <div v-if="!isAdmin" class="grid gap-6 lg:grid-cols-[340px_1fr]">
      <!-- Submit Expense Form -->
      <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="text-lg font-semibold text-slate-900">Submit Expense</h3>
        <form class="mt-4 space-y-4" @submit.prevent="submitExpense">
          <div>
            <label class="block text-sm font-medium text-slate-700">Amount</label>
            <input
              v-model.number="form.amount"
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
              class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700">Category</label>
            <select
              v-model="form.category"
              required
              class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              <option value="travel">Travel</option>
              <option value="meals">Meals</option>
              <option value="office_supplies">Office Supplies</option>
              <option value="equipment">Equipment</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              v-model="form.description"
              placeholder="Describe the expense..."
              required
              rows="3"
              class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            ></textarea>
          </div>

          <button
            type="submit"
            :disabled="saving"
            class="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ saving ? "Submitting..." : "Submit Expense" }}
          </button>

          <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
        </form>
      </div>

      <!-- Expenses List -->
      <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-900">Your Expenses</h3>
          <button
            @click="loadExpenses"
            :disabled="loading"
            class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Refresh
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
          <p class="mt-4 text-sm text-slate-600">Loading expenses...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="expenses.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-4 text-sm font-medium text-slate-900">No expenses</h3>
          <p class="mt-1 text-sm text-slate-600">Submit your first expense above</p>
        </div>

        <!-- Expenses Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-[900px] w-full text-sm">
            <thead>
              <tr class="border-b border-slate-200">
                <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Amount</th>
                <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Category</th>
                <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Description</th>
                <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Status</th>
                <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="expense in expenses" :key="expense.id" class="border-b border-slate-200 hover:bg-slate-50">
                <td class="px-4 py-3 font-medium text-slate-900 whitespace-nowrap sm:px-6">${{ Number(expense.amount).toFixed(2) }}</td>
                <td class="px-4 py-3 text-slate-600 whitespace-nowrap sm:px-6">{{ formatCategory(expense.category) }}</td>
                <td class="px-4 py-3 text-slate-600 sm:px-6 min-w-[260px]">{{ expense.description }}</td>
                <td class="px-4 py-3 whitespace-nowrap sm:px-6">
                  <span
                    :class="{
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium': true,
                      'bg-yellow-100 text-yellow-800': expense.status === 'pending',
                      'bg-green-100 text-green-800': expense.status === 'approved',
                      'bg-red-100 text-red-800': expense.status === 'rejected',
                    }"
                  >
                    {{ capitalize(expense.status) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-slate-600 whitespace-nowrap sm:px-6">{{ formatDate(expense.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ADMIN VIEW -->
    <div v-else class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-900">All Employee Expenses</h3>
        <button
          @click="loadExpenses"
          :disabled="loading"
          class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Refresh
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
        <p class="mt-4 text-sm text-slate-600">Loading expenses...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="expenses.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-4 text-sm font-medium text-slate-900">No expenses</h3>
        <p class="mt-1 text-sm text-slate-600">No expense requests have been submitted yet</p>
      </div>

      <!-- Expenses Table (Admin View) -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-[1180px] w-full text-sm">
          <thead>
            <tr class="border-b border-slate-200">
              <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Employee</th>
              <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Amount</th>
              <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Category</th>
              <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Description</th>
              <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Status</th>
              <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Date</th>
              <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="expense in expenses" :key="expense.id" class="border-b border-slate-200 hover:bg-slate-50">
              <td class="px-4 py-3 font-medium text-slate-900 whitespace-nowrap sm:px-6">
                {{ expense.employee?.name || "Unknown" }}
              </td>
              <td class="px-4 py-3 font-medium text-slate-900 whitespace-nowrap sm:px-6">${{ Number(expense.amount).toFixed(2) }}</td>
              <td class="px-4 py-3 text-slate-600 whitespace-nowrap sm:px-6">{{ formatCategory(expense.category) }}</td>
              <td class="px-4 py-3 text-slate-600 sm:px-6 min-w-[280px]">{{ expense.description }}</td>
              <td class="px-4 py-3 whitespace-nowrap sm:px-6">
                <span
                  :class="{
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium': true,
                    'bg-yellow-100 text-yellow-800': expense.status === 'pending',
                    'bg-green-100 text-green-800': expense.status === 'approved',
                    'bg-red-100 text-red-800': expense.status === 'rejected',
                  }"
                >
                  {{ capitalize(expense.status) }}
                </span>
              </td>
              <td class="px-4 py-3 text-slate-600 whitespace-nowrap sm:px-6">{{ formatDate(expense.created_at) }}</td>
              <td class="px-4 py-3 whitespace-nowrap sm:px-6">
                <div v-if="expense.status === 'pending'" class="flex gap-2">
                  <button
                    @click="approveExpenseRequest(expense.id)"
                    :disabled="actionInProgress === expense.id"
                    class="rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ actionInProgress === expense.id ? "..." : "Approve" }}
                  </button>
                  <button
                    @click="showRejectModal(expense.id)"
                    :disabled="actionInProgress === expense.id"
                    class="rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ actionInProgress === expense.id ? "..." : "Reject" }}
                  </button>
                </div>
                <span v-else class="text-xs text-slate-500">—</span>
              </td>
            </tr>
          </tbody>
        </table>
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
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { showToast } from "../../services/ui";
import { useAuthStore } from "../../stores/auth";
import { useExpensesStore } from "../../stores/expenses";

const auth = useAuthStore();
const expensesStore = useExpensesStore();
const isAdmin = computed(() => auth.userRole === "admin");

const loading = computed(() => expensesStore.loading);
const saving = ref(false);
const errorMessage = ref("");
const expenses = computed(() => expensesStore.expenses);
const actionInProgress = ref(null);
const showRejectDialog = ref(false);
const rejectExpenseId = ref(null);
const rejectMessage = ref("");

const form = ref({
  amount: "",
  category: "",
  description: "",
});

function formatCategory(category) {
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function validateExpenseForm() {
  if (form.value.amount === "" || form.value.amount === null || form.value.amount === undefined) {
    return "Please fill amount field";
  }
  if (Number(form.value.amount) <= 0) {
    return "Amount must be greater than 0";
  }
  if (!String(form.value.category || "").trim()) {
    return "Please select category";
  }
  if (!String(form.value.description || "").trim()) {
    return "Please fill description field";
  }
  if (String(form.value.description || "").trim().length < 5) {
    return "Description must be at least 5 characters";
  }
  return "";
}

function mapExpenseValidationError(error) {
  const rawMessage = String(error?.message || error?.details?.error || error?.details?.message || "");
  const normalized = rawMessage.toLowerCase();

  if (!rawMessage) return "Failed to submit expense";

  if (normalized.includes("amount")) {
    return "Please enter a valid amount";
  }
  if (normalized.includes("category")) {
    return "Please select category";
  }
  if (normalized.includes("description")) {
    return normalized.includes("min")
      ? "Description must be at least 5 characters"
      : "Please fill description field";
  }

  return rawMessage;
}

async function loadExpenses() {
  try {
    await expensesStore.fetchExpenses();
  } catch (error) {
    showToast({
      title: "Error",
      message: error?.message || "Failed to load expenses",
      type: "error",
    });
  }
}

async function submitExpense() {
  errorMessage.value = "";

  const validationError = validateExpenseForm();
  if (validationError) {
    errorMessage.value = validationError;
    return;
  }

  saving.value = true;
  try {
    await expensesStore.submitExpense({
      amount: form.value.amount,
      category: form.value.category,
      description: form.value.description,
    });

    showToast({
      title: "Success",
      message: "Expense submitted for approval",
      type: "success",
    });

    form.value = { amount: "", category: "", description: "" };
  } catch (error) {
    errorMessage.value = mapExpenseValidationError(error);
  } finally {
    saving.value = false;
  }
}

async function approveExpenseRequest(expenseId) {
  try {
    actionInProgress.value = expenseId;
    await expensesStore.approveExpenseRequest(expenseId);
    showToast({
      title: "Success",
      message: "Expense approved successfully",
      type: "success",
    });
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
    await expensesStore.rejectExpenseRequest(rejectExpenseId.value, {
      message: rejectMessage.value || "Expense rejected by admin",
    });
    showToast({
      title: "Success",
      message: "Expense rejected successfully",
      type: "success",
    });
    showRejectDialog.value = false;
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

onMounted(loadExpenses);
</script>
