<script setup>
import { onMounted, ref } from "vue";

import Button from "../../components/ui/Button.vue";
import Card from "../../components/ui/Card.vue";
import Input from "../../components/ui/Input.vue";
import { showToast } from "../../services/ui";
import { useAppDataStore } from "../../stores/appData";
import { useAuthStore } from "../../stores/auth";

const auth = useAuthStore();
const appDataStore = useAppDataStore();

const loading = ref(false);
const savingCompany = ref(false);
const savingUser = ref(false);
const errorMessage = ref("");

const companyForm = ref({
  name: "",
  email: "",
});

const userForm = ref({
  name: "",
  email: "",
});

async function loadSettings() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const company = await appDataStore.fetchCompany();
    companyForm.value = {
      name: company?.name || "",
      email: company?.email || "",
    };

    userForm.value = {
      name: auth.user?.name || "",
      email: auth.user?.email || "",
    };
  } catch (error) {
    errorMessage.value = error?.message || "Failed to load settings.";
  } finally {
    loading.value = false;
  }
}

async function submitCompanyProfile() {
  errorMessage.value = "";
  savingCompany.value = true;
  if (!companyForm.value.name.trim() || !companyForm.value.email.trim()) {
    errorMessage.value = "Company name and email are required.";
    savingCompany.value = false;
    return;
  }

  try {
    const updated = await appDataStore.saveCompany({
      name: companyForm.value.name.trim(),
      email: companyForm.value.email.trim().toLowerCase(),
    });
    companyForm.value = {
      name: updated?.name || companyForm.value.name,
      email: updated?.email || companyForm.value.email,
    };
    showToast({ title: "Company updated", type: "success" });
  } catch (error) {
    errorMessage.value = error?.message || "Failed to update company profile.";
  } finally {
    savingCompany.value = false;
  }
}

async function submitUserProfile() {
  errorMessage.value = "";
  savingUser.value = true;
  if (!userForm.value.name.trim() || !userForm.value.email.trim()) {
    errorMessage.value = "User name and email are required.";
    savingUser.value = false;
    return;
  }

  try {
    auth.updateUserProfile({
      name: userForm.value.name.trim(),
      email: userForm.value.email.trim().toLowerCase(),
    });
    showToast({ title: "Profile updated", message: "Saved locally for current workspace", type: "success" });
  } catch (error) {
    errorMessage.value = error?.message || "Failed to update user profile.";
  } finally {
    savingUser.value = false;
  }
}

onMounted(loadSettings);
</script>

<template>
  <section class="space-y-6">
    <header>
      <h2 class="text-2xl font-semibold">Settings</h2>
      <p class="mt-1 text-sm text-slate-500">Manage company and user profile preferences.</p>
    </header>

    <p v-if="loading" class="text-slate-500">Loading settings...</p>

    <div class="grid gap-6 lg:grid-cols-2">
      <Card>
        <h3 class="text-lg font-semibold">Company Profile</h3>
        <form class="mt-4 space-y-3" @submit.prevent="submitCompanyProfile">
          <Input v-model="companyForm.name" label="Company Name" required />
          <Input v-model="companyForm.email" label="Company Email" type="email" required />
          <Button type="submit" :loading="savingCompany">Update Company</Button>
        </form>
      </Card>

      <Card>
        <h3 class="text-lg font-semibold">User Profile</h3>
        <form class="mt-4 space-y-3" @submit.prevent="submitUserProfile">
          <Input v-model="userForm.name" label="Full Name" required />
          <Input v-model="userForm.email" label="Email" type="email" required />
          <Button type="submit" variant="secondary" :loading="savingUser">Update User</Button>
        </form>
      </Card>
    </div>

    <p v-if="errorMessage" class="text-sm font-medium text-rose-600">{{ errorMessage }}</p>
  </section>
</template>
