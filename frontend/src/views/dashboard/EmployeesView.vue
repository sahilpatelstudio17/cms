<script setup>
import { computed, onMounted, ref } from "vue";

import Button from "../../components/ui/Button.vue";
import Card from "../../components/ui/Card.vue";
import Input from "../../components/ui/Input.vue";
import Modal from "../../components/ui/Modal.vue";
import Table from "../../components/ui/Table.vue";
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
  requestEmployeeApproval,
} from "../../services/api";
import api from "../../services/api";
import { showToast } from "../../services/ui";
import { useAuthStore } from "../../stores/auth";

const auth = useAuthStore();
const loading = ref(false);
const saving = ref(false);
const errorMessage = ref("");
const employees = ref([]);
const editingId = ref(null);
const deletingEmployeeId = ref(null);
const showDeleteModal = ref(false);
const newlyApprovedName = ref(null);
const fileInput = ref(null);
const importLog = ref(null);
const showImportLog = ref(false);
const searchQuery = ref("");

const form = ref({
  name: "",
  position: "",
  salary: "",
});

const isEditing = computed(() => editingId.value !== null);
const canManageEmployees = computed(() => auth.userRole === "admin" || auth.userRole === "manager");

// Non-admin/manager users can only view employees
const isViewOnly = computed(() => !canManageEmployees.value);

// Filter employees by search query
const filteredEmployees = computed(() => {
  if (!searchQuery.value.trim()) {
    return employees.value;
  }
  const query = searchQuery.value.toLowerCase();
  return employees.value.filter(emp => 
    emp.name.toLowerCase().includes(query) || 
    emp.position.toLowerCase().includes(query)
  );
});

const columns = [
  { key: "name", label: "Name" },
  { key: "position", label: "Position" },
  { key: "salary", label: "Salary" },
];

async function loadEmployees() {
  loading.value = true;
  errorMessage.value = "";
  try {
    const result = await getEmployees({ page: 1, limit: 100 });
    employees.value = result?.items || [];

    // Auto-select newly approved employee
    if (newlyApprovedName.value) {
      const newEmployee = employees.value.find((emp) => emp.name === newlyApprovedName.value);
      if (newEmployee) {
        startEdit(newEmployee);
        showToast({
          title: "New employee added",
          message: `${newEmployee.name} has been approved and added to the employee list`,
          type: "success",
        });
        newlyApprovedName.value = null;
      }
    }
  } catch (error) {
    errorMessage.value = error?.message || "Failed to load employees.";
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  editingId.value = null;
  form.value = { name: "", position: "", salary: "" };
}

function startEdit(item) {
  if (!canManageEmployees.value) {
    return;
  }
  editingId.value = item.id;
  form.value = {
    name: item.name,
    position: item.position,
    salary: String(item.salary),
  };
}

async function submitForm() {
  errorMessage.value = "";
  const payload = {
    name: form.value.name.trim(),
    position: form.value.position.trim(),
    salary: Number(form.value.salary),
  };

  if (!payload.name || !payload.position || !payload.salary || payload.salary <= 0) {
    errorMessage.value = "Please enter valid name, position, and salary.";
    return;
  }

  saving.value = true;
  try {
    if (isEditing.value) {
      await updateEmployee(editingId.value, payload);
      showToast({ title: "Employee updated", type: "success" });
    } else {
      // Send for admin approval instead of directly creating
      await requestEmployeeApproval({
        name: payload.name,
        position: payload.position,
        salary: payload.salary,
      });
      showToast({ 
        title: "Employee Request Submitted",
        message: "Your employee request has been sent to admin for approval.",
        type: "success" 
      });
    }
    resetForm();
    await loadEmployees();
  } catch (error) {
    errorMessage.value = error?.message || "Failed to save employee.";
  } finally {
    saving.value = false;
  }
}

function confirmDelete(id) {
  deletingEmployeeId.value = id;
  showDeleteModal.value = true;
}

async function removeEmployee() {
  if (!deletingEmployeeId.value) return;

  errorMessage.value = "";
  try {
    await deleteEmployee(deletingEmployeeId.value);
    showToast({ title: "Employee deleted", type: "success" });
    await loadEmployees();
  } catch (error) {
    errorMessage.value = error?.message || "Failed to delete employee.";
  } finally {
    showDeleteModal.value = false;
    deletingEmployeeId.value = null;
  }
}

function handleApprovalSuccess(event) {
  // event.detail contains { userName: "Charlie Pending" }
  newlyApprovedName.value = event.detail.userName;
  loadEmployees();
}

async function handleBulkImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Check file type
  if (!file.name.endsWith('.xlsx') && !file.type.includes('spreadsheet')) {
    showToast({
      title: "Invalid File",
      message: "Please upload an Excel file (.xlsx)",
      type: "error",
    });
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    saving.value = true;
    const response = await api.post('/employees/bulk-import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    const result = response.data.data;
    importLog.value = result;
    showImportLog.value = true;
    
    showToast({
      title: 'Import Complete',
      message: `Success: ${result.success_count}, Failed: ${result.fail_count}`,
      type: result.fail_count === 0 ? 'success' : 'warning',
    });
    
    await loadEmployees();
  } catch (error) {
    showToast({
      title: 'Import Failed',
      message: error.message || 'Failed to import employees',
      type: 'error',
    });
  } finally {
    saving.value = false;
    // Reset file input
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
}

onMounted(() => {
  loadEmployees();
  // Listen for approval success events from ApprovalsView
  window.addEventListener("approval:success", handleApprovalSuccess);
});

</script>

<template>
  <section class="space-y-6">
    <header>
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-semibold">All Employees</h2>
          <p class="mt-1 text-sm text-slate-500">
            <span v-if="canManageEmployees">Manage your team members and roles.</span>
            <span v-else>
              You are viewing all company employees as <span class="font-semibold capitalize">{{ auth.userRole }}</span>
            </span>
          </p>
        </div>
        <div class="flex items-center gap-2">
          <span class="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase text-blue-700">
            Total: {{ employees.length }}
          </span>
        </div>
      </div>
    </header>

    <div class="grid gap-6" :class="canManageEmployees ? 'lg:grid-cols-[340px_1fr]' : 'lg:grid-cols-1'">
      <Card v-if="canManageEmployees">
        <h3 class="text-lg font-semibold">{{ isEditing ? "Edit Employee" : "Add Employee" }}</h3>
        <form class="mt-4 space-y-3" @submit.prevent="submitForm">
          <Input v-model="form.name" label="Name" required />
          <Input v-model="form.position" label="Position" required />
          <Input v-model="form.salary" label="Salary" type="number" min="1" step="0.01" required />

          <div class="flex gap-2 pt-2">
            <Button type="submit" :loading="saving">
              {{ isEditing ? "Update" : "Add" }}
            </Button>
            <Button v-if="isEditing" variant="ghost" type="button" @click="resetForm">Cancel</Button>
          </div>
        </form>
      </Card>

      <Card>
        <div class="mb-4 flex items-center justify-between gap-2">
          <h3 class="text-lg font-semibold">Employee List ({{ filteredEmployees.length }})</h3>
          <div class="flex gap-2">
            <input
              ref="fileInput"
              type="file"
              accept=".xlsx"
              @change="handleBulkImport"
              class="hidden"
            />
            <Button 
              v-if="canManageEmployees"
              variant="secondary" 
              size="sm" 
              @click="$refs.fileInput.click()"
              :loading="saving"
            >
              📊 Import Excel
            </Button>
            <Button variant="secondary" size="sm" @click="loadEmployees">Refresh</Button>
          </div>
        </div>

        <div class="mb-4">
          <Input 
            v-model="searchQuery" 
            placeholder="Search by name or position..." 
            type="text"
          />
        </div>

        <p v-if="loading" class="text-slate-500">Loading employees...</p>
        <Table v-else :columns="columns" :rows="filteredEmployees" empty-text="No employees found.">
          <template #cell-salary="{ row }">${{ Number(row.salary).toFixed(2) }}</template>
          <template v-if="canManageEmployees" #actions="{ row }">
            <div class="flex gap-2">
              <Button size="sm" variant="ghost" @click="startEdit(row)">Edit</Button>
              <Button size="sm" variant="danger" @click="confirmDelete(row.id)">Delete</Button>
            </div>
          </template>
        </Table>
      </Card>
    </div>

    <p v-if="errorMessage" class="text-sm font-medium text-rose-600">{{ errorMessage }}</p>

    <Modal v-model="showDeleteModal" title="Delete employee">
      <p class="text-sm text-slate-600">Are you sure you want to delete this employee?</p>
      <div class="mt-4 flex justify-end gap-2">
        <Button variant="ghost" @click="showDeleteModal = false">Cancel</Button>
        <Button variant="danger" @click="removeEmployee">Delete</Button>
      </div>
    </Modal>

    <Modal v-model="showImportLog" title="Import Results">
      <div v-if="importLog" class="space-y-4">
        <div class="grid grid-cols-3 gap-4">
          <div class="rounded bg-blue-50 p-3">
            <p class="text-sm text-slate-600">Total Rows</p>
            <p class="text-2xl font-bold text-blue-600">{{ importLog.total_rows }}</p>
          </div>
          <div class="rounded bg-green-50 p-3">
            <p class="text-sm text-slate-600">Success</p>
            <p class="text-2xl font-bold text-green-600">{{ importLog.success_count }}</p>
          </div>
          <div class="rounded bg-red-50 p-3">
            <p class="text-sm text-slate-600">Failed</p>
            <p class="text-2xl font-bold text-red-600">{{ importLog.fail_count }}</p>
          </div>
        </div>

        <div v-if="importLog.success_details.length > 0" class="rounded border border-slate-200">
          <p class="border-b border-slate-200 bg-green-50 px-4 py-2 font-semibold text-green-700">Successfully Created ({{ importLog.success_details.length }})</p>
          <div class="max-h-40 overflow-auto">
            <table class="min-w-[640px] w-full text-sm">
              <tbody>
                <tr v-for="success in importLog.success_details" :key="success.row_number" class="border-b border-slate-200">
                  <td class="px-4 py-2">{{ success.name }}</td>
                  <td class="px-4 py-2 text-slate-600">{{ success.email }}</td>
                  <td class="px-4 py-2 font-mono text-xs text-slate-500">{{ success.password }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="importLog.errors.length > 0" class="rounded border border-slate-200">
          <p class="border-b border-slate-200 bg-red-50 px-4 py-2 font-semibold text-red-700">Errors ({{ importLog.errors.length }})</p>
          <div class="max-h-40 overflow-auto">
            <table class="min-w-[640px] w-full text-sm">
              <tbody>
                <tr v-for="error in importLog.errors" :key="error.row_number" class="border-b border-slate-200">
                  <td class="px-4 py-2 font-mono text-slate-600">Row {{ error.row_number }}</td>
                  <td class="px-4 py-2 text-red-600">{{ error.error }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <Button @click="showImportLog = false">Close</Button>
      </div>
    </Modal>
  </section>
</template>
