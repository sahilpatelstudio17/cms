<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-100 to-white">
    <!-- Navbar -->
    <nav class="bg-white shadow-lg sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-slate-900">CMS</h1>
          </div>
          <div class="flex items-center space-x-4">
            <router-link to="/" class="text-gray-700 hover:text-slate-900">Home</router-link>
            <router-link to="/about" class="text-gray-700 hover:text-slate-900">About</router-link>
            <router-link to="/vlog" class="text-gray-700 hover:text-slate-900 font-bold">Vlog</router-link>
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
      <h1 class="text-4xl font-bold text-gray-900 mb-6">CMS Vlog</h1>
      <p class="text-xl text-gray-600">Learn, grow, and master CMS with our video tutorials and insights</p>
    </section>

    <!-- Featured Video -->
    <section class="bg-gray-50 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold mb-8">Featured Video</h2>
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="aspect-video bg-gray-300 flex items-center justify-center">
            <div class="text-center">
              <div class="text-6xl mb-4">▶️</div>
              <p class="text-gray-600">Getting Started with CMS</p>
            </div>
          </div>
          <div class="p-6">
            <h3 class="text-2xl font-bold mb-2">Getting Started with CMS</h3>
            <p class="text-gray-600 mb-4">In this comprehensive guide, we'll walk you through all the basics of CMS and show you how to set up your first project in just 10 minutes.</p>
            <div class="flex items-center text-gray-500">
              <span>Posted on April 1, 2026</span>
              <span class="ml-4">Duration: 12:45</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Video Grid -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold mb-12">Latest Videos</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Video Card 1 -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
            <div class="aspect-video bg-gray-300 flex items-center justify-center">
              <div class="text-4xl">▶️</div>
            </div>
            <div class="p-6">
              <h3 class="font-bold text-lg mb-2">Advanced Features Explained</h3>
              <p class="text-gray-600 text-sm mb-4">Discover the powerful features that make CMS stand out from the competition.</p>
              <div class="text-gray-500 text-sm">March 28, 2026 • 18:32</div>
            </div>
          </div>

          <!-- Video Card 2 -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
            <div class="aspect-video bg-gray-300 flex items-center justify-center">
              <div class="text-4xl">▶️</div>
            </div>
            <div class="p-6">
              <h3 class="font-bold text-lg mb-2">User Management Best Practices</h3>
              <p class="text-gray-600 text-sm mb-4">Learn how to effectively manage users and control access in your CMS instance.</p>
              <div class="text-gray-500 text-sm">March 25, 2026 • 15:20</div>
            </div>
          </div>

          <!-- Video Card 3 -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
            <div class="aspect-video bg-gray-300 flex items-center justify-center">
              <div class="text-4xl">▶️</div>
            </div>
            <div class="p-6">
              <h3 class="font-bold text-lg mb-2">Analytics & Reporting</h3>
              <p class="text-gray-600 text-sm mb-4">Master the analytics dashboard and generate insightful reports for your business.</p>
              <div class="text-gray-500 text-sm">March 22, 2026 • 14:15</div>
            </div>
          </div>

          <!-- Video Card 4 -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
            <div class="aspect-video bg-gray-300 flex items-center justify-center">
              <div class="text-4xl">▶️</div>
            </div>
            <div class="p-6">
              <h3 class="font-bold text-lg mb-2">Security Features Overview</h3>
              <p class="text-gray-600 text-sm mb-4">Understand how CMS keeps your data safe with enterprise-grade security.</p>
              <div class="text-gray-500 text-sm">March 19, 2026 • 11:45</div>
            </div>
          </div>

          <!-- Video Card 5 -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
            <div class="aspect-video bg-gray-300 flex items-center justify-center">
              <div class="text-4xl">▶️</div>
            </div>
            <div class="p-6">
              <h3 class="font-bold text-lg mb-2">Integration Possibilities</h3>
              <p class="text-gray-600 text-sm mb-4">Explore how to integrate CMS with your favorite third-party tools.</p>
              <div class="text-gray-500 text-sm">March 16, 2026 • 13:20</div>
            </div>
          </div>

          <!-- Video Card 6 -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
            <div class="aspect-video bg-gray-300 flex items-center justify-center">
              <div class="text-4xl">▶️</div>
            </div>
            <div class="p-6">
              <h3 class="font-bold text-lg mb-2">Troubleshooting Common Issues</h3>
              <p class="text-gray-600 text-sm mb-4">Quick solutions to common problems and frequently asked questions.</p>
              <div class="text-gray-500 text-sm">March 13, 2026 • 9:40</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Playlist Section -->
    <section class="bg-gray-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">Video Playlists</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white rounded-lg shadow p-6 text-center">
            <div class="text-5xl mb-4">📚</div>
            <h3 class="font-bold text-lg mb-2">Beginner Series</h3>
            <p class="text-gray-600 text-sm">8 videos</p>
            <button class="mt-4 bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800">View Playlist</button>
          </div>
          <div class="bg-white rounded-lg shadow p-6 text-center">
            <div class="text-5xl mb-4">🚀</div>
            <h3 class="font-bold text-lg mb-2">Advanced Topics</h3>
            <p class="text-gray-600 text-sm">12 videos</p>
            <button class="mt-4 bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800">View Playlist</button>
          </div>
          <div class="bg-white rounded-lg shadow p-6 text-center">
            <div class="text-5xl mb-4">🔧</div>
            <h3 class="font-bold text-lg mb-2">Tips & Tricks</h3>
            <p class="text-gray-600 text-sm">15 videos</p>
            <button class="mt-4 bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800">View Playlist</button>
          </div>
          <div class="bg-white rounded-lg shadow p-6 text-center">
            <div class="text-5xl mb-4">❓</div>
            <h3 class="font-bold text-lg mb-2">FAQ Videos</h3>
            <p class="text-gray-600 text-sm">20 videos</p>
            <button class="mt-4 bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800">View Playlist</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Subscribe Section -->
    <section class="bg-slate-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold mb-4">Subscribe to Our Channel</h2>
        <p class="text-lg mb-6">Don't miss any new videos and tutorials</p>
        <button class="bg-white text-slate-900 px-8 py-3 rounded-lg font-bold hover:bg-gray-100">
          Subscribe Now
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>&copy; 2026 CMS. All rights reserved.</p>
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
