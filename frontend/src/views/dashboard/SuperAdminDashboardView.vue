<template>
  <div class="min-h-screen bg-slate-50 p-4 sm:p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="mb-2 text-3xl font-bold text-slate-900">Super Admin Dashboard</h1>
      <p class="text-slate-600">Manage administrators and monitor system</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">Total Admins</p>
            <p class="mt-2 text-3xl font-bold text-slate-900">{{ adminCount }}</p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">Companies</p>
            <p class="mt-2 text-3xl font-bold text-slate-900">1</p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100">
            <svg class="h-6 w-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5.581m0 0H9m0 0h5.581M9 9h.008v.008H9V9m5 0h.008v.008h-.008V9m-9 5h.008v.008H5V14m5 0h.008v.008h-.008V14m5 0h.008v.008h-.008V14" />
            </svg>
          </div>
        </div>
      </Card>

      <Card>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">System Status</p>
            <p class="mt-2 text-3xl font-bold text-slate-900">
              <span class="text-green-600">●</span> Online
            </p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </Card>
    </div>

    <!-- Admins Management -->
    <Card>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-slate-900">Manage Admins</h2>
        <Button @click="showCreateForm = true" variant="primary">+ Create Admin</Button>
      </div>

      <!-- Create Admin Form -->
      <div v-if="showCreateForm" class="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <h3 class="mb-4 text-lg font-semibold text-slate-900">Create New Admin</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            v-model="newAdmin.name"
            label="Name"
            placeholder="Admin Name"
            required
            :error="nameError"
            @blur="markCreateTouched('name')"
          />
          <Input
            v-model="newAdmin.email"
            label="Email"
            type="email"
            placeholder="admin@company.com"
            required
            :error="emailError"
            @blur="markCreateTouched('email')"
          />
          <Input
            v-model="newAdmin.password"
            label="Password"
            type="password"
            placeholder="Secure Password"
            required
            :error="passwordError"
            @blur="markCreateTouched('password')"
          />
        </div>
        <div class="flex gap-2">
          <Button @click="createAdmin" variant="primary" :loading="saving">Create</Button>
          <Button @click="showCreateForm = false; resetCreateForm()" variant="secondary">Cancel</Button>
        </div>
      </div>

      <!-- Admins Table -->
      <div class="overflow-x-auto">
        <table class="min-w-[760px] w-full text-left text-sm">
          <thead class="border-b border-slate-200">
            <tr>
              <th class="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap sm:px-6">Name</th>
              <th class="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap sm:px-6">Email</th>
              <th class="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap sm:px-6">Role</th>
              <th class="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap sm:px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="admin in admins" :key="admin.id" class="border-b border-slate-200 hover:bg-slate-50">
              <td class="px-4 py-3 text-slate-900 whitespace-nowrap sm:px-6">{{ admin.name }}</td>
              <td class="px-4 py-3 text-slate-600 whitespace-nowrap sm:px-6">{{ admin.email }}</td>
              <td class="px-4 py-3 whitespace-nowrap sm:px-6">
                <span class="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">{{ admin.role }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap sm:px-6">
                <Button @click="confirmDelete(admin)" variant="danger" size="sm">Delete</Button>
              </td>
            </tr>
            <tr v-if="admins.length === 0">
              <td colspan="4" class="px-4 py-3 text-center text-slate-500 sm:px-6">No admins found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>

    <!-- Delete Confirmation Modal -->
    <Modal v-model="showDeleteModal" title="Confirm Delete">
      <p class="mb-4 text-slate-700">Are you sure you want to delete admin <strong>{{ selectedAdmin?.name }}</strong>?</p>
      <div class="flex gap-2 justify-end">
        <Button @click="showDeleteModal = false" variant="secondary">Cancel</Button>
        <Button @click="deleteAdmin" variant="danger" :loading="saving">Delete</Button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useAdminsStore } from "../../stores/admins";
import { showToast } from "../../services/ui";
import Card from "../../components/ui/Card.vue";
import Button from "../../components/ui/Button.vue";
import Input from "../../components/ui/Input.vue";
import Modal from "../../components/ui/Modal.vue";
import { runRules, sanitizeLeadingWhitespace, validators } from "../../utils/validation";

const auth = useAuthStore();
const adminsStore = useAdminsStore();
const admins = computed(() => adminsStore.admins);
const adminCount = computed(() => adminsStore.adminCount);
const newAdmin = ref({ name: "", email: "", password: "" });
const createTouched = ref({ name: false, email: false, password: false });
const showCreateForm = ref(false);
const saving = ref(false);
const showDeleteModal = ref(false);
const selectedAdmin = ref(null);

const nameRules = [
  validators.required("Name"),
  validators.noLeadingWhitespace("Name"),
  validators.minLength(2, "Name must be at least 2 characters."),
];

const emailRules = [
  validators.required("Email"),
  validators.noLeadingWhitespace("Email"),
  validators.email(),
];

const passwordRules = [
  validators.required("Password"),
  validators.noLeadingWhitespace("Password"),
  validators.passwordStrength({ minLength: 8 }),
];

const nameError = computed(() => {
  if (!createTouched.value.name) return "";
  return runRules(newAdmin.value.name, nameRules);
});

const emailError = computed(() => {
  if (!createTouched.value.email) return "";
  return runRules(newAdmin.value.email, emailRules);
});

const passwordError = computed(() => {
  if (!createTouched.value.password) return "";
  return runRules(newAdmin.value.password, passwordRules);
});

const isCreateFormValid = computed(() => !nameError.value && !emailError.value && !passwordError.value);

onMounted(async () => {
  await loadAdmins();
});

const loadAdmins = async () => {
  try {
    await adminsStore.fetchAdmins();
  } catch (error) {
    showToast({
      title: "Error",
      message: "Failed to load admins",
      type: "error",
    });
  }
};

const markCreateTouched = (field) => {
  createTouched.value[field] = true;
  if (field === "name") {
    newAdmin.value.name = sanitizeLeadingWhitespace(newAdmin.value.name);
  }
  if (field === "email") {
    newAdmin.value.email = sanitizeLeadingWhitespace(newAdmin.value.email);
  }
  if (field === "password") {
    newAdmin.value.password = sanitizeLeadingWhitespace(newAdmin.value.password);
  }
};

const resetCreateForm = () => {
  newAdmin.value = { name: "", email: "", password: "" };
  createTouched.value = { name: false, email: false, password: false };
};

const createAdmin = async () => {
  createTouched.value = { name: true, email: true, password: true };
  newAdmin.value.name = sanitizeLeadingWhitespace(newAdmin.value.name);
  newAdmin.value.email = sanitizeLeadingWhitespace(newAdmin.value.email);
  newAdmin.value.password = sanitizeLeadingWhitespace(newAdmin.value.password);

  if (!isCreateFormValid.value) {
    showToast({ title: "Error", message: "Please fix validation errors.", type: "error" });
    return;
  }

  saving.value = true;
  try {
    await adminsStore.createAdmin({
      name: newAdmin.value.name,
      email: newAdmin.value.email,
      password: newAdmin.value.password,
    });

    showToast({
      title: "Success",
      message: "Admin created successfully",
      type: "success",
    });

    resetCreateForm();
    showCreateForm.value = false;
    await loadAdmins();
  } catch (error) {
    showToast({
      title: "Error",
      message: error.response?.data?.message || "Failed to create admin",
      type: "error",
    });
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (admin) => {
  selectedAdmin.value = admin;
  showDeleteModal.value = true;
};

const deleteAdmin = async () => {
  if (!selectedAdmin.value) return;

  saving.value = true;
  try {
    await adminsStore.deleteAdmin(selectedAdmin.value.id);

    showToast({
      title: "Success",
      message: "Admin deleted successfully",
      type: "success",
    });

    showDeleteModal.value = false;
    selectedAdmin.value = null;
    await loadAdmins();
  } catch (error) {
    showToast({
      title: "Error",
      message: error.response?.data?.message || "Failed to delete admin",
      type: "error",
    });
  } finally {
    saving.value = false;
  }
};
</script>
