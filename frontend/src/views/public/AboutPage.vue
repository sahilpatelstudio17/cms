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
            <router-link to="/about" class="text-gray-700 hover:text-slate-900 font-bold">About</router-link>
            <router-link to="/vlog" class="text-gray-700 hover:text-slate-900">Vlog</router-link>
            <router-link to="/contact" class="text-gray-700 hover:text-slate-900">Contact</router-link>
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
      <h1 class="text-4xl font-bold text-gray-900 mb-6">About CMS Pro</h1>
      <p class="text-xl text-gray-600 mb-12">Learn more about our mission, vision, and the team behind CMS Pro</p>
    </section>

    <!-- Mission Section -->
    <section class="bg-gray-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 class="text-3xl font-bold mb-4">Our Mission</h2>
            <p class="text-gray-600 mb-4">
              At CMS Pro, our mission is to empower businesses of all sizes with intuitive, powerful, and affordable content management solutions. We believe that technology should simplify business operations, not complicate them.
            </p>
            <p class="text-gray-600">
              We're committed to continuously innovating and improving our platform to meet the evolving needs of our customers.
            </p>
          </div>
          <div class="bg-white rounded-lg shadow-lg p-8">
            <div class="text-5xl mb-4">🎯</div>
            <p class="text-gray-600 text-lg">Empowering businesses through innovative content management solutions that drive growth and success.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Vision Section -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div class="bg-white rounded-lg shadow-lg p-8 order-last md:order-first">
            <div class="text-5xl mb-4">🚀</div>
            <p class="text-gray-600 text-lg">To become the most trusted and widely used CMS platform globally, enabling millions of businesses to succeed.</p>
          </div>
          <div class="order-first md:order-last">
            <h2 class="text-3xl font-bold mb-4">Our Vision</h2>
            <p class="text-gray-600 mb-4">
              We envision a future where businesses of all sizes can manage their operations efficiently without technical barriers. Our goal is to democratize content management and make enterprise-grade tools accessible to everyone.
            </p>
            <p class="text-gray-600">
              By 2030, we aim to be the go-to CMS platform for businesses worldwide, serving millions of users across different industries.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="bg-gray-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">Our Team</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="bg-white rounded-lg shadow-lg p-6 text-center">
            <div class="text-6xl mb-4">👨‍💼</div>
            <h3 class="font-bold text-lg mb-2">John Smith</h3>
            <p class="text-gray-600 mb-2">CEO & Founder</p>
            <p class="text-sm text-gray-500">15+ years in tech industry</p>
          </div>
          <div class="bg-white rounded-lg shadow-lg p-6 text-center">
            <div class="text-6xl mb-4">👩‍💻</div>
            <h3 class="font-bold text-lg mb-2">Sarah Johnson</h3>
            <p class="text-gray-600 mb-2">CTO</p>
            <p class="text-sm text-gray-500">Lead innovator in our tech stack</p>
          </div>
          <div class="bg-white rounded-lg shadow-lg p-6 text-center">
            <div class="text-6xl mb-4">👨‍🎨</div>
            <h3 class="font-bold text-lg mb-2">Michael Chen</h3>
            <p class="text-gray-600 mb-2">Design Lead</p>
            <p class="text-sm text-gray-500">Creating beautiful user experiences</p>
          </div>
          <div class="bg-white rounded-lg shadow-lg p-6 text-center">
            <div class="text-6xl mb-4">👩‍📊</div>
            <h3 class="font-bold text-lg mb-2">Emma Davis</h3>
            <p class="text-gray-600 mb-2">Product Manager</p>
            <p class="text-sm text-gray-500">Driving product strategy and growth</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">Our Core Values</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h3 class="text-2xl font-bold mb-4">🤝 Customer First</h3>
            <p class="text-gray-600">We prioritize our customers' needs and feedback in every decision we make.</p>
          </div>
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h3 class="text-2xl font-bold mb-4">💡 Innovation</h3>
            <p class="text-gray-600">We constantly innovate and explore new technologies to stay ahead of the curve.</p>
          </div>
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h3 class="text-2xl font-bold mb-4">🎯 Excellence</h3>
            <p class="text-gray-600">We strive for excellence in everything we do, from product quality to customer support.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-slate-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold mb-4">Ready to join our community?</h2>
        <p class="text-lg mb-6">Start managing your business more effectively today</p>
        <router-link v-if="!isAuthenticated" to="/login" class="bg-white text-slate-900 px-8 py-3 rounded-lg font-bold hover:bg-gray-100">
          Get Started
        </router-link>
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
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);

const handleLogout = () => {
  authStore.logout();
  router.push("/");
};
</script>
