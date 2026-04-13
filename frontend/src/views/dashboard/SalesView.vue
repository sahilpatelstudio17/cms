<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">Sales</h1>
        <p class="mt-1 text-sm text-slate-600">
          {{ isAdmin ? "Review and manage all employee sales records" : isSalesman ? "Submit and track your sales records." : "View your sales track records." }}
        </p>
      </div>
    </div>

    <!-- SALESMAN VIEW - Add Sales Form -->
    <div v-if="isSalesman" class="grid gap-6 lg:grid-cols-[400px_1fr]">
      <!-- Submit Sale Form -->
      <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h3 class="text-lg font-semibold text-slate-900">{{ editingId ? 'Edit Sale' : 'Add Sale' }}</h3>
        <form class="mt-4 space-y-4" @submit.prevent="submitSale">
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
            <label class="block text-sm font-medium text-slate-700">Product</label>
            <input
              v-model="form.product"
              type="text"
              placeholder="e.g., Laptop, Software License"
              required
              class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700">Customer</label>
            <input
              v-model="form.customer"
              type="text"
              placeholder="e.g., Company ABC Inc."
              required
              class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700">Sale Date</label>
            <input
              v-model="form.saleDate"
              type="date"
              required
              class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              v-model="form.description"
              placeholder="Describe the sale..."
              required
              rows="3"
              class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            ></textarea>
          </div>

          <div class="flex gap-2">
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ saving ? "Saving..." : (editingId ? "Update Sale" : "Submit Sale") }}
            </button>
            <button
              v-if="editingId"
              type="button"
              @click="cancelEdit"
              class="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>

          <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
        </form>
      </div>

      <!-- Sales List -->
      <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-900">Your Sales</h3>
          <button
            @click="loadSales"
            :disabled="loading"
            class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Refresh
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
          <p class="mt-4 text-sm text-slate-600">Loading sales...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="sales.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-4 text-sm font-medium text-slate-900">No sales</h3>
          <p class="mt-1 text-sm text-slate-600">Submit your first sale above</p>
        </div>

        <!-- Sales Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-[980px] w-full text-sm">
            <thead>
              <tr class="border-b border-slate-200">
                <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Product</th>
                <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Customer</th>
                <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Amount</th>
                <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Status</th>
                <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Date</th>
                <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sale in sales" :key="sale.id" class="border-b border-slate-200 hover:bg-slate-50">
                <td class="px-4 py-3 font-medium text-slate-900 whitespace-nowrap sm:px-6">{{ sale.product }}</td>
                <td class="px-4 py-3 text-slate-600 whitespace-nowrap sm:px-6">{{ sale.customer }}</td>
                <td class="px-4 py-3 font-medium text-slate-900 whitespace-nowrap sm:px-6">${{ Number(sale.amount).toFixed(2) }}</td>
                <td class="px-4 py-3 whitespace-nowrap sm:px-6">
                  <span
                    :class="{
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium': true,
                      'bg-yellow-100 text-yellow-800': sale.status === 'pending',
                      'bg-green-100 text-green-800': sale.status === 'approved',
                      'bg-red-100 text-red-800': sale.status === 'rejected',
                    }"
                  >
                    {{ capitalize(sale.status) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-slate-600 whitespace-nowrap sm:px-6">{{ formatDate(sale.created_at) }}</td>
                <td class="px-4 py-3 whitespace-nowrap sm:px-6">
                  <div v-if="sale.status === 'pending'" class="flex gap-2">
                    <button
                      @click="editSale(sale)"
                      :disabled="actionInProgress === sale.id"
                      class="rounded-lg bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteSaleRecord(sale.id)"
                      :disabled="actionInProgress === sale.id"
                      class="rounded-lg bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                  <span v-else class="text-xs text-slate-500">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- NON-SALESMAN, NON-ADMIN VIEW - View Only Sales Track -->
    <div v-else-if="!isAdmin && !isSalesman" class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-900">Your Sales Track</h3>
        <button
          @click="loadSales"
          :disabled="loading"
          class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Refresh
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
        <p class="mt-4 text-sm text-slate-600">Loading sales...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="sales.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-4 text-sm font-medium text-slate-900">No sales</h3>
        <p class="mt-1 text-sm text-slate-600">No sales records yet</p>
      </div>

      <!-- Sales Table - View Only -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-[860px] w-full text-sm">
          <thead>
            <tr class="border-b border-slate-200">
              <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Product</th>
              <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Customer</th>
              <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Amount</th>
              <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Status</th>
              <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in sales" :key="sale.id" class="border-b border-slate-200 hover:bg-slate-50">
              <td class="px-4 py-3 font-medium text-slate-900 whitespace-nowrap sm:px-6">{{ sale.product }}</td>
              <td class="px-4 py-3 text-slate-600 whitespace-nowrap sm:px-6">{{ sale.customer }}</td>
              <td class="px-4 py-3 font-medium text-slate-900 whitespace-nowrap sm:px-6">${{ Number(sale.amount).toFixed(2) }}</td>
              <td class="px-4 py-3 whitespace-nowrap sm:px-6">
                <span
                  :class="{
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium': true,
                    'bg-yellow-100 text-yellow-800': sale.status === 'pending',
                    'bg-green-100 text-green-800': sale.status === 'approved',
                    'bg-red-100 text-red-800': sale.status === 'rejected',
                  }"
                >
                  {{ capitalize(sale.status) }}
                </span>
              </td>
              <td class="px-4 py-3 text-slate-600 whitespace-nowrap sm:px-6">{{ formatDate(sale.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ADMIN VIEW -->
    <div v-else-if="isAdmin" class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-900">All Sales Records</h3>
        <button
          @click="loadSales"
          :disabled="loading"
          class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Refresh
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
        <p class="mt-4 text-sm text-slate-600">Loading sales...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="sales.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-4 text-sm font-medium text-slate-900">No sales</h3>
        <p class="mt-1 text-sm text-slate-600">No sales records have been submitted yet</p>
      </div>

      <!-- Sales Table (Admin View) -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-[1100px] w-full text-sm">
          <thead>
            <tr class="border-b border-slate-200">
              <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Employee</th>
              <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Product</th>
              <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Customer</th>
              <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Amount</th>
              <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Status</th>
              <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Date</th>
              <th class="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap sm:px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in sales" :key="sale.id" class="border-b border-slate-200 hover:bg-slate-50">
              <td class="px-4 py-3 font-medium text-slate-900 whitespace-nowrap sm:px-6">
                {{ getEmployeeName(sale.employee) }}
              </td>
              <td class="px-4 py-3 text-slate-600 whitespace-nowrap sm:px-6">{{ sale.product }}</td>
              <td class="px-4 py-3 text-slate-600 whitespace-nowrap sm:px-6">{{ sale.customer }}</td>
              <td class="px-4 py-3 font-medium text-slate-900 whitespace-nowrap sm:px-6">${{ Number(sale.amount).toFixed(2) }}</td>
              <td class="px-4 py-3 whitespace-nowrap sm:px-6">
                <span
                  :class="{
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium': true,
                    'bg-yellow-100 text-yellow-800': sale.status === 'pending',
                    'bg-green-100 text-green-800': sale.status === 'approved',
                    'bg-red-100 text-red-800': sale.status === 'rejected',
                  }"
                >
                  {{ capitalize(sale.status) }}
                </span>
              </td>
              <td class="px-4 py-3 text-slate-600 whitespace-nowrap sm:px-6">{{ formatDate(sale.created_at) }}</td>
              <td class="px-4 py-3 whitespace-nowrap sm:px-6">
                <div v-if="sale.status === 'pending'" class="flex gap-2">
                  <button
                    @click="approveSaleRecord(sale.id)"
                    :disabled="actionInProgress === sale.id"
                    class="rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ actionInProgress === sale.id ? "..." : "Approve" }}
                  </button>
                  <button
                    @click="showRejectModal(sale.id)"
                    :disabled="actionInProgress === sale.id"
                    class="rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ actionInProgress === sale.id ? "..." : "Reject" }}
                  </button>
                </div>
                <div v-else-if="sale.status === 'approved'" class="flex gap-2">
                  <button
                    @click="deleteSaleRecord(sale.id)"
                    :disabled="actionInProgress === sale.id"
                    class="rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ actionInProgress === sale.id ? "..." : "Delete" }}
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
          <h3 class="text-lg font-semibold text-slate-900">Reject Sales Record</h3>
          <p class="mt-2 text-sm text-slate-600">Provide a reason for rejection (optional).</p>

          <textarea
            v-model="rejectMessage"
            placeholder="e.g., Missing documentation, verification failed, etc."
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
              :disabled="actionInProgress === rejectSaleId"
              class="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ actionInProgress === rejectSaleId ? "Rejecting..." : "Reject" }}
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
import { useSalesStore } from "../../stores/sales";

const auth = useAuthStore();
const salesStore = useSalesStore();
const isAdmin = computed(() => auth.userRole === "admin" || auth.userRole === "manager");
const isSalesman = computed(() => auth.userRole === "salesman");

const loading = computed(() => salesStore.loading);
const saving = ref(false);
const errorMessage = ref("");
const sales = computed(() => salesStore.sales);
const actionInProgress = ref(null);
const showRejectDialog = ref(false);
const rejectSaleId = ref(null);
const rejectMessage = ref("");
const editingId = ref(null);

const form = ref({
  amount: "",
  product: "",
  customer: "",
  description: "",
  saleDate: "",
});

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getEmployeeName(employee) {
  if (!employee) return "Unknown";
  return employee.name || "Unknown";
}

function validateSaleForm() {
  if (form.value.amount === "" || form.value.amount === null || form.value.amount === undefined) {
    return "Please fill amount field";
  }
  if (Number(form.value.amount) <= 0) {
    return "Amount must be greater than 0";
  }

  if (!String(form.value.product || "").trim()) {
    return "Please fill product field";
  }

  if (!String(form.value.customer || "").trim()) {
    return "Please fill customer field";
  }

  if (!String(form.value.saleDate || "").trim()) {
    return "Please select sale date";
  }

  if (!String(form.value.description || "").trim()) {
    return "Please fill description field";
  }

  if (String(form.value.description || "").trim().length < 3) {
    return "Description must be at least 3 characters";
  }

  return "";
}

function mapSaleValidationError(error) {
  const rawMessage = String(error?.message || error?.details?.error || error?.details?.message || "");
  const normalized = rawMessage.toLowerCase();

  if (!rawMessage) return "Failed to submit sale";

  if (normalized.includes("product")) {
    return normalized.includes("min")
      ? "Product must be at least 2 characters"
      : "Please fill product field";
  }

  if (normalized.includes("customer")) {
    return normalized.includes("min")
      ? "Customer must be at least 2 characters"
      : "Please fill customer field";
  }

  if (normalized.includes("description")) {
    return normalized.includes("min")
      ? "Description must be at least 3 characters"
      : "Please fill description field";
  }

  if (normalized.includes("amount")) {
    return "Please enter a valid amount";
  }

  if (normalized.includes("sale_date") || normalized.includes("sale date")) {
    return "Please select sale date";
  }

  return rawMessage;
}

async function loadSales() {
  try {
    await salesStore.fetchSales();
  } catch (error) {
    showToast({
      title: "Error",
      message: error?.message || "Failed to load sales",
      type: "error",
    });
  }
}

async function submitSale() {
  errorMessage.value = "";

  const validationError = validateSaleForm();
  if (validationError) {
    errorMessage.value = validationError;
    return;
  }

  saving.value = true;
  try {
    const payload = {
      amount: form.value.amount,
      product: form.value.product,
      customer: form.value.customer,
      description: form.value.description,
      sale_date: form.value.saleDate + "T00:00:00Z",
    };

    if (editingId.value) {
      await salesStore.editSale(editingId.value, payload);
      showToast({
        title: "Success",
        message: "Sale updated successfully",
        type: "success",
      });
    } else {
      await salesStore.submitSale(payload);
      showToast({
        title: "Success",
        message: "Sale submitted for approval",
        type: "success",
      });
    }

    resetForm();
  } catch (error) {
    errorMessage.value = mapSaleValidationError(error);
  } finally {
    saving.value = false;
  }
}

function resetForm() {
  form.value = { amount: "", product: "", customer: "", description: "", saleDate: "" };
  editingId.value = null;
}

function cancelEdit() {
  resetForm();
}

function editSale(sale) {
  editingId.value = sale.id;
  form.value = {
    amount: sale.amount,
    product: sale.product,
    customer: sale.customer,
    description: sale.description,
    saleDate: new Date(sale.sale_date).toISOString().split("T")[0],
  };
}

async function deleteSaleRecord(saleId) {
  if (!confirm("Are you sure you want to delete this sale?")) {
    return;
  }

  try {
    actionInProgress.value = saleId;
    await salesStore.removeSale(saleId);
    showToast({
      title: "Success",
      message: "Sale deleted successfully",
      type: "success",
    });
  } catch (error) {
    showToast({
      title: "Error",
      message: error?.message || "Failed to delete sale",
      type: "error",
    });
  } finally {
    actionInProgress.value = null;
  }
}

async function approveSaleRecord(saleId) {
  try {
    actionInProgress.value = saleId;
    await salesStore.approveSaleRecord(saleId);
    showToast({
      title: "Success",
      message: "Sale approved successfully",
      type: "success",
    });
  } catch (error) {
    showToast({
      title: "Error",
      message: error?.message || "Failed to approve sale",
      type: "error",
    });
  } finally {
    actionInProgress.value = null;
  }
}

function showRejectModal(saleId) {
  rejectSaleId.value = saleId;
  rejectMessage.value = "";
  showRejectDialog.value = true;
}

async function confirmReject() {
  try {
    actionInProgress.value = rejectSaleId.value;
    await salesStore.rejectSaleRecord(rejectSaleId.value, {
      message: rejectMessage.value || "Sale rejected by admin",
    });
    showToast({
      title: "Success",
      message: "Sale rejected successfully",
      type: "success",
    });
    showRejectDialog.value = false;
  } catch (error) {
    showToast({
      title: "Error",
      message: error?.message || "Failed to reject sale",
      type: "error",
    });
  } finally {
    actionInProgress.value = null;
  }
}

onMounted(() => {
  loadSales();
});
</script>
