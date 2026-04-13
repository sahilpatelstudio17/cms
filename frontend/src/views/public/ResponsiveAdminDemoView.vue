<script setup>
import { computed, reactive, ref } from "vue";
import MetricCard from "../../components/responsive-demo/MetricCard.vue";
import ResponsiveNavbar from "../../components/responsive-demo/ResponsiveNavbar.vue";
import ResponsiveSidebar from "../../components/responsive-demo/ResponsiveSidebar.vue";
import ResponsiveTable from "../../components/responsive-demo/ResponsiveTable.vue";

const sidebarOpen = ref(false);

const metrics = [
  { title: "Revenue", value: "$84.2K", change: "+12.4% from last month", positive: true },
  { title: "New Users", value: "1,248", change: "+8.1% this week", positive: true },
  { title: "Churn", value: "2.3%", change: "-0.6% improvement", positive: true },
  { title: "Open Tickets", value: "37", change: "+5 unresolved today", positive: false },
];

const orders = [
  { id: 38142, customer: "Olivia Stone", region: "North America", amount: "2,420", status: "Paid" },
  { id: 38143, customer: "Ravi Mehta", region: "Asia Pacific", amount: "940", status: "Pending" },
  { id: 38144, customer: "Mia Harper", region: "Europe", amount: "1,130", status: "Paid" },
  { id: 38145, customer: "Noah Kim", region: "North America", amount: "3,780", status: "Pending" },
  { id: 38146, customer: "Ana Costa", region: "South America", amount: "620", status: "Paid" },
];

const quickForm = reactive({
  title: "",
  owner: "",
  budget: "",
  notes: "",
});

const formSubmitted = ref(false);

const canSubmit = computed(() => quickForm.title.trim() && quickForm.owner.trim() && quickForm.budget.trim());

function submitQuickForm() {
  formSubmitted.value = true;
  if (!canSubmit.value) {
    return;
  }

  quickForm.title = "";
  quickForm.owner = "";
  quickForm.budget = "";
  quickForm.notes = "";
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <ResponsiveNavbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />

    <div class="flex min-h-[calc(100vh-4rem)]">
      <ResponsiveSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

      <main id="overview" class="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <div class="mx-auto w-full max-w-[1600px] space-y-6 sm:space-y-8">
          <section class="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-5 text-white shadow-lg sm:p-7">
            <div class="grid items-center gap-5 lg:grid-cols-[1.2fr_0.8fr]">
              <div class="min-w-0">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">Control center</p>
                <h1 class="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">Modern responsive admin dashboard</h1>
                <p class="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
                  Mobile first layout with collapsible sidebar, adaptive cards, scalable forms, and a table that scrolls cleanly on small devices.
                </p>
                <div class="mt-5 flex flex-wrap gap-3">
                  <button class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 sm:px-5 sm:py-2.5">Create Report</button>
                  <button class="rounded-lg border border-white/40 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 sm:px-5 sm:py-2.5">Invite Team</button>
                </div>
              </div>

              <div class="overflow-hidden rounded-xl border border-white/15">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
                  alt="Office team"
                  class="h-44 w-full max-w-full object-cover sm:h-52 lg:h-60"
                />
              </div>
            </div>
          </section>

          <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            <MetricCard
              v-for="metric in metrics"
              :key="metric.title"
              :title="metric.title"
              :value="metric.value"
              :change="metric.change"
              :positive="metric.positive"
            />
          </section>

          <section class="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <ResponsiveTable :rows="orders" />

            <article id="settings" class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <h2 class="text-base font-semibold text-slate-900 sm:text-lg">Quick Project Form</h2>
              <p class="mt-1 text-xs text-slate-500 sm:text-sm">Inputs and spacing scale with breakpoints for better touch and desktop usability.</p>

              <form class="mt-5 space-y-4" @submit.prevent="submitQuickForm">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label class="block text-sm font-medium text-slate-700">
                    Project Title
                    <input
                      v-model="quickForm.title"
                      type="text"
                      placeholder="Website revamp"
                      class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 sm:px-4 sm:py-2.5"
                    />
                    <span v-if="formSubmitted && !quickForm.title.trim()" class="mt-1 block text-xs text-rose-600">Title is required.</span>
                  </label>

                  <label class="block text-sm font-medium text-slate-700">
                    Owner
                    <input
                      v-model="quickForm.owner"
                      type="text"
                      placeholder="Team lead"
                      class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 sm:px-4 sm:py-2.5"
                    />
                    <span v-if="formSubmitted && !quickForm.owner.trim()" class="mt-1 block text-xs text-rose-600">Owner is required.</span>
                  </label>
                </div>

                <label class="block text-sm font-medium text-slate-700">
                  Budget (USD)
                  <input
                    v-model="quickForm.budget"
                    type="number"
                    min="1"
                    placeholder="10000"
                    class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 sm:px-4 sm:py-2.5"
                  />
                  <span v-if="formSubmitted && !quickForm.budget.trim()" class="mt-1 block text-xs text-rose-600">Budget is required.</span>
                </label>

                <label class="block text-sm font-medium text-slate-700">
                  Notes
                  <textarea
                    v-model="quickForm.notes"
                    rows="4"
                    placeholder="Describe priorities and milestones"
                    class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 sm:px-4 sm:py-2.5"
                  ></textarea>
                </label>

                <button
                  type="submit"
                  class="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="!canSubmit"
                >
                  Save Project
                </button>
              </form>
            </article>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>
