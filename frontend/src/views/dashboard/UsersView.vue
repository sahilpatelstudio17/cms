<script setup>
import { onMounted, ref, computed } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useUsersStore } from "../../stores/users";
import { showToast } from "../../services/ui";
import api from "../../services/api";
import Button from "../../components/ui/Button.vue";
import Card from "../../components/ui/Card.vue";
import Input from "../../components/ui/Input.vue";
import Modal from "../../components/ui/Modal.vue";
import Table from "../../components/ui/Table.vue";

const auth = useAuthStore();
const usersStore = useUsersStore();
const showDeleteModal = ref(false);
const showEditModal = ref(false);
const showAddModal = ref(false);
const showImportModal = ref(false);
const showImportResultsModal = ref(false);
const searchQuery = ref("");
const importFile = ref(null);
const importLoading = ref(false);
const importResults = ref({
  success_count: 0,
  failed_count: 0,
  results: [],
});

// const AVAILABLE_ROLES = ["admin", "super_admin", "employee", "manager", "salesman", "developer", "staff"];
const AVAILABLE_ROLES = ["manager", "salesman", "developer", "staff"];

const selectedUser = ref(null);
const editForm = ref({
  name: "",
  email: "",
  role: "",
  status: "",
});

const addForm = ref({
  name: "",
  email: "",
  password: "",
  role: "employee",
  status: "active",
});

const isOwnProfile = computed(() => {
  return selectedUser.value?.id === auth.user?.id;
});

const canChangeRole = computed(() => {
  return auth.user?.role === "super_admin" || (auth.user?.role === "admin" && !isOwnProfile.value);
});

const users = computed(() => usersStore.users);
const loading = computed(() => usersStore.loading);

const filteredUsers = computed(() => {
  return users.value.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

async function loadUsers() {
  try {
    await usersStore.fetchUsers();
  } catch (error) {
    showToast({
      title: "Error",
      message: "Failed to load users",
      type: "error",
    });
  }
}

function openAddModal() {
  addForm.value = {
    name: "",
    email: "",
    password: "",
    role: "employee",
    status: "active",
  };
  showAddModal.value = true;
}

async function addUser() {
  if (!addForm.value.name.trim()) {
    showToast({ title: "Error", message: "Name is required", type: "error" });
    return;
  }
  if (!addForm.value.email.trim()) {
    showToast({ title: "Error", message: "Email is required", type: "error" });
    return;
  }
  if (!addForm.value.password.trim()) {
    showToast({ title: "Error", message: "Password is required", type: "error" });
    return;
  }

  try {
    // If status is "active", create user directly. Otherwise, create approval request
    if (addForm.value.status === "active") {
      // Direct user creation (no approval needed)
      await usersStore.createUser({
        name: addForm.value.name.trim(),
        email: addForm.value.email.trim(),
        password: addForm.value.password,
        role: addForm.value.role,
        status: addForm.value.status,
      });
      showAddModal.value = false;
      showToast({
        title: "Success",
        message: "User created successfully",
        type: "success",
      });
    } else {
      // Create approval request (for pending/inactive status)
      await api.post("/approvals/user/request", {
        name: addForm.value.name.trim(),
        email: addForm.value.email.trim(),
        password: addForm.value.password,
        role: addForm.value.role,
        status: addForm.value.status,
      });
      showAddModal.value = false;
      showToast({
        title: "Success",
        message: "User request submitted for approval",
        type: "success",
      });
      await usersStore.fetchUsers({ force: true });
    }
  } catch (error) {
    showToast({
      title: "Error",
      message: error.response?.data?.error || "Failed to create user",
      type: "error",
    });
  }
}

function openEditModal(user) {
  selectedUser.value = user;
  editForm.value = {
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
  showEditModal.value = true;
}

async function updateUser() {
  if (!isOwnProfile.value || auth.user?.role === "super_admin" || auth.user?.role === "admin") {
    // Allow update of other users or if user is admin/super_admin
    try {
      await usersStore.updateUser(selectedUser.value.id, {
        name: editForm.value.name.trim(),
        email: editForm.value.email.trim(),
        role: editForm.value.role,
        status: editForm.value.status,
      });
      showEditModal.value = false;
      showToast({
        title: "Success",
        message: "User updated successfully",
        type: "success",
      });
    } catch (error) {
      showToast({
        title: "Error",
        message: error.response?.data?.error || "Failed to update user",
        type: "error",
      });
    }
  } else {
    showToast({
      title: "Error",
      message: "You cannot change your own role",
      type: "error",
    });
  }
}

async function deleteUser() {
  try {
    await usersStore.deleteUser(selectedUser.value.id);
    showDeleteModal.value = false;
    showToast({
      title: "Success",
      message: "User deleted successfully",
      type: "success",
    });
  } catch (error) {
    showToast({
      title: "Error",
      message: error.response?.data?.error || "Failed to delete user",
      type: "error",
    });
  }
}

function openDeleteModal(user) {
  selectedUser.value = user;
  showDeleteModal.value = true;
}

function openImportModal() {
  importFile.value = null;
  showImportModal.value = true;
}

async function handleFileUpload(event) {
  const file = event.target.files?.[0];
  if (file) {
    importFile.value = file;
  }
}

async function importUsers() {
  if (!importFile.value) {
    showToast({
      title: "Error",
      message: "Please select a file",
      type: "error",
    });
    return;
  }

  importLoading.value = true;
  const formData = new FormData();
  formData.append("file", importFile.value);

  try {
    const response = await usersStore.importUsers(formData);

    const { success_count, failed_count, results } = response;

    importResults.value = {
      success_count,
      failed_count,
      results: results || [],
    };

    showImportModal.value = false;
    showImportResultsModal.value = true;
  } catch (error) {
    showToast({
      title: "Error",
      message: error.response?.data?.error || "Failed to import users",
      type: "error",
    });
  } finally {
    importLoading.value = false;
  }
}

function downloadSampleTemplate() {
  const sampleData = [
    ["Name", "Email", "Role", "Status"],
    ["John Smith", "john.smith@company.com", "salesman", "active"],
    ["Sarah Developer", "sarah.dev@company.com", "developer", "active"],
    ["Mike Staff", "mike.staff@company.com", "staff", "active"],
    ["Jane Manager", "jane.manager@company.com", "manager", "active"],
    ["Bob Employee", "bob.employee@company.com", "employee", "active"],
  ];

  // Create CSV content
  const csvContent = sampleData
    .map(row => row.map(cell => `"${cell}"`).join(","))
    .join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "users_template.csv";
  link.click();
  URL.revokeObjectURL(link.href);

  showToast({
    title: "Template Downloaded",
    message: "Sample file downloaded. Edit it and import!",
    type: "success",
  });
}

onMounted(() => {
  loadUsers();
});
</script>

<template>
  <section class="space-y-6">
    <header class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-semibold">Users</h2>
        <p class="mt-1 text-sm text-slate-500">Manage system users and permissions.</p>
      </div>
      <div class="flex gap-2">
        <Button v-if="auth.user?.role === 'admin' || auth.user?.role === 'super_admin'" @click="openAddModal">
          + Add User
        </Button>
        <Button v-if="auth.user?.role === 'admin' || auth.user?.role === 'super_admin'" variant="secondary" @click="openImportModal">
          📥 Import Excel
        </Button>
      </div>
    </header>

    <Card>
      <div class="mb-6">
        <Input v-model="searchQuery" placeholder="Search users by name or email..." />
      </div>

      <div v-if="loading" class="text-slate-500">Loading users...</div>
      <div v-else-if="filteredUsers.length === 0" class="text-center py-8 text-slate-500">
        No users found
      </div>
      <Table v-else>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td class="font-medium">{{ user.name }}</td>
            <td class="text-slate-600">{{ user.email }}</td>
            <td>
              <span class="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                {{ user.role }}
              </span>
            </td>
            <td>
              <span :class="[
                'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
                user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
              ]">
                {{ user.status }}
              </span>
            </td>
            <td>
              <div class="flex justify-end gap-2">
                <Button v-if="auth.user?.role !== 'employee'" variant="secondary" size="sm" @click="openEditModal(user)">
                  Edit
                </Button>
                <Button v-if="auth.user?.role === 'super_admin'" variant="danger" size="sm" @click="openDeleteModal(user)">
                  Delete
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
    </Card>

    <!-- Add User Modal -->
    <Modal v-model="showAddModal" title="Add New User">
      <div class="space-y-4">
        <Input v-model="addForm.name" label="Name" placeholder="John Doe" required />
        <Input v-model="addForm.email" label="Email" type="email" placeholder="john@example.com" required />
        <Input v-model="addForm.password" label="Password" type="password" placeholder="Enter password" required />
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Role</label>
          <select v-model="addForm.role" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option v-for="role in AVAILABLE_ROLES" :key="role" :value="role">
              {{ role.charAt(0).toUpperCase() + role.slice(1) }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select v-model="addForm.status" class="w-full px-3 py-2 border border-slate-300 rounded-lg">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>
      <div class="mt-6 flex justify-end gap-2">
        <Button variant="ghost" @click="showAddModal = false">Cancel</Button>
        <Button @click="addUser">Add User</Button>
      </div>
    </Modal>

    <!-- Edit User Modal -->
    <Modal v-model="showEditModal" title="Edit User">
      <div class="space-y-4">
        <Input v-model="editForm.name" label="Name" required />
        <Input v-model="editForm.email" label="Email" type="email" required />
        
        <!-- Warning if editing own role -->
        <div v-if="isOwnProfile" class="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p class="text-sm text-yellow-800">⚠️ You cannot change your own role</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Role</label>
          <select v-model="editForm.role" :disabled="isOwnProfile" class="w-full px-3 py-2 border border-slate-300 rounded-lg" :class="{ 'opacity-50 cursor-not-allowed': isOwnProfile }">
            <option v-for="role in AVAILABLE_ROLES" :key="role" :value="role">
              {{ role.charAt(0).toUpperCase() + role.slice(1) }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select v-model="editForm.status" class="w-full px-3 py-2 border border-slate-300 rounded-lg">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>
      <div class="mt-6 flex justify-end gap-2">
        <Button variant="ghost" @click="showEditModal = false">Cancel</Button>
        <Button @click="updateUser">Save Changes</Button>
      </div>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal v-model="showDeleteModal" title="Delete User">
      <p class="text-slate-600">Are you sure you want to delete <strong>{{ selectedUser?.name }}</strong>? This action cannot be undone.</p>
      <div class="mt-6 flex justify-end gap-2">
        <Button variant="ghost" @click="showDeleteModal = false">Cancel</Button>
        <Button variant="danger" @click="deleteUser">Delete</Button>
      </div>
    </Modal>

    <!-- Import Excel Modal -->
    <Modal v-model="showImportModal" title="Import Users from Excel">
      <div class="space-y-4">
        <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm text-blue-800 font-medium mb-2">📋 Required columns (in this exact order):</p>
          <div class="overflow-x-auto">
          <table class="min-w-[640px] w-full text-xs text-blue-700">
            <tr>
              <td class="font-semibold pr-2">Column 1:</td>
              <td><strong>Name</strong> - Employee full name</td>
            </tr>
            <tr>
              <td class="font-semibold pr-2">Column 2:</td>
              <td><strong>Email</strong> - Valid email address</td>
            </tr>
            <tr>
              <td class="font-semibold pr-2">Column 3:</td>
              <td><strong>Role</strong> - One of: salesman, developer, staff, manager, employee, admin, super_admin</td>
            </tr>
            <tr>
              <td class="font-semibold pr-2">Column 4:</td>
              <td><strong>Status</strong> - One of: active, inactive, pending</td>
            </tr>
          </table>
          </div>
        </div>

        <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-xs text-green-700 font-medium mb-3">✓ Example data:</p>
          <code class="text-xs block bg-white p-2 rounded border border-green-200 font-mono text-green-900">
            Name | Email | Role | Status<br/>
            John Smith | john@company.com | salesman | active<br/>
            Sarah Dev | sarah@company.com | developer | active<br/>
            Mike Staff | mike@company.com | staff | active<br/>
          </code>
        </div>

        <div class="flex gap-2">
          <Button variant="secondary" size="sm" @click="downloadSampleTemplate" class="flex-1">
            📥 Download Template
          </Button>
        </div>

        <div class="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
          <input 
            type="file" 
            @change="handleFileUpload" 
            accept=".xlsx,.xls,.csv" 
            class="hidden"
            id="fileInput"
          />
          <label for="fileInput" class="cursor-pointer block">
            <p class="text-slate-600">📁 Click to select file or drag and drop</p>
            <p class="text-xs text-slate-500 mt-1">Supports .xlsx, .xls, .csv</p>
            <p v-if="importFile" class="mt-2 text-green-600 text-sm font-medium">✓ {{ importFile.name }}</p>
          </label>
        </div>
      </div>
      <div class="mt-6 flex justify-end gap-2">
        <Button variant="ghost" @click="showImportModal = false">Cancel</Button>
        <Button :disabled="!importFile || importLoading" @click="importUsers">
          {{ importLoading ? "Importing..." : "Import Users" }}
        </Button>
      </div>
    </Modal>

    <!-- Import Results Modal -->
    <Modal v-model="showImportResultsModal" title="Import Results" :closeable="true">
      <div class="space-y-4">
        <!-- Summary Stats -->
        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p class="text-2xl font-bold text-green-600">{{ importResults.success_count }}</p>
            <p class="text-sm text-green-700">Users Added</p>
          </div>
          <div class="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
            <p class="text-2xl font-bold text-red-600">{{ importResults.failed_count }}</p>
            <p class="text-sm text-red-700">Users Failed</p>
          </div>
        </div>

        <!-- Successful Imports -->
        <div v-if="importResults.results.some(r => r.Success)" class="border-t pt-4">
          <h3 class="font-semibold text-green-700 mb-2">✓ Successfully Added</h3>
          <div class="space-y-2 max-h-48 overflow-y-auto">
            <div v-for="result in importResults.results.filter(r => r.Success)" :key="`success-${result.RowNumber}`" class="p-2 bg-green-50 rounded text-sm">
              <p class="font-medium text-green-900">{{ result.UserData.Name }}</p>
              <p class="text-xs text-green-600">{{ result.UserData.Email }} • {{ result.UserData.Role }} • Row {{ result.RowNumber }}</p>
            </div>
          </div>
        </div>

        <!-- Failed Imports -->
        <div v-if="importResults.results.some(r => !r.Success)" class="border-t pt-4">
          <h3 class="font-semibold text-red-700 mb-2">✗ Failed Imports & Reasons</h3>
          <div class="space-y-2 max-h-48 overflow-y-auto">
            <div v-for="result in importResults.results.filter(r => !r.Success)" :key="`failed-${result.RowNumber}`" class="p-3 bg-red-50 border border-red-200 rounded text-sm">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <p class="font-medium text-red-900">Row {{ result.RowNumber }}</p>
                  <p class="text-xs text-red-600 mt-1">
                    <span class="font-semibold">Name:</span> {{ result.UserData.Name || '(empty)' }}
                  </p>
                  <p class="text-xs text-red-600">
                    <span class="font-semibold">Email:</span> {{ result.UserData.Email || '(empty)' }}
                  </p>
                  <p class="text-xs text-red-600">
                    <span class="font-semibold">Role:</span> {{ result.UserData.Role || '(empty)' }}
                  </p>
                  <p class="text-xs text-red-700 font-semibold mt-2 bg-red-100 p-2 rounded">
                    ❌ Error: {{ result.ErrorMsg }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Instructions for Failed Rows -->
        <div v-if="importResults.failed_count > 0" class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p class="text-sm font-semibold text-yellow-800 mb-2">📋 To Fix Failed Rows:</p>
          <ul class="text-xs text-yellow-700 space-y-1">
            <li>✓ Check each row number listed above</li>
            <li>✓ Fix the errors shown (invalid role, duplicate email, missing data, etc.)</li>
            <li>✓ Download the template to see valid role options</li>
            <li>✓ Re-import the corrected file</li>
          </ul>
        </div>
      </div>
      <div class="mt-6 flex justify-end gap-2">
        <Button @click="showImportResultsModal = false">Close</Button>
      </div>
    </Modal>
  </section>
</template>