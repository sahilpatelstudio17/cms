<script setup>
import { computed, onMounted, ref } from "vue";

import Button from "../../components/ui/Button.vue";
import Card from "../../components/ui/Card.vue";
import Input from "../../components/ui/Input.vue";
import Modal from "../../components/ui/Modal.vue";
import { showToast } from "../../services/ui";
import { useAuthStore } from "../../stores/auth";
import { useEmployeesStore } from "../../stores/employees";
import { useTasksStore } from "../../stores/tasks";

const auth = useAuthStore();
const tasksStore = useTasksStore();
const employeesStore = useEmployeesStore();
const saving = ref(false);
const errorMessage = ref("");
const tasks = computed(() => tasksStore.tasks);
const employees = computed(() => employeesStore.employees);
const loading = computed(() => tasksStore.loading || employeesStore.loading);
const editingId = ref(null);
const deletingTaskId = ref(null);
const showDeleteModal = ref(false);
const taskFilter = ref("all");

const canManageTasks = computed(() => auth.userRole === "admin" || auth.userRole === "manager");

const currentUserEmployeeId = computed(() => {
  const employee = employees.value.find((emp) => emp.name === auth.userName);
  return employee?.id;
});

const filteredTasks = computed(() => {
  if (taskFilter.value === "my") {
    if (!currentUserEmployeeId.value) return [];
    return tasks.value.filter((task) => task.assigned_to === currentUserEmployeeId.value);
  }

  return tasks.value;
});

function canChangeTaskStatus(task) {
  // Manager/Admin can change any task status
  if (canManageTasks.value) return true;
  // Other users can only change status of tasks assigned to them
  return task.assigned_to === currentUserEmployeeId.value;
}

function setTaskFilter(mode) {
  taskFilter.value = mode;
}

const form = ref({
  title: "",
  description: "",
  status: "pending",
  assigned_to: "",
});

const isEditing = computed(() => editingId.value !== null);

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
];

async function loadPageData() {
  errorMessage.value = "";
  try {
    await Promise.all([
      tasksStore.fetchTasks(),
      employeesStore.fetchEmployees(),
    ]);
  } catch (error) {
    errorMessage.value = error?.message || "Failed to load tasks data.";
  }
}

function resetForm() {
  editingId.value = null;
  form.value = {
    title: "",
    description: "",
    status: "pending",
    assigned_to: employees.value[0]?.id ? String(employees.value[0].id) : "",
  };
}

function startEdit(task) {
  if (!canManageTasks.value) return;
  editingId.value = task.id;
  form.value = {
    title: task.title,
    description: task.description || "",
    status: task.status,
    assigned_to: String(task.assigned_to),
  };
}

function employeeNameById(id) {
  const employee = employees.value.find((item) => item.id === id);
  return employee?.name || "Unknown";
}

function validateTaskForm(payload) {
  if (!payload.title) {
    return "Please fill title field";
  }
  if (payload.title.length < 2) {
    return "Title must be at least 2 characters";
  }
  if (!payload.assigned_to) {
    return "Please select assigned employee";
  }
  if (payload.description && payload.description.length > 3000) {
    return "Description must be 3000 characters or less";
  }
  return "";
}

function mapTaskValidationError(error) {
  const rawMessage = String(error?.message || error?.details?.error || error?.details?.message || "");
  const normalized = rawMessage.toLowerCase();

  if (!rawMessage) return "Failed to save task.";

  if (normalized.includes("title")) {
    return normalized.includes("min")
      ? "Title must be at least 2 characters"
      : "Please fill title field";
  }
  if (normalized.includes("assigned_to") || normalized.includes("assigned to")) {
    return "Please select assigned employee";
  }
  if (normalized.includes("description") && normalized.includes("max")) {
    return "Description must be 3000 characters or less";
  }

  return rawMessage;
}

async function submitForm() {
  errorMessage.value = "";
  const payload = {
    title: form.value.title.trim(),
    description: form.value.description.trim(),
    status: form.value.status,
    assigned_to: Number(form.value.assigned_to),
  };

  const validationError = validateTaskForm(payload);
  if (validationError) {
    errorMessage.value = validationError;
    return;
  }

  saving.value = true;
  try {
    if (isEditing.value) {
      await tasksStore.editTask(editingId.value, payload);
      showToast({ title: "Task updated", type: "success" });
    } else {
      await tasksStore.addTask(payload);
      showToast({ title: "Task created", type: "success" });
    }
    resetForm();
  } catch (error) {
    errorMessage.value = mapTaskValidationError(error);
  } finally {
    saving.value = false;
  }
}

async function changeTaskStatus(task, status) {
  if (!canChangeTaskStatus(task)) {
    errorMessage.value = "You can only change status of tasks assigned to you.";
    return;
  }
  try {
    await tasksStore.editTask(task.id, {
      title: task.title,
      description: task.description || "",
      status,
      assigned_to: task.assigned_to,
    });
    showToast({ title: "Task status updated", type: "success" });
  } catch (error) {
    errorMessage.value = error?.message || "Failed to update task status.";
  }
}

function confirmDeleteTask(id) {
  deletingTaskId.value = id;
  showDeleteModal.value = true;
}

async function removeTask() {
  if (!deletingTaskId.value) return;

  try {
    await tasksStore.removeTask(deletingTaskId.value);
    showToast({ title: "Task deleted", type: "success" });
  } catch (error) {
    errorMessage.value = error?.message || "Failed to delete task.";
  } finally {
    showDeleteModal.value = false;
    deletingTaskId.value = null;
  }
}

onMounted(async () => {
  await loadPageData();
  resetForm();
});
</script>

<template>
  <section class="space-y-6">
    <header>
      <h2 class="text-2xl font-semibold">Tasks</h2>
      <p class="mt-1 text-sm text-slate-500">
        <span v-if="canManageTasks">Create tasks, assign team members, and track progress.</span>
        <span v-else>View and track assigned tasks.</span>
      </p>
    </header>

    <div class="grid gap-6" :class="canManageTasks ? 'lg:grid-cols-[370px_1fr]' : 'lg:grid-cols-1'">
      <!-- Create Task Form - Only for Manager/Admin -->
      <Card v-if="canManageTasks">
        <h3 class="text-lg font-semibold">{{ isEditing ? "Edit Task" : "Create Task" }}</h3>
        <form class="mt-4 space-y-3" @submit.prevent="submitForm">
          <Input v-model="form.title" label="Title" required />

          <label class="block text-sm font-medium text-slate-700">
            Description
            <textarea
              v-model="form.description"
              rows="4"
              class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-brand-500 focus:ring"
            />
          </label>

          <label class="block text-sm font-medium text-slate-700">
            Assigned Employee
            <select
              v-model="form.assigned_to"
              required
              class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-brand-500 focus:ring"
            >
              <option value="" disabled>Select employee</option>
              <option v-for="employee in employees" :key="employee.id" :value="String(employee.id)">
                {{ employee.name }}
              </option>
            </select>
          </label>

          <label class="block text-sm font-medium text-slate-700">
            Status
            <select
              v-model="form.status"
              class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-brand-500 focus:ring"
            >
              <option v-for="status in statusOptions" :key="status.value" :value="status.value">
                {{ status.label }}
              </option>
            </select>
          </label>

          <div class="flex gap-2 pt-2">
            <Button type="submit" :loading="saving">{{ isEditing ? "Update" : "Create" }}</Button>
            <Button v-if="isEditing" variant="ghost" type="button" @click="resetForm">Cancel</Button>
          </div>
        </form>
      </Card>

      <!-- Task List - Visible to All Roles -->
      <Card>
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold">Task List</h3>
          <div class="flex items-center gap-2">
            <div class="inline-flex rounded-lg border border-slate-300 p-1">
              <button
                type="button"
                class="rounded-md px-3 py-1.5 text-xs font-semibold transition"
                :class="taskFilter === 'my' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
                @click="setTaskFilter('my')"
              >
                My Tasks
              </button>
              <button
                type="button"
                class="rounded-md px-3 py-1.5 text-xs font-semibold transition"
                :class="taskFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'"
                @click="setTaskFilter('all')"
              >
                All Tasks
              </button>
            </div>
            <Button variant="secondary" size="sm" @click="loadPageData">Refresh</Button>
          </div>
        </div>

        <p v-if="loading" class="text-slate-500">Loading tasks...</p>
        <div v-else class="space-y-3">
          <article v-for="task in filteredTasks" :key="task.id" class="rounded-xl border border-slate-200 p-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h4 class="font-semibold text-slate-900">{{ task.title }}</h4>
                <p class="mt-1 text-sm text-slate-600">{{ task.description || "No description" }}</p>
                <p class="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Assigned to: {{ employeeNameById(task.assigned_to) }}
                </p>
              </div>

              <!-- Status Dropdown - Only editable by assigned user or manager/admin -->
              <select
                class="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold uppercase"
                :value="task.status"
                :disabled="!canChangeTaskStatus(task)"
                @change="changeTaskStatus(task, $event.target.value)"
              >
                <option v-for="status in statusOptions" :key="status.value" :value="status.value">
                  {{ status.label }}
                </option>
              </select>
            </div>

            <!-- Edit/Delete Buttons - Only for Manager/Admin -->
            <div v-if="canManageTasks" class="mt-3 flex gap-2">
              <Button size="sm" variant="ghost" @click="startEdit(task)">Edit</Button>
              <Button size="sm" variant="danger" @click="confirmDeleteTask(task.id)">Delete</Button>
            </div>
          </article>

          <p v-if="filteredTasks.length === 0" class="py-6 text-center text-slate-500">
            {{ taskFilter === "my" ? "No tasks assigned to you." : "No tasks found." }}
          </p>
        </div>
      </Card>
    </div>

    <p v-if="errorMessage" class="text-sm font-medium text-rose-600">{{ errorMessage }}</p>

    <Modal v-model="showDeleteModal" title="Delete task">
      <p class="text-sm text-slate-600">Are you sure you want to delete this task?</p>
      <div class="mt-4 flex justify-end gap-2">
        <Button variant="ghost" @click="showDeleteModal = false">Cancel</Button>
        <Button variant="danger" @click="removeTask">Delete</Button>
      </div>
    </Modal>
  </section>
</template>
