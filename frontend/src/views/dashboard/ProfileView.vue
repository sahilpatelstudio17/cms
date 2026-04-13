<script setup>
import { computed, onMounted, ref } from "vue";

import Button from "../../components/ui/Button.vue";
import Card from "../../components/ui/Card.vue";
import Input from "../../components/ui/Input.vue";
import Modal from "../../components/ui/Modal.vue";
import api from "../../services/api";
import { showToast } from "../../services/ui";
import { useAuthStore } from "../../stores/auth";
import { useProfileStore } from "../../stores/profile";
import { runRules, sanitizeLeadingWhitespace, validators } from "../../utils/validation";

const auth = useAuthStore();
const profileStore = useProfileStore();

const loading = computed(() => profileStore.loading);
const profile = computed(() => profileStore.profile);

const saving = ref(false);
const showPasswordChange = ref(false);
const passwordValidationError = ref("");
const isEditing = ref(false);

const editForm = ref({
  name: "",
  email: "",
});

const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const profileTouched = ref({ name: false, email: false });
const passwordTouched = ref({ currentPassword: false, newPassword: false, confirmPassword: false });

const profileNameRules = [
  validators.required("Name"),
  validators.noLeadingWhitespace("Name"),
  validators.minLength(2, "Name must be at least 2 characters."),
];

const profileEmailRules = [
  validators.required("Email"),
  validators.noLeadingWhitespace("Email"),
  validators.email(),
];

const currentPasswordRules = [
  validators.required("Current password"),
  validators.noLeadingWhitespace("Current password"),
];

const newPasswordRules = [
  validators.required("New password"),
  validators.noLeadingWhitespace("New password"),
  validators.passwordStrength({ minLength: 8 }),
];

const profileNameError = computed(() => {
  if (!profileTouched.value.name) return "";
  return runRules(editForm.value.name, profileNameRules);
});

const profileEmailError = computed(() => {
  if (!profileTouched.value.email) return "";
  return runRules(editForm.value.email, profileEmailRules);
});

const currentPasswordError = computed(() => {
  if (!passwordTouched.value.currentPassword) return "";
  return runRules(passwordForm.value.currentPassword, currentPasswordRules);
});

const newPasswordError = computed(() => {
  if (!passwordTouched.value.newPassword) return "";
  return runRules(passwordForm.value.newPassword, newPasswordRules);
});

const confirmPasswordError = computed(() => {
  if (!passwordTouched.value.confirmPassword) return "";
  if (!passwordForm.value.confirmPassword) {
    return "Confirm password is required.";
  }
  return passwordForm.value.newPassword === passwordForm.value.confirmPassword
    ? ""
    : "New password and confirm password do not match";
});

const isProfileFormValid = computed(() => !profileNameError.value && !profileEmailError.value);
const isPasswordFormValid = computed(() => !currentPasswordError.value && !newPasswordError.value && !confirmPasswordError.value);

function markProfileTouched(field) {
  profileTouched.value[field] = true;
  if (field === "name") editForm.value.name = sanitizeLeadingWhitespace(editForm.value.name);
  if (field === "email") editForm.value.email = sanitizeLeadingWhitespace(editForm.value.email);
}

function markPasswordTouched(field) {
  passwordTouched.value[field] = true;
  if (field === "currentPassword") {
    passwordForm.value.currentPassword = sanitizeLeadingWhitespace(passwordForm.value.currentPassword);
  }
  if (field === "newPassword") {
    passwordForm.value.newPassword = sanitizeLeadingWhitespace(passwordForm.value.newPassword);
  }
  if (field === "confirmPassword") {
    passwordForm.value.confirmPassword = sanitizeLeadingWhitespace(passwordForm.value.confirmPassword);
  }
}

async function loadProfile() {
  try {
    const loadedProfile = await profileStore.fetchProfile();
    editForm.value = {
      name: loadedProfile?.name || "",
      email: loadedProfile?.email || "",
    };
  } catch {
    showToast({
      title: "Error",
      message: "Failed to load profile",
      type: "error",
    });
  }
}

async function updateProfile() {
  profileTouched.value = { name: true, email: true };
  editForm.value.name = sanitizeLeadingWhitespace(editForm.value.name);
  editForm.value.email = sanitizeLeadingWhitespace(editForm.value.email);

  if (!isProfileFormValid.value) {
    showToast({ title: "Error", message: "Please fix validation errors.", type: "error" });
    return;
  }

  saving.value = true;
  try {
    const updatedProfile = await profileStore.updateProfile({
      name: editForm.value.name.trim(),
      email: editForm.value.email.trim(),
    });
    editForm.value.name = updatedProfile?.name || editForm.value.name;
    editForm.value.email = updatedProfile?.email || editForm.value.email;
    isEditing.value = false;
    showToast({
      title: "Success",
      message: "Profile updated successfully",
      type: "success",
    });
  } catch (error) {
    showToast({
      title: "Error",
      message: error?.message || "Failed to update profile",
      type: "error",
    });
  } finally {
    saving.value = false;
  }
}

async function changePassword() {
  passwordValidationError.value = "";

  passwordTouched.value = { currentPassword: true, newPassword: true, confirmPassword: true };
  passwordForm.value.currentPassword = sanitizeLeadingWhitespace(passwordForm.value.currentPassword);
  passwordForm.value.newPassword = sanitizeLeadingWhitespace(passwordForm.value.newPassword);
  passwordForm.value.confirmPassword = sanitizeLeadingWhitespace(passwordForm.value.confirmPassword);

  if (!isPasswordFormValid.value) {
    passwordValidationError.value = currentPasswordError.value || newPasswordError.value || confirmPasswordError.value;
    return;
  }

  saving.value = true;
  try {
    await api.post("/auth/change-password", {
      old_password: passwordForm.value.currentPassword,
      new_password: passwordForm.value.newPassword,
    });

    passwordForm.value = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    passwordTouched.value = { currentPassword: false, newPassword: false, confirmPassword: false };
    passwordValidationError.value = "";
    showPasswordChange.value = false;

    showToast({
      title: "Success",
      message: "Password changed successfully! Please login again with your new password.",
      type: "success",
    });

    setTimeout(() => {
      auth.logout();
      window.location.href = "/login";
    }, 1500);
  } catch (error) {
    passwordValidationError.value = error?.message || "Failed to change password";
    showToast({
      title: "Error",
      message: error?.message || "Failed to change password",
      type: "error",
    });
  } finally {
    saving.value = false;
  }
}

onMounted(loadProfile);
</script>

<template>
  <section class="space-y-6">
    <header>
      <h2 class="text-2xl font-semibold">My Profile</h2>
      <p class="mt-1 text-sm text-slate-500">Manage your account information and security.</p>
    </header>

    <div class="grid gap-6 lg:grid-cols-3">
      <Card class="lg:col-span-2">
        <div class="mb-6 flex items-center justify-between">
          <h3 class="text-lg font-semibold">Profile Information</h3>
          <Button v-if="!isEditing" variant="secondary" size="sm" @click="isEditing = true">
            Edit
          </Button>
        </div>

        <div v-if="loading" class="text-slate-500">Loading profile...</div>
        <div v-else class="space-y-4">
          <div v-if="!isEditing" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700">Name</label>
              <p class="mt-1 text-slate-900">{{ profile.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700">Email</label>
              <p class="mt-1 text-slate-900">{{ profile.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700">Role</label>
              <p class="mt-1">
                <span class="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  {{ profile.role }}
                </span>
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700">Status</label>
              <p class="mt-1">
                <span :class="[
                  'inline-block rounded-full px-3 py-1 text-sm font-medium',
                  profile.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                ]">
                  {{ profile.status }}
                </span>
              </p>
            </div>
            <div v-if="profile.admin">
              <label class="block text-sm font-medium text-slate-700">Created By (Admin)</label>
              <div class="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p class="font-medium text-slate-900">{{ profile.admin.name }}</p>
                <p class="text-sm text-slate-600">{{ profile.admin.email }}</p>
                <p class="text-xs text-slate-500 mt-1">
                  <span class="inline-block rounded bg-blue-100 px-2 py-0.5 text-blue-800">{{ profile.admin.role }}</span>
                </p>
              </div>
            </div>
          </div>
          <div v-else class="space-y-4">
            <Input
              v-model="editForm.name"
              label="Name"
              required
              :error="profileNameError"
              @blur="markProfileTouched('name')"
            />
            <Input
              v-model="editForm.email"
              label="Email"
              type="email"
              required
              :error="profileEmailError"
              @blur="markProfileTouched('email')"
            />
            <div class="flex gap-2 pt-2">
              <Button @click="updateProfile" :loading="saving">Save Changes</Button>
              <Button variant="ghost" @click="isEditing = false">Cancel</Button>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 class="text-lg font-semibold mb-4">Security</h3>
        <Button variant="secondary" class="w-full" @click="showPasswordChange = true">
          🔐 Change Password
        </Button>
      </Card>
    </div>

    <Modal v-model="showPasswordChange" title="Change Password">
      <div class="space-y-4">
        <div v-if="passwordValidationError" class="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {{ passwordValidationError }}
        </div>
        <Input
          v-model="passwordForm.currentPassword"
          label="Current Password"
          type="password"
          placeholder="Enter your current password"
          required
          :error="currentPasswordError"
          @blur="markPasswordTouched('currentPassword')"
        />
        <Input
          v-model="passwordForm.newPassword"
          label="New Password"
          type="password"
          placeholder="Enter your new password (min 8 characters)"
          required
          :error="newPasswordError"
          @blur="markPasswordTouched('newPassword')"
        />
        <Input
          v-model="passwordForm.confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your new password"
          required
          :error="confirmPasswordError"
          @blur="markPasswordTouched('confirmPassword')"
        />
      </div>
      <div class="mt-6 flex justify-end gap-2">
        <Button variant="ghost" @click="showPasswordChange = false">Cancel</Button>
        <Button @click="changePassword" :loading="saving">Change Password</Button>
      </div>
    </Modal>
  </section>
</template>