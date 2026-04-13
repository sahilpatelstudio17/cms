<script setup>
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import { useRouter } from "vue-router";

import Button from "../../components/ui/Button.vue";
import Card from "../../components/ui/Card.vue";
import Input from "../../components/ui/Input.vue";
import { useAuthStore } from "../../stores/auth";
import { showToast } from "../../services/ui";
import { runRules, sanitizeLeadingWhitespace, validators } from "../../utils/validation";

const auth = useAuthStore();
const router = useRouter();

const signupType = ref("company"); // "company", "employee", or "admin"

const form = ref({
  // Company signup
  name: "",
  companyName: "",
  email: "",
  password: "",
  // Employee signup
  employeeName: "",
  employeeEmail: "",
  employeePassword: "",
  employeeCompanyName: "",
  adminEmail: "",
  // Admin signup
  adminName: "",
  adminRequestEmail: "",
  adminRequestPassword: "",
  selectedCompanyId: "",
});

const companies = ref([]);
const touched = ref({
  name: false,
  email: false,
  password: false,
  employeeName: false,
  employeeEmail: false,
  employeePassword: false,
  employeeCompanyName: false,
  adminEmail: false,
  adminName: false,
  adminRequestEmail: false,
  adminRequestPassword: false,
  selectedCompanyId: false,
});

const errorMessage = ref("");
const isLoading = ref(false);

const nameRules = [
  validators.required("Name"),
  validators.noLeadingWhitespace("Name"),
  validators.minLength(2, "Name must be at least 2 characters."),
];

const emailRules = [
  validators.required("Email"),
  validators.noLeadingWhitespace("Email"),
  validators.email(),
  validators.allowedEmailDomains(
    ["gmail.com", "yahoo.com", "email.com"],
    "Email domain must be gmail.com, yahoo.com, or email.com."
  ),
];

const passwordRules = [
  validators.required("Password"),
  validators.noLeadingWhitespace("Password"),
  validators.passwordStrength({ minLength: 6 }),
];

const nameError = computed(() => {
  if (!touched.value.name) return "";
  return runRules(form.value.name, nameRules);
});

const emailError = computed(() => {
  if (!touched.value.email) return "";
  return runRules(form.value.email, emailRules);
});

const passwordError = computed(() => {
  if (!touched.value.password) return "";
  return runRules(form.value.password, passwordRules);
});

const isFormValid = computed(
  () => !nameError.value && !emailError.value && !passwordError.value
);

function markTouched(field) {
  touched.value[field] = true;

  if (field === "name") {
    form.value.name = sanitizeLeadingWhitespace(form.value.name);
  }
  if (field === "email") {
    form.value.email = sanitizeLeadingWhitespace(form.value.email);
  }
  if (field === "password") {
    form.value.password = sanitizeLeadingWhitespace(form.value.password);
  }
}

async function submit() {
  errorMessage.value = "";
  
  touched.value = {
    name: true,
    email: true,
    password: true,
  };

  form.value.name = sanitizeLeadingWhitespace(form.value.name);
  form.value.email = sanitizeLeadingWhitespace(form.value.email);
  form.value.password = sanitizeLeadingWhitespace(form.value.password);

  if (!isFormValid.value) {
    return;
  }

  try {
    const email = form.value.email.trim().toLowerCase();
    await auth.signupAdmin({
      name: form.value.name.trim(),
      email: email,
      password: form.value.password,
    });
    showToast({
      title: "Admin Signup Request Submitted",
      message: "Your admin account request has been submitted. A super admin must review and approve your request. You will receive a confirmation once it's been reviewed.",
      type: "success",
    });
    
    // Redirect to login page
    router.push({ path: "/login" });
  } catch (error) {
    errorMessage.value = error?.message || "Signup failed. Please try again.";
  }
}
</script>

<template>
  <div class="grid min-h-screen place-items-center bg-slate-100 px-4">
    <Card class="w-full max-w-md p-8">
      <h2 class="text-2xl font-semibold tracking-tight text-slate-900">Request Admin Account</h2>
      <p class="mt-2 text-sm text-slate-500">Submit a request for an admin account.</p>

      <form class="mt-6 space-y-4" @submit.prevent="submit">
        <Input
          v-model="form.name"
          label="Full Name"
          required
          :error="nameError"
          @blur="markTouched('name')"
        />
        <Input
          v-model="form.email"
          label="Email Address"
          type="email"
          required
          :error="emailError"
          @blur="markTouched('email')"
        />
        <Input
          v-model="form.password"
          label="Password"
          type="password"
          required
          :error="passwordError"
          @blur="markTouched('password')"
        />

        <div class="rounded-lg border border-slate-300 bg-slate-50 p-3 text-xs text-slate-700">
          <p class="font-semibold">Note:</p>
          <p>Your admin account request will be reviewed by a super admin. Upon approval, you will be able to login with your email and password.</p>
        </div>

        <Button type="submit" variant="secondary" block :loading="auth.loading" :disabled="!isFormValid">
          Create Account
        </Button>
      </form>

      <p v-if="errorMessage" class="mt-3 text-sm text-red-600">{{ errorMessage }}</p>
      <p class="mt-6 text-sm text-slate-600">
        Already have an account?
        <RouterLink to="/login" class="font-medium text-slate-900 hover:underline">Sign in</RouterLink>
      </p>
    </Card>
  </div>
</template>
