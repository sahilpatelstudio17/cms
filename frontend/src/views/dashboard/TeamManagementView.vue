<script setup>
import { computed, onMounted, ref } from "vue";

import Button from "../../components/ui/Button.vue";
import Card from "../../components/ui/Card.vue";
import Input from "../../components/ui/Input.vue";
import Modal from "../../components/ui/Modal.vue";
import Table from "../../components/ui/Table.vue";
import api from "../../services/api";
import { showToast } from "../../services/ui";
import { useAuthStore } from "../../stores/auth";
import { useEmployeesStore } from "../../stores/employees";

const auth = useAuthStore();
const employeesStore = useEmployeesStore();
const saving = ref(false);
const errorMessage = ref("");
const editingId = ref(null);
const deletingEmployeeId = ref(null);
const showDeleteModal = ref(false);
const showEditModal = ref(false);
const activeTab = ref("all"); // all, manager, salesman, developer, staff
const employees = computed(() => employeesStore.employees);
const loading = computed(() => employeesStore.loading);

const form = ref({
  name: "",
  position: "",
  role: "",
  salary: "",
  email: "", // Email for user account creation
});

const isEditing = computed(() => editingId.value !== null);
const canManage = computed(() => auth.isAdmin);

// Filter employees by role
const roleFilterMap = {
  manager: "manager",
  salesman: "salesman",
  developer: "developer",
  staff: "staff",
};

const filteredEmployees = computed(() => {
  if (activeTab.value === "all") {
    return employees.value;
  }
  const roleToFilter = roleFilterMap[activeTab.value];
  return employees.value.filter(emp => 
    emp.role && emp.role.toLowerCase() === roleToFilter.toLowerCase()
  );
});

const columns = [
  { key: "name", label: "Name" },
  { key: "position", label: "Position" },
  { key: "role", label: "Role" },
  { key: "salary", label: "Salary" },
];

async function loadEmployees() {
  errorMessage.value = "";
  try {
    await employeesStore.fetchEmployees();
  } catch (error) {
    console.error("Failed to load employees:", error);
    errorMessage.value = error?.message || "Failed to load employees";
  }
}

function openForm() {
  editingId.value = null;
  form.value = { name: "", position: "", role: "", salary: "" };
  showEditModal.value = true;
}

function openEdit(employee) {
  editingId.value = employee.id;
  form.value = { ...employee };
  showEditModal.value = true;
}

async function saveEmployee() {
  if (!form.value.name.trim() || !form.value.position || !form.value.salary) {
    errorMessage.value = "Name, position, and salary are required";
    return;
  }

  // If assigning a role, email is required
  if (form.value.role && !form.value.email.trim()) {
    errorMessage.value = "Email is required when assigning a role";
    return;
  }

  saving.value = true;
  errorMessage.value = "";
  try {
    if (isEditing.value) {
      // Editing existing employee
      await employeesStore.editEmployee(editingId.value, {
        name: form.value.name,
        position: form.value.position,
        salary: form.value.salary,
        role: form.value.role,
      });
      
      showToast({ 
        title: "Employee updated successfully", 
        type: "success" 
      });
    } else {
      // Creating new employee
      const created = await employeesStore.addEmployee({
        name: form.value.name,
        position: form.value.position,
        salary: form.value.salary,
        role: form.value.role,
      });
      
      // If role was assigned, send approval request
      if (form.value.role && form.value.email.trim()) {
        try {
          await api.post("/role-assignments/request", {
            employee_id: created.id,
            requested_role: form.value.role,
            requested_email: form.value.email.trim(),
          });
          
          showToast({ 
            title: "Employee created",
            message: "Role assignment request sent to admin for approval",
            type: "success" 
          });
        } catch (approvalError) {
          showToast({
            title: "Warning",
            message: "Employee created but role request failed: " + approvalError?.message,
            type: "warning"
          });
        }
      } else {
        showToast({ 
          title: "Employee created successfully", 
          type: "success" 
        });
      }
    }
    
    showEditModal.value = false;
    editingId.value = null;
  } catch (error) {
    errorMessage.value = error?.message || "Failed to save employee";
    showToast({ title: "Error", message: errorMessage.value, type: "error" });
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
    await employeesStore.removeEmployee(deletingEmployeeId.value);
    showToast({ title: "Employee deleted successfully", type: "success" });
  } catch (error) {
    errorMessage.value = error?.message || "Failed to delete employee";
  } finally {
    showDeleteModal.value = false;
    deletingEmployeeId.value = null;
  }
}

onMounted(() => {
  loadEmployees();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Team Management</h1>
        <p class="mt-2 text-sm text-slate-500">Manage Sales, Developers, and Staff</p>
      </div>
      <!-- <Button v-if="canManage" @click="openForm">
        + Add Employee
      </Button> -->
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 border-b border-slate-200">
      <button
        @click="activeTab = 'all'"
        :class="[
          'px-4 py-2 font-medium text-sm border-b-2 transition',
          activeTab === 'all'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-slate-600 hover:text-slate-900'
        ]"
      >
        All Employees ({{ employees.length }})
      </button>
      <button
        @click="activeTab = 'manager'"
        :class="[
          'px-4 py-2 font-medium text-sm border-b-2 transition',
          activeTab === 'manager'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-slate-600 hover:text-slate-900'
        ]"
      >
        Managers ({{ employees.filter(e => e.role && e.role.toLowerCase() === 'manager').length }})
      </button>
      <button
        @click="activeTab = 'salesman'"
        :class="[
          'px-4 py-2 font-medium text-sm border-b-2 transition',
          activeTab === 'salesman'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-slate-600 hover:text-slate-900'
        ]"
      >
        Salesmen ({{ employees.filter(e => e.role && e.role.toLowerCase() === 'salesman').length }})
      </button>
      <button
        @click="activeTab = 'developer'"
        :class="[
          'px-4 py-2 font-medium text-sm border-b-2 transition',
          activeTab === 'developer'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-slate-600 hover:text-slate-900'
        ]"
      >
        Developers ({{ employees.filter(e => e.role && e.role.toLowerCase() === 'developer').length }})
      </button>
      <button
        @click="activeTab = 'staff'"
        :class="[
          'px-4 py-2 font-medium text-sm border-b-2 transition',
          activeTab === 'staff'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-slate-600 hover:text-slate-900'
        ]"
      >
        Staff ({{ employees.filter(e => e.role && e.role.toLowerCase() === 'staff').length }})
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="rounded-md bg-red-50 p-4 text-sm text-red-800">
      {{ errorMessage }}
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="text-slate-500">Loading employees...</div>
    </div>

    <!-- Employees Table -->
    <div v-else>
      <Card>
        <Table
          :columns="columns"
          :rows="filteredEmployees"
          :loading="loading"
        >
          <template #actions="{ row }">
            <div class="flex gap-2">
              <Button
                v-if="canManage"
                variant="ghost"
                size="sm"
                @click="openEdit(row)"
              >
                Edit
              </Button>
              <Button
                v-if="canManage"
                variant="ghost"
                size="sm"
                class="bg-slate-100 text-slate-700 hover:bg-slate-200"
                @click="confirmDelete(row.id)"
              >
                Delete
              </Button>
            </div>
          </template>
        </Table>
      </Card>

      <!-- Empty State -->
      <div v-if="filteredEmployees.length === 0" class="rounded-md bg-slate-50 p-8 text-center">
        <p class="text-slate-500">
          <span v-if="activeTab === 'all'">No employees added yet for your company.</span>
          <span v-else-if="activeTab === 'manager'">No managers in your company.</span>
          <span v-else-if="activeTab === 'salesman'">No salesmen in your company.</span>
          <span v-else-if="activeTab === 'developer'">No developers in your company.</span>
          <span v-else-if="activeTab === 'staff'">No staff members in your company.</span>
        </p>
        <!-- <Button v-if="canManage" @click="openForm" class="mt-4">
          + Add Employee
        </Button> -->
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Modal v-model="showEditModal" :title="isEditing ? 'Edit Employee' : 'Add New Employee'">
      <div v-if="errorMessage" class="rounded-md bg-red-50 p-3 text-sm text-red-800 mb-4">
        {{ errorMessage }}
      </div>
      <div class="space-y-4">
        <Input
          v-model="form.name"
          label="Name"
          placeholder="Enter employee name"
          type="text"
          required
        />

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Position</label>
          <select
            v-model="form.position"
            class="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          >
            <option value="">Select Position</option>
            <!-- <option value="Salesman">Salesman</option>
            <option value="Developer">Developer</option>
            <option value="Staff">Staff</option>
            <option value="Manager">Manager</option> -->
            <option value="Employee">Employee</option>
            <option value="Intern">Intern</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Role</label>
          <select
            v-model="form.role"
            class="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select Role (optional)</option>
            <option value="manager">Manager</option>
            <option value="salesman">Salesman</option>
            <option value="developer">Developer</option>
            <option value="staff">Staff</option>
            <!-- <option value="employee">Employee</option> -->
          </select>
          <p class="text-xs text-slate-500 mt-1">If you assign a role, an approval request will be sent to the admin</p>
        </div>

        <Input
          v-if="form.role"
          v-model="form.email"
          label="Email (for user account)"
          placeholder="user@gmail.com"
          type="email"
          required
        />

        <Input
          v-model.number="form.salary"
          label="Salary"
          placeholder="Enter salary"
          type="number"
          required
        />

        <div class="flex gap-2 pt-4">
          <Button @click="saveEmployee" :disabled="saving">
            {{ saving ? "Saving..." : isEditing ? "Update Employee" : "Create Employee" }}
          </Button>
          <Button variant="ghost" @click="showEditModal = false">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal v-model="showDeleteModal" title="Delete Employee">
      <div class="space-y-4">
        <p class="text-slate-600">
          Are you sure you want to delete this employee? This action cannot be undone.
        </p>
        <div class="flex gap-2 pt-4">
          <Button
            variant="danger"
            @click="removeEmployee"
            :disabled="loading"
          >
            Yes, Delete Employee
          </Button>
          <Button variant="ghost" @click="showDeleteModal = false">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
