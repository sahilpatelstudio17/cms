<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-100 to-white">
    <!-- Navbar -->
    <nav class="bg-white shadow-lg sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-slate-900">CMS Pro</h1>
          </div>
          <div class="flex items-center space-x-4">
            <router-link to="/" class="text-gray-700 hover:text-slate-900">Home</router-link>
            <router-link to="/about" class="text-gray-700 hover:text-slate-900">About</router-link>
            <router-link to="/vlog" class="text-gray-700 hover:text-slate-900">Vlog</router-link>
            <router-link to="/contact" class="text-gray-700 hover:text-slate-900 font-bold">Contact</router-link>
            <router-link v-if="!isAuthenticated" to="/login" class="bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800">
              Login
            </router-link>
            <div v-else class="flex items-center space-x-2">
              <router-link to="/dashboard" class="text-gray-700 hover:text-slate-900">Dashboard</router-link>
              <button @click="handleLogout" class="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-800">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 class="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
      <p class="text-xl text-gray-600">We'd love to hear from you. Get in touch with us today.</p>
    </section>

    <!-- Contact Section -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <!-- Contact Info -->
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h3 class="text-2xl font-bold mb-4">📍 Address</h3>
            <p class="text-gray-600">123 Tech Street<br>San Francisco, CA 94102<br>United States</p>
          </div>
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h3 class="text-2xl font-bold mb-4">📞 Phone</h3>
            <p class="text-gray-600">+919876543210<br>Monday - Friday: 9AM - 6PM PST</p>
          </div>
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h3 class="text-2xl font-bold mb-4">📧 Email</h3>
            <p class="text-gray-600">support@cmspro.com<br>sales@cmspro.com<br>hello@cmspro.com</p>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          <h2 class="text-2xl font-bold mb-6">Send us a Message</h2>
          <form @submit.prevent="submitForm" class="space-y-4">
            <div>
              <label class="block text-gray-700 font-bold mb-2">Name</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full rounded-lg border px-4 py-2 focus:outline-none focus:border-slate-900"
                :class="touched.name && formErrors.name ? 'border-rose-400' : 'border-slate-300'"
                @blur="markTouched('name')"
              >
              <p v-if="touched.name && formErrors.name" class="mt-1 text-xs text-rose-600">{{ formErrors.name }}</p>
            </div>
            <div>
              <label class="block text-gray-700 font-bold mb-2">Email</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full rounded-lg border px-4 py-2 focus:outline-none focus:border-slate-900"
                :class="touched.email && formErrors.email ? 'border-rose-400' : 'border-slate-300'"
                @blur="markTouched('email')"
              >
              <p v-if="touched.email && formErrors.email" class="mt-1 text-xs text-rose-600">{{ formErrors.email }}</p>
            </div>
            <div>
              <label class="block text-gray-700 font-bold mb-2">Subject</label>
              <input
                v-model="form.subject"
                type="text"
                required
                class="w-full rounded-lg border px-4 py-2 focus:outline-none focus:border-slate-900"
                :class="touched.subject && formErrors.subject ? 'border-rose-400' : 'border-slate-300'"
                @blur="markTouched('subject')"
              >
              <p v-if="touched.subject && formErrors.subject" class="mt-1 text-xs text-rose-600">{{ formErrors.subject }}</p>
            </div>
            <div>
              <label class="block text-gray-700 font-bold mb-2">Message</label>
              <textarea
                v-model="form.message"
                rows="6"
                required
                class="w-full rounded-lg border px-4 py-2 focus:outline-none focus:border-slate-900"
                :class="touched.message && formErrors.message ? 'border-rose-400' : 'border-slate-300'"
                @blur="markTouched('message')"
              ></textarea>
              <p v-if="touched.message && formErrors.message" class="mt-1 text-xs text-rose-600">{{ formErrors.message }}</p>
            </div>
            <button
              type="submit"
              :disabled="!isFormValid"
              class="w-full rounded bg-slate-900 py-2 font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Send Message
            </button>
          </form>
          <div v-if="formStatus" :class="['mt-4 p-4 rounded', formStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
            {{ formStatus.message }}
          </div>
        </div>
      </div>
    </section>

    <!-- Map Section -->
    <section class="bg-gray-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">Find Us</h2>
        <div class="bg-gray-300 rounded-lg h-96 flex items-center justify-center">
          <p class="text-gray-600">Google Map Integration Here</p>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div class="max-w-2xl mx-auto space-y-4">
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="font-bold text-lg mb-2">What is your response time?</h3>
            <p class="text-gray-600">We aim to respond to all inquiries within 24 hours during business days.</p>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="font-bold text-lg mb-2">Do you offer technical support?</h3>
            <p class="text-gray-600">Yes, we offer technical support for all subscription plans. Enterprise customers get 24/7 support.</p>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="font-bold text-lg mb-2">Can I schedule a demo?</h3>
            <p class="text-gray-600">Absolutely! Contact our sales team at sales@cmspro.com to schedule a personalized demo.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>&copy; 2026 CMS Pro. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { runRules, sanitizeLeadingWhitespace, validators } from "../../utils/validation";

const router = useRouter();
const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);

const form = reactive({
  name: "",
  email: "",
  subject: "",
  message: ""
});

const touched = reactive({
  name: false,
  email: false,
  subject: false,
  message: false,
});

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

const subjectRules = [
  validators.required("Subject"),
  validators.noLeadingWhitespace("Subject"),
  validators.minLength(3, "Subject must be at least 3 characters."),
];

const messageRules = [
  validators.required("Message"),
  validators.noLeadingWhitespace("Message"),
  validators.minLength(10, "Message must be at least 10 characters."),
];

const formErrors = computed(() => ({
  name: runRules(form.name, nameRules),
  email: runRules(form.email, emailRules),
  subject: runRules(form.subject, subjectRules),
  message: runRules(form.message, messageRules),
}));

const isFormValid = computed(() => Object.values(formErrors.value).every((error) => !error));

const formStatus = ref(null);

const handleLogout = () => {
  authStore.logout();
  router.push("/");
};

const markTouched = (field) => {
  touched[field] = true;
  form[field] = sanitizeLeadingWhitespace(form[field]);
};

const submitForm = () => {
  touched.name = true;
  touched.email = true;
  touched.subject = true;
  touched.message = true;

  form.name = sanitizeLeadingWhitespace(form.name);
  form.email = sanitizeLeadingWhitespace(form.email);
  form.subject = sanitizeLeadingWhitespace(form.subject);
  form.message = sanitizeLeadingWhitespace(form.message);

  if (!isFormValid.value) {
    formStatus.value = {
      success: false,
      message: "Please fix the validation errors before submitting.",
    };
    return;
  }

  // Simulate form submission
  console.log("Form submitted:", form);
  formStatus.value = {
    success: true,
    message: "Thank you for your message! We'll get back to you soon."
  };
  
  // Reset form
  form.name = "";
  form.email = "";
  form.subject = "";
  form.message = "";

  touched.name = false;
  touched.email = false;
  touched.subject = false;
  touched.message = false;
  
  // Clear status after 5 seconds
  setTimeout(() => {
    formStatus.value = null;
  }, 5000);
};
</script>
