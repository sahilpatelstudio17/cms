<template>
  <div class="ui-pro bg-slate-50 text-slate-900">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold tracking-tight text-slate-900">CMS Pro</h1>
          </div>
          <div class="flex items-center space-x-4">
            <a href="#home" class="text-slate-700 hover:text-slate-900 cursor-pointer">Home</a>
            <a href="#plans" class="text-slate-700 hover:text-slate-900 cursor-pointer">Plans</a>
            <a href="#about" class="text-slate-700 hover:text-slate-900 cursor-pointer">About</a>
            <a href="#vlog" class="text-slate-700 hover:text-slate-900 cursor-pointer">Vlog</a>
            <a href="#contact" class="text-slate-700 hover:text-slate-900 cursor-pointer">Contact</a>
            <router-link v-if="!isAuthenticated" to="/login" class="rounded-md bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800">
              Login
            </router-link>
            <div v-else class="flex items-center space-x-2">
              <router-link to="/dashboard" class="text-slate-700 hover:text-slate-900">Dashboard</router-link>
              <button @click="handleLogout" class="rounded-md bg-rose-600 px-4 py-2 text-white transition hover:bg-rose-700">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="relative isolate min-h-screen overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=80"
        alt="Team collaborating in a modern office"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div class="absolute inset-0 bg-slate-950/60"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36">
        <div class="max-w-3xl">
          <p class="mb-4 inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-semibold uppercase tracking-wider text-slate-200">Modern Business OS</p>
          <h2 class="mb-5 text-5xl font-extrabold leading-tight text-white md:text-6xl">Build, manage, and scale with confidence.</h2>
          <p class="mb-10 text-lg leading-relaxed text-slate-200 md:text-xl">CMS Pro helps teams track people, sales, tasks, and performance in one beautiful workspace.</p>
          <div class="flex flex-wrap gap-4">
            <router-link v-if="!isAuthenticated" to="/login" class="rounded-lg border border-white/60 px-8 py-3 font-semibold text-white transition hover:bg-white/15">
              Get Started
            </router-link>
            <router-link v-else to="/dashboard" class="rounded-lg border border-white/60 px-8 py-3 font-semibold text-white transition hover:bg-white/15">
              Go to Dashboard
            </router-link>
            <a href="#plans" class="rounded-lg border border-white/60 px-8 py-3 font-semibold text-white transition hover:bg-white/15">
              View Plans
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Plans Section -->
    <section id="plans" class="py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mx-auto mb-12 max-w-2xl text-center">
          <h2 class="text-4xl font-bold text-slate-900">Subscription Plans</h2>
          <p class="mt-4 text-lg text-slate-600">Choose the package that matches your growth stage.</p>
        </div>
        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
          <article class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <h3 class="text-2xl font-bold text-slate-900">Basic</h3>
            <p class="mt-1 text-slate-600">Perfect for startups</p>
            <p class="mt-6 text-4xl font-extrabold text-slate-900">$29<span class="text-base font-medium text-slate-500">/month</span></p>
            <ul class="mt-6 space-y-3 text-slate-700">
              <li>Up to 10 employees</li>
              <li>Basic reporting</li>
              <li>Email support</li>
            </ul>
            <button class="mt-8 w-full rounded-lg bg-slate-900 py-2.5 font-semibold text-white transition hover:bg-slate-700">Choose Plan</button>
          </article>

          <article class="relative rounded-2xl border-2 border-slate-900 bg-white p-8 shadow-xl">
            <span class="absolute -top-3 right-6 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">Most Popular</span>
            <h3 class="text-2xl font-bold text-slate-900">Professional</h3>
            <p class="mt-1 text-slate-600">Best for growing teams</p>
            <p class="mt-6 text-4xl font-extrabold text-slate-900">$79<span class="text-base font-medium text-slate-500">/month</span></p>
            <ul class="mt-6 space-y-3 text-slate-700">
              <li>Up to 50 employees</li>
              <li>Advanced reporting</li>
              <li>Priority support</li>
            </ul>
            <button class="mt-8 w-full rounded-lg bg-slate-900 py-2.5 font-semibold text-white transition hover:bg-slate-900">Choose Plan</button>
          </article>

          <article class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <h3 class="text-2xl font-bold text-slate-900">Enterprise</h3>
            <p class="mt-1 text-slate-600">For large organizations</p>
            <p class="mt-6 text-4xl font-extrabold text-slate-900">$299<span class="text-base font-medium text-slate-500">/month</span></p>
            <ul class="mt-6 space-y-3 text-slate-700">
              <li>Unlimited employees</li>
              <li>Custom reporting</li>
              <li>24/7 support</li>
            </ul>
            <button class="mt-8 w-full rounded-lg bg-slate-900 py-2.5 font-semibold text-white transition hover:bg-slate-700">Contact Sales</button>
          </article>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="bg-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12 text-slate-900">Why Choose CMS Pro?</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <article class="rounded-2xl border border-slate-200 bg-slate-50 p-7">
            <img src="https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=640&q=80" alt="Business analytics charts" class="mb-5 h-40 w-full rounded-xl object-cover" />
            <h3 class="text-xl font-bold mb-2 text-slate-900">Advanced Analytics</h3>
            <p class="text-slate-600">Get detailed insights into your business performance with our comprehensive analytics dashboard.</p>
          </article>
          <article class="rounded-2xl border border-slate-200 bg-slate-50 p-7">
            <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=640&q=80" alt="Cybersecurity lock interface" class="mb-5 h-40 w-full rounded-xl object-cover" />
            <h3 class="text-xl font-bold mb-2 text-slate-900">Enterprise Security</h3>
            <p class="text-slate-600">Your data is protected with bank-level encryption and multiple security layers.</p>
          </article>
          <article class="rounded-2xl border border-slate-200 bg-slate-50 p-7">
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=640&q=80" alt="Fast digital dashboard" class="mb-5 h-40 w-full rounded-xl object-cover" />
            <h3 class="text-xl font-bold mb-2 text-slate-900">Lightning Fast</h3>
            <p class="text-slate-600">Built for speed and reliability. Experience seamless performance with our optimized infrastructure.</p>
          </article>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="bg-slate-100 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-4xl font-bold text-center mb-12 text-slate-900">About CMS Pro</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-14">
          <div>
            <h3 class="text-2xl font-bold mb-4 text-slate-900">Our Mission</h3>
            <p class="text-slate-700 mb-4">
              At CMS Pro, our mission is to empower businesses of all sizes with intuitive, powerful, and affordable content management solutions. We believe that technology should simplify business operations, not complicate them.
            </p>
            <p class="text-slate-700">
              We're committed to continuously innovating and improving our platform to meet the evolving needs of our customers.
            </p>
          </div>
          <div class="overflow-hidden rounded-2xl bg-white shadow-lg">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80" alt="Team planning strategy together" class="h-72 w-full object-cover" />
            <div class="p-6">
              <h3 class="text-2xl font-bold mb-3 text-slate-900">Our Vision</h3>
              <p class="text-slate-700">To become the most trusted and widely used CMS platform globally, enabling millions of businesses to succeed.</p>
            </div>
          </div>
        </div>

        <h3 class="text-2xl font-bold text-center mb-8 text-slate-900">Our Team</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <article class="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="John Smith portrait" class="mx-auto mb-4 h-20 w-20 rounded-full object-cover" />
            <h4 class="font-bold text-2xl mb-2 text-slate-900">John Smith</h4>
            <p class="text-slate-700 mb-2">CEO &amp; Founder</p>
            <p class="text-sm text-slate-500">15+ years in tech industry</p>
          </article>
          <article class="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sarah Johnson portrait" class="mx-auto mb-4 h-20 w-20 rounded-full object-cover" />
            <h4 class="font-bold text-2xl mb-2 text-slate-900">Sarah Johnson</h4>
            <p class="text-slate-700 mb-2">CTO</p>
            <p class="text-sm text-slate-500">Lead innovator in our tech stack</p>
          </article>
          <article class="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
            <img src="https://randomuser.me/api/portraits/men/65.jpg" alt="Michael Chen portrait" class="mx-auto mb-4 h-20 w-20 rounded-full object-cover" />
            <h4 class="font-bold text-2xl mb-2 text-slate-900">Michael Chen</h4>
            <p class="text-slate-700 mb-2">Design Lead</p>
            <p class="text-sm text-slate-500">Creating beautiful user experiences</p>
          </article>
          <article class="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
            <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Emma Davis portrait" class="mx-auto mb-4 h-20 w-20 rounded-full object-cover" />
            <h4 class="font-bold text-2xl mb-2 text-slate-900">Emma Davis</h4>
            <p class="text-slate-700 mb-2">Product Manager</p>
            <p class="text-sm text-slate-500">Driving product strategy and growth</p>
          </article>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <article class="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h4 class="text-2xl font-bold mb-4 text-slate-900">Customer First</h4>
            <p class="text-slate-700">We prioritize our customers' needs and feedback in every decision we make.</p>
          </article>
          <article class="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h4 class="text-2xl font-bold mb-4 text-slate-900">Innovation</h4>
            <p class="text-slate-700">We constantly innovate and explore new technologies to stay ahead of the curve.</p>
          </article>
          <article class="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h4 class="text-2xl font-bold mb-4 text-slate-900">Excellence</h4>
            <p class="text-slate-700">We strive for excellence in everything we do, from product quality to customer support.</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Vlog Section -->
    <section id="vlog" class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-4xl font-bold text-center mb-12 text-slate-900">CMS Pro Vlog</h2>

        <div class="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-200 mb-12">
          <div class="relative aspect-video">
            <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1800&q=80" alt="Featured CMS tutorial thumbnail" class="h-full w-full object-cover" />
            <div class="absolute inset-0 bg-slate-900/35"></div>
          </div>
          <div class="p-6">
            <h3 class="text-3xl font-bold mb-2 text-slate-900">Getting Started with CMS Pro</h3>
            <p class="text-slate-600 mb-4">In this comprehensive guide, we'll walk you through all the basics of CMS Pro and show you how to set up your first project in just 10 minutes.</p>
            <div class="flex items-center text-slate-500">
              <span>Posted on April 1, 2026</span>
              <span class="ml-4">Duration: 12:45</span>
            </div>
          </div>
        </div>

        <h3 class="text-2xl font-bold mb-8 text-slate-900">Latest Videos</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <article class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
            <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80" alt="Advanced features dashboard" class="aspect-video w-full object-cover" />
            <div class="p-6">
              <h4 class="font-bold text-lg mb-2 text-slate-900">Advanced Features Explained</h4>
              <p class="text-slate-600 text-sm mb-4">Discover the powerful features that make CMS Pro stand out from the competition.</p>
              <div class="text-slate-500 text-sm">March 28, 2026 • 18:32</div>
            </div>
          </article>

          <article class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
            <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=80" alt="User management workflow" class="aspect-video w-full object-cover" />
            <div class="p-6">
              <h4 class="font-bold text-lg mb-2 text-slate-900">User Management Best Practices</h4>
              <p class="text-slate-600 text-sm mb-4">Learn how to effectively manage users and control access in your CMS Pro instance.</p>
              <div class="text-slate-500 text-sm">March 25, 2026 • 15:20</div>
            </div>
          </article>

          <article class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
            <img src="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=900&q=80" alt="Analytics reporting screen" class="aspect-video w-full object-cover" />
            <div class="p-6">
              <h4 class="font-bold text-lg mb-2 text-slate-900">Analytics &amp; Reporting</h4>
              <p class="text-slate-600 text-sm mb-4">Master the analytics dashboard and generate insightful reports for your business.</p>
              <div class="text-slate-500 text-sm">March 22, 2026 • 14:15</div>
            </div>
          </article>

          <article class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
            <img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80" alt="Security lock concept" class="aspect-video w-full object-cover" />
            <div class="p-6">
              <h4 class="font-bold text-lg mb-2 text-slate-900">Security Features Overview</h4>
              <p class="text-slate-600 text-sm mb-4">Understand how CMS Pro keeps your data safe with enterprise-grade security.</p>
              <div class="text-slate-500 text-sm">March 19, 2026 • 11:45</div>
            </div>
          </article>

          <article class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
            <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80" alt="Integration and APIs concept" class="aspect-video w-full object-cover" />
            <div class="p-6">
              <h4 class="font-bold text-lg mb-2 text-slate-900">Integration Possibilities</h4>
              <p class="text-slate-600 text-sm mb-4">Explore how to integrate CMS Pro with your favorite third-party tools.</p>
              <div class="text-slate-500 text-sm">March 16, 2026 • 13:20</div>
            </div>
          </article>

          <article class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl">
            <img src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80" alt="Developer troubleshooting code" class="aspect-video w-full object-cover" />
            <div class="p-6">
              <h4 class="font-bold text-lg mb-2 text-slate-900">Troubleshooting Common Issues</h4>
              <p class="text-slate-600 text-sm mb-4">Quick solutions to common problems and frequently asked questions.</p>
              <div class="text-slate-500 text-sm">March 13, 2026 • 9:40</div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="bg-slate-100 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-4xl font-bold text-center mb-12 text-slate-900">Contact Us</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <article class="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h3 class="text-2xl font-bold mb-4 text-slate-900">Address</h3>
            <p class="text-slate-600">123 Tech Street<br>San Francisco, CA 94102<br>United States</p>
          </article>
          <article class="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h3 class="text-2xl font-bold mb-4 text-slate-900">Phone</h3>
            <p class="text-slate-600">+1 (555) 123-4567<br>Monday - Friday: 9AM - 6PM PST</p>
          </article>
          <article class="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h3 class="text-2xl font-bold mb-4 text-slate-900">Email</h3>
            <p class="text-slate-600">support@cmspro.com<br>sales@cmspro.com<br>hello@cmspro.com</p>
          </article>
        </div>

        <div class="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 max-w-2xl mx-auto">
          <h3 class="text-2xl font-bold mb-6 text-slate-900">Send us a Message</h3>
          <form @submit.prevent="submitForm" class="space-y-4">
            <div>
              <label class="mb-2 block font-semibold text-slate-700">Name</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full rounded-lg border px-4 py-2.5 focus:border-slate-900 focus:outline-none"
                :class="touched.name && formErrors.name ? 'border-rose-400' : 'border-slate-300'"
                @blur="markTouched('name')"
              >
              <p v-if="touched.name && formErrors.name" class="mt-1 text-xs text-rose-600">{{ formErrors.name }}</p>
            </div>
            <div>
              <label class="mb-2 block font-semibold text-slate-700">Email</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full rounded-lg border px-4 py-2.5 focus:border-slate-900 focus:outline-none"
                :class="touched.email && formErrors.email ? 'border-rose-400' : 'border-slate-300'"
                @blur="markTouched('email')"
              >
              <p v-if="touched.email && formErrors.email" class="mt-1 text-xs text-rose-600">{{ formErrors.email }}</p>
            </div>
            <div>
              <label class="mb-2 block font-semibold text-slate-700">Subject</label>
              <input
                v-model="form.subject"
                type="text"
                required
                class="w-full rounded-lg border px-4 py-2.5 focus:border-slate-900 focus:outline-none"
                :class="touched.subject && formErrors.subject ? 'border-rose-400' : 'border-slate-300'"
                @blur="markTouched('subject')"
              >
              <p v-if="touched.subject && formErrors.subject" class="mt-1 text-xs text-rose-600">{{ formErrors.subject }}</p>
            </div>
            <div>
              <label class="mb-2 block font-semibold text-slate-700">Message</label>
              <textarea
                v-model="form.message"
                rows="6"
                required
                class="w-full rounded-lg border px-4 py-2.5 focus:border-slate-900 focus:outline-none"
                :class="touched.message && formErrors.message ? 'border-rose-400' : 'border-slate-300'"
                @blur="markTouched('message')"
              ></textarea>
              <p v-if="touched.message && formErrors.message" class="mt-1 text-xs text-rose-600">{{ formErrors.message }}</p>
            </div>
            <button
              type="submit"
              :disabled="!isFormValid"
              class="w-full rounded-lg bg-slate-900 py-2.5 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Send Message
            </button>
          </form>
          <div v-if="formStatus" :class="['mt-4 rounded p-4', formStatus.success ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700']">
            {{ formStatus.message }}
          </div>
        </div>

        <div class="max-w-2xl mx-auto mt-12">
          <h3 class="text-2xl font-bold text-center mb-8 text-slate-900">Frequently Asked Questions</h3>
          <div class="space-y-4">
            <article class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h4 class="font-bold text-lg mb-2 text-slate-900">What is your response time?</h4>
              <p class="text-slate-600">We aim to respond to all inquiries within 24 hours during business days.</p>
            </article>
            <article class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h4 class="font-bold text-lg mb-2 text-slate-900">Do you offer technical support?</h4>
              <p class="text-slate-600">Yes, we offer technical support for all subscription plans. Enterprise customers get 24/7 support.</p>
            </article>
            <article class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h4 class="font-bold text-lg mb-2 text-slate-900">Can I schedule a demo?</h4>
              <p class="text-slate-600">Absolutely! Contact our sales team at sales@cmspro.com to schedule a personalized demo.</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-slate-900 text-slate-200 py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 class="text-lg font-bold mb-4 text-white">CMS Pro</h4>
            <p class="text-slate-400">Your trusted content management system.</p>
          </div>
          <div>
            <h4 class="text-lg font-bold mb-4 text-white">Quick Links</h4>
            <ul class="space-y-2 text-slate-400">
              <li><a href="#home" class="hover:text-white cursor-pointer">Home</a></li>
              <li><a href="#about" class="hover:text-white cursor-pointer">About</a></li>
              <li><a href="#contact" class="hover:text-white cursor-pointer">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-bold mb-4 text-white">Support</h4>
            <ul class="space-y-2 text-slate-400">
              <li><a href="#" class="hover:text-white">Documentation</a></li>
              <li><a href="#" class="hover:text-white">FAQ</a></li>
              <li><a href="#contact" class="hover:text-white cursor-pointer">Contact Support</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-bold mb-4 text-white">Follow Us</h4>
            <ul class="space-y-2 text-slate-400">
              <li><a href="#" class="hover:text-white">Twitter</a></li>
              <li><a href="#" class="hover:text-white">Facebook</a></li>
              <li><a href="#" class="hover:text-white">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-slate-700 pt-8 text-center text-slate-500">
          <p>&copy; 2026 CMS Pro. All rights reserved.</p>
        </div>
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

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap");

.ui-pro {
  font-family: "Space Grotesk", sans-serif;
}

html {
  scroll-behavior: smooth;
}
</style>
