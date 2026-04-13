<script setup>
import { computed, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

import Button from "../../components/ui/Button.vue";
import Card from "../../components/ui/Card.vue";
import Input from "../../components/ui/Input.vue";
import { useAuthStore } from "../../stores/auth";
import { showToast } from "../../services/ui";
import { runRules, sanitizeLeadingWhitespace, validators } from "../../utils/validation";

const auth = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const touched = ref({ email: false, password: false });

const emailRules = [
  validators.required("Email"),
  validators.noLeadingWhitespace("Email"),
  validators.email(),
];

const passwordRules = [
  validators.required("Password"),
  validators.noLeadingWhitespace("Password"),
  validators.minLength(8, "Password must be at least 8 characters."),
];

const emailError = computed(() => {
  if (!touched.value.email) {
    return "";
  }
  return runRules(email.value, emailRules);
});

const passwordError = computed(() => {
  if (!touched.value.password) {
    return "";
  }
  return runRules(password.value, passwordRules);
});

const isFormValid = computed(() => !emailError.value && !passwordError.value && email.value && password.value);

function markTouched(field) {
  touched.value[field] = true;

  if (field === "email") {
    email.value = sanitizeLeadingWhitespace(email.value);
  }

  if (field === "password") {
    password.value = sanitizeLeadingWhitespace(password.value);
  }
}

async function submit() {
  errorMessage.value = "";
  touched.value.email = true;
  touched.value.password = true;

  email.value = sanitizeLeadingWhitespace(email.value);
  password.value = sanitizeLeadingWhitespace(password.value);

  if (!isFormValid.value) {
    return;
  }

  try {
    await auth.login(email.value.trim(), password.value);
    showToast({ title: "Login successful", type: "success" });
    router.push({ name: "dashboard" });
  } catch (error) {
    console.error("Login error:", error);

    const looksLikeInvalidCredentials =
      error?.status === 401 || /invalid|credential|password|user/i.test(error?.message || "");

    errorMessage.value = looksLikeInvalidCredentials
      ? "Invalid user or password."
      : (error?.message || "Login failed. Please try again.");

    showToast({ 
      title: "Login Failed", 
      message: errorMessage.value,
      type: "error"
    });
  }
}
</script>

<template>
  <div class="grid min-h-screen place-items-center bg-slate-100 px-4">
    <Card class="w-full max-w-md p-8">
      <h2 class="text-2xl font-semibold tracking-tight text-slate-900">Sign in</h2>
      <p class="mt-2 text-sm text-slate-500">Access your company dashboard.</p>

      <form class="mt-6 space-y-4" @submit.prevent="submit">
        <Input v-model="email" label="Email" type="email" required :error="emailError" @blur="markTouched('email')" />

        <Input
          v-model="password"
          label="Password"
          type="password"
          required
          :error="passwordError"
          @blur="markTouched('password')"
        />

        <Button type="submit" variant="secondary" block :loading="auth.loading" :disabled="!isFormValid">Sign in</Button>
      </form>

      <p v-if="errorMessage" class="mt-3 text-sm text-red-600">{{ errorMessage }}</p>
      <p class="mt-4 text-sm text-slate-600">
        New here?
        <RouterLink to="/signup" class="font-medium text-slate-900 hover:underline">Create an account</RouterLink>
      </p>
    </Card>
  </div>
</template>
