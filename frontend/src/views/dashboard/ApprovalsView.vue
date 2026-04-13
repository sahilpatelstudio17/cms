<template>
  <div v-if="!isAdmin" class="flex items-center justify-center min-h-screen bg-slate-50">
    <div class="text-center">
      <svg class="mx-auto h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-slate-900">Access Denied</h3>
      <p class="mt-2 text-sm text-slate-600">Only admin and super admin users can access this page.</p>
    </div>
  </div>

  <div v-else class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">Approvals</h1>
        <p class="mt-1 text-sm text-slate-600">Review and manage pending approval requests.</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
        <p class="mt-4 text-slate-600">Loading approvals...</p>
      </div>
    </div>

    <!-- Tabs -->
    <div v-else class="flex gap-4 border-b border-slate-200">
      <!-- Admin: Show Pending User Requests Tab Only -->
      <button
        v-if="!isSuperAdmin"
        @click="activeTab = 'user_requests'"
        :class="[
          'px-4 py-2 font-medium text-sm border-b-2 transition',
          activeTab === 'user_requests'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-slate-600 hover:text-slate-900'
        ]"
      >
        Pending User Requests ({{ userRequestApprovals.length }})
      </button>
      
      <!-- Super Admin: Show Pending Admin Requests Tab Only -->
      <button
        v-if="isSuperAdmin"
        @click="activeTab = 'admin_requests'"
        :class="[
          'px-4 py-2 font-medium text-sm border-b-2 transition',
          activeTab === 'admin_requests'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-slate-600 hover:text-slate-900'
        ]"
      >
        Pending Admin Signups ({{ adminApprovals.length }})
      </button>
    </div>

    <!-- User Registrations Tab (Admin only) - HIDDEN -->
    <div v-if="false && activeTab === 'users' && !isSuperAdmin">
      <div v-if="userApprovals.length === 0" class="rounded-lg border border-slate-200 bg-white px-6 py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-slate-900">No pending user registrations</h3>
        <p class="mt-1 text-sm text-slate-600">All registration requests have been reviewed.</p>
      </div>

      <div v-else class="space-y-4">
        <div v-for="approval in userApprovals" :key="approval.id" class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-slate-900">{{ approval.user_name }}</h3>
              <p class="mt-1 text-sm text-slate-600">{{ approval.user_email }}</p>
              <p class="mt-2 text-xs text-slate-500">Requested on {{ formatDate(approval.created_at) }}</p>
            </div>
            <div class="ml-4 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
              Pending
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-6 flex gap-3">
            <button
              @click="approveUserRegistration(approval.id)"
              :disabled="actionInProgress === approval.id"
              class="flex-1 inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg v-if="actionInProgress !== approval.id" class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <div v-else class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              {{ actionInProgress === approval.id ? "Approving..." : "Approve" }}
            </button>

            <button
              @click="showRejectModal('user', approval.id)"
              :disabled="actionInProgress === approval.id"
              class="flex-1 inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg v-if="actionInProgress !== approval.id" class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <div v-else class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              {{ actionInProgress === approval.id ? "Rejecting..." : "Reject" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Role Assignments Tab (Admin only) - HIDDEN -->
    <div v-if="false && activeTab === 'roles' && !isSuperAdmin">
      <div v-if="roleApprovals.length === 0" class="rounded-lg border border-slate-200 bg-white px-6 py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-slate-900">No pending role assignments</h3>
        <p class="mt-1 text-sm text-slate-600">All role assignment requests have been reviewed.</p>
      </div>

      <div v-else class="space-y-4">
        <div v-for="approval in roleApprovals" :key="approval.id" class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-slate-900">{{ approval.employee?.name || 'Employee' }}</h3>
              <p class="mt-1 text-sm text-slate-600">{{ approval.requested_email }}</p>
              <div class="mt-3 flex gap-2">
                <span class="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                  Role: {{ approval.requested_role }}
                </span>
              </div>
              <p class="mt-2 text-xs text-slate-500">Requested on {{ formatDate(approval.created_at) }}</p>
            </div>
            <div class="ml-4 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
              Pending
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-6 flex gap-3">
            <button
              @click="approveRoleAssignmentRequest(approval.id)"
              :disabled="actionInProgress === approval.id"
              class="flex-1 inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg v-if="actionInProgress !== approval.id" class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <div v-else class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              {{ actionInProgress === approval.id ? "Approving..." : "Approve & Create User" }}
            </button>

            <button
              @click="showRejectModal('role', approval.id)"
              :disabled="actionInProgress === approval.id"
              class="flex-1 inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg v-if="actionInProgress !== approval.id" class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <div v-else class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              {{ actionInProgress === approval.id ? "Rejecting..." : "Reject" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Company Signups Tab (Admin only) - HIDDEN -->
    <div v-if="false && activeTab === 'companies' && !isSuperAdmin">
      <div v-if="companyApprovals.length === 0" class="rounded-lg border border-slate-200 bg-white px-6 py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-slate-900">No pending company signups</h3>
        <p class="mt-1 text-sm text-slate-600">All company signup requests have been reviewed.</p>
      </div>

      <div v-else class="space-y-4">
        <div v-for="approval in companyApprovals" :key="approval.id" class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-slate-900">{{ approval.user_name }}</h3>
              <p class="mt-1 text-sm text-slate-600">{{ approval.user_email }}</p>
              <div class="mt-3 flex gap-2">
                <span class="inline-block rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-800">
                  Company Signup
                </span>
              </div>
              <p class="mt-2 text-xs text-slate-500">Requested on {{ formatDate(approval.created_at) }}</p>
            </div>
            <div class="ml-4 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
              Pending
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-6 flex gap-3">
            <button
              @click="handleApproveCompanySignup(approval.id)"
              :disabled="actionInProgress === approval.id"
              class="flex-1 inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg v-if="actionInProgress !== approval.id" class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <div v-else class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              {{ actionInProgress === approval.id ? "Creating..." : "Approve & Create" }}
            </button>

            <button
              @click="showRejectModal('company', approval.id)"
              :disabled="actionInProgress === approval.id"
              class="flex-1 inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg v-if="actionInProgress !== approval.id" class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <div v-else class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              {{ actionInProgress === approval.id ? "Rejecting..." : "Reject" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Employee Requests Tab (Admin only) - HIDDEN -->
    <div v-if="false && activeTab === 'employees' && !isSuperAdmin">
      <div v-if="employeeApprovals.length === 0" class="rounded-lg border border-slate-200 bg-white px-6 py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-slate-900">No pending employee requests</h3>
        <p class="mt-1 text-sm text-slate-600">All employee requests have been reviewed.</p>
      </div>

      <div v-else class="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
        <table class="min-w-[900px] w-full divide-y divide-slate-200 text-sm">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider sm:px-6 whitespace-nowrap">Name</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider sm:px-6 whitespace-nowrap">Position</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider sm:px-6 whitespace-nowrap">Salary</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider sm:px-6 whitespace-nowrap">Requested</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-slate-700 uppercase tracking-wider sm:px-6 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="approval in employeeApprovals" :key="approval.id" class="hover:bg-slate-50">
              <td class="px-4 py-3 text-sm font-medium text-slate-900 sm:px-6 whitespace-nowrap">{{ approval.name }}</td>
              <td class="px-4 py-3 text-sm text-slate-600 sm:px-6 whitespace-nowrap">{{ approval.position }}</td>
              <td class="px-4 py-3 text-sm text-slate-600 sm:px-6 whitespace-nowrap">${{ approval.salary.toFixed(2) }}</td>
              <td class="px-4 py-3 text-sm text-slate-600 sm:px-6 whitespace-nowrap">{{ formatDate(approval.created_at) }}</td>
              <td class="px-4 py-3 text-center sm:px-6">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="handleApproveEmployeeRequest(approval.id)"
                    :disabled="actionInProgress === approval.id"
                    class="inline-flex items-center justify-center rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg v-if="actionInProgress !== approval.id" class="mr-1 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <div v-else class="mr-1 h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    {{ actionInProgress === approval.id ? "..." : "Approve" }}
                  </button>
                  <button
                    @click="showRejectModal('employee', approval.id)"
                    :disabled="actionInProgress === approval.id"
                    class="inline-flex items-center justify-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg v-if="actionInProgress !== approval.id" class="mr-1 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <div v-else class="mr-1 h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    {{ actionInProgress === approval.id ? "..." : "Reject" }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    </div>

    <!-- Pending User Requests Tab (Admin only) -->
    <div v-if="activeTab === 'user_requests' && !isSuperAdmin">
      <div v-if="userRequestApprovals.length === 0" class="rounded-lg border border-slate-200 bg-white px-6 py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-slate-900">No pending user requests</h3>
        <p class="mt-1 text-sm text-slate-600">All user requests have been reviewed.</p>
      </div>

      <div v-else class="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
        <table class="min-w-[980px] w-full divide-y divide-slate-200 text-sm">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider sm:px-6 whitespace-nowrap">Name</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider sm:px-6 whitespace-nowrap">Email</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider sm:px-6 whitespace-nowrap">Role</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider sm:px-6 whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider sm:px-6 whitespace-nowrap">Requested</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-slate-700 uppercase tracking-wider sm:px-6 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="approval in userRequestApprovals" :key="approval.id" class="hover:bg-slate-50">
              <td class="px-4 py-3 text-sm font-medium text-slate-900 sm:px-6 whitespace-nowrap">{{ approval.name }}</td>
              <td class="px-4 py-3 text-sm text-slate-600 sm:px-6 whitespace-nowrap">{{ approval.email }}</td>
              <td class="px-4 py-3 text-sm text-slate-600 sm:px-6 whitespace-nowrap">
                <span class="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">{{ approval.role }}</span>
              </td>
              <td class="px-4 py-3 text-sm text-slate-600 sm:px-6 whitespace-nowrap">
                <span :class="[
                  'inline-block rounded-full px-3 py-1 text-xs font-medium',
                  approval.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                ]">{{ approval.status }}</span>
              </td>
              <td class="px-4 py-3 text-sm text-slate-600 sm:px-6 whitespace-nowrap">{{ formatDate(approval.created_at) }}</td>
              <td class="px-4 py-3 text-center sm:px-6">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="handleApproveUserRequest(approval.id)"
                    :disabled="actionInProgress === approval.id"
                    class="inline-flex items-center justify-center rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg v-if="actionInProgress !== approval.id" class="mr-1 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <div v-else class="mr-1 h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    {{ actionInProgress === approval.id ? "..." : "Approve" }}
                  </button>
                  <button
                    @click="showRejectModal('user_request', approval.id)"
                    :disabled="actionInProgress === approval.id"
                    class="inline-flex items-center justify-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg v-if="actionInProgress !== approval.id" class="mr-1 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <div v-else class="mr-1 h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    {{ actionInProgress === approval.id ? "..." : "Reject" }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    </div>

    <!-- Admin Approvals Tab (Super Admin only) -->
    <div v-if="activeTab === 'admin_requests' && isSuperAdmin" class="rounded-lg border border-slate-200 bg-white">
      <div v-if="adminApprovals.length === 0" class="px-6 py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-slate-900">No pending admin requests</h3>
        <p class="mt-1 text-sm text-slate-600">All admin approval requests have been reviewed.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-[980px] w-full text-sm">
          <thead class="border-b border-slate-200 bg-slate-50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-semibold text-slate-900 sm:px-6 whitespace-nowrap">Name</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-slate-900 sm:px-6 whitespace-nowrap">Email</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-slate-900 sm:px-6 whitespace-nowrap">Company</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-slate-900 sm:px-6 whitespace-nowrap">ID</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-slate-900 sm:px-6 whitespace-nowrap">Requested</th>
              <th class="px-4 py-3 text-center text-sm font-semibold text-slate-900 sm:px-6 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="approval in adminApprovals" :key="approval.id" class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td class="px-4 py-3 text-sm font-medium text-slate-900 sm:px-6 whitespace-nowrap">{{ approval.admin_name }}</td>
              <td class="px-4 py-3 text-sm text-slate-600 sm:px-6 whitespace-nowrap">{{ approval.admin_email }}</td>
              <td class="px-4 py-3 text-sm text-slate-600 sm:px-6 whitespace-nowrap">{{ approval.company_name || 'N/A' }}</td>
              <td class="px-4 py-3 text-sm font-mono text-slate-600 sm:px-6 whitespace-nowrap">#{{ approval.id }}</td>
              <td class="px-4 py-3 text-sm text-slate-600 sm:px-6 whitespace-nowrap">{{ formatDate(approval.created_at) }}</td>
              <td class="px-4 py-3 text-center sm:px-6">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="handleApproveAdminRequest(approval.id)"
                    :disabled="actionInProgress === approval.id"
                    class="inline-flex items-center justify-center rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg v-if="actionInProgress !== approval.id" class="mr-1 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <div v-else class="mr-1 h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    {{ actionInProgress === approval.id ? "..." : "Approve" }}
                  </button>
                  <button
                    @click="showRejectModal('admin', approval.id)"
                    :disabled="actionInProgress === approval.id"
                    class="inline-flex items-center justify-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg v-if="actionInProgress !== approval.id" class="mr-1 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <div v-else class="mr-1 h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    {{ actionInProgress === approval.id ? "..." : "Reject" }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="showRejectDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="showRejectDialog = false">
      <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h3 class="text-lg font-semibold text-slate-900">Reject Request</h3>
        <p class="mt-2 text-sm text-slate-600">Provide a reason for rejection (optional).</p>

        <textarea
          v-model="rejectMessage"
          placeholder="e.g., Company policy violation, duplicate account, etc."
          class="mt-4 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          rows="4"
        ></textarea>

        <div class="mt-6 flex gap-3">
          <button
            @click="showRejectDialog = false"
            class="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmReject"
            :disabled="actionInProgress === rejectApprovalId"
            class="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ actionInProgress === rejectApprovalId ? "Rejecting..." : "Reject" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "../../stores/auth";
import { listApprovals, approveUser, rejectUser, getRoleAssignments, approveRoleAssignment, rejectRoleAssignment, approveAdminRequest, rejectAdminRequest, getPendingCompanySignups, approveCompanySignup, getPendingEmployeeApprovals, approveEmployeeRequest, rejectEmployeeRequest, approveUserRequest, rejectUserRequest } from "../../services/api";
import { showToast } from "../../services/ui";
import { useApprovalsStore } from "../../stores/approvals";

const auth = useAuthStore();
const approvalsStore = useApprovalsStore();
const isAdmin = computed(() => auth.isAdmin);
const isSuperAdmin = computed(() => auth.userRole === "super_admin");

const activeTab = ref("users"); // Default to 'users' for admin, 'admins' for super admin
const userApprovals = ref([]);
const userRequestApprovals = computed(() => approvalsStore.userRequestApprovals);
const roleApprovals = ref([]);
const companyApprovals = ref([]);
const adminApprovals = computed(() => approvalsStore.adminApprovals);
const employeeApprovals = ref([]);
const loading = computed(() => approvalsStore.loading);
const actionInProgress = ref(null);
const showRejectDialog = ref(false);
const rejectApprovalId = ref(null);
const rejectApprovalType = ref(null);
const rejectMessage = ref("");

// Initialize active tab based on role
function initializeActiveTab() {
  if (isSuperAdmin.value) {
    activeTab.value = "admin_requests";
  } else {
    activeTab.value = "user_requests";
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function loadApprovals(force = false) {
  try {
    await approvalsStore.fetchApprovalsByRole({ isSuperAdmin: isSuperAdmin.value, force });
  } catch (error) {
    showToast({
      title: "Error",
      message: error?.message || "Failed to load approvals",
      type: "error",
    });
  }
}

async function approveUserRegistration(approvalId) {
  try {
    actionInProgress.value = approvalId;
    await approveUser(approvalId);

    const approvedUser = userApprovals.value.find((a) => a.id === approvalId);
    const userName = approvedUser?.user_name || "User";

    showToast({
      title: "Success",
      message: "User approved successfully",
      type: "success",
    });

    window.dispatchEvent(
      new CustomEvent("approval:success", {
        detail: { userName },
      })
    );

    await loadApprovals(true);
  } catch (error) {
    showToast({
      title: "Error",
      message: error?.message || "Failed to approve user",
      type: "error",
    });
  } finally {
    actionInProgress.value = null;
  }
}

async function approveRoleAssignmentRequest(approvalId) {
  try {
    actionInProgress.value = approvalId;
    
    await approveRoleAssignment(approvalId);
    
    showToast({
      title: "Success",
      message: "Role assignment approved! User account created with password: User@123",
      type: "success",
    });

    const approval = roleApprovals.value.find((a) => a.id === approvalId);
    window.dispatchEvent(
      new CustomEvent("approval:success", {
        detail: { 
          userName: approval?.employee?.name || "Employee",
          userEmail: approval?.requested_email,
          userRole: approval?.requested_role
        },
      })
    );

    await loadApprovals(true);
  } catch (error) {
    showToast({
      title: "Error",
      message: error?.message || "Failed to approve role assignment",
      type: "error",
    });
  } finally {
    actionInProgress.value = null;
  }
}

async function approveAdminApproval(approvalId) {
  try {
    actionInProgress.value = approvalId;
    await approveAdminRequest(approvalId);

    showToast({
      title: "Success",
      message: "Admin approved successfully",
      type: "success",
    });

    await loadApprovals(true);
  } catch (error) {
    showToast({
      title: "Error",
      message: error?.message || "Failed to approve admin",
      type: "error",
    });
  } finally {
    actionInProgress.value = null;
  }
}

async function handleApproveCompanySignup(approvalId) {
  try {
    actionInProgress.value = approvalId;
    
    const response = await approveCompanySignup(approvalId);
    
    showToast({
      title: "Success",
      message: "Company signup approved! Company and user account created.",
      type: "success",
    });

    const approval = companyApprovals.value.find((a) => a.id === approvalId);
    window.dispatchEvent(
      new CustomEvent("company:signup:approved", {
        detail: { 
          companyName: approval?.company_name,
          adminName: approval?.user_name,
          adminEmail: approval?.user_email
        },
      })
    );

    await loadApprovals(true);
  } catch (error) {
    showToast({
      title: "Error",
      message: error?.message || "Failed to approve company signup",
      type: "error",
    });
  } finally {
    actionInProgress.value = null;
  }
}

async function handleApproveEmployeeRequest(approvalId) {
  try {
    actionInProgress.value = approvalId;
    
    await approveEmployeeRequest(approvalId);
    
    showToast({
      title: "Success",
      message: "Employee request approved! Employee created successfully.",
      type: "success",
    });

    const approval = employeeApprovals.value.find((a) => a.id === approvalId);
    window.dispatchEvent(
      new CustomEvent("approval:success", {
        detail: { 
          userName: approval?.name || "Employee",
          position: approval?.position
        },
      })
    );

    await loadApprovals(true);
  } catch (error) {
    showToast({
      title: "Error",
      message: error?.message || "Failed to approve employee request",
      type: "error",
    });
  } finally {
    actionInProgress.value = null;
  }
}

async function handleApproveAdminRequest(approvalId) {
  try {
    actionInProgress.value = approvalId;
    
    const response = await approveAdminRequest(approvalId);
    
    showToast({
      title: "Success",
      message: "Admin request approved! New admin account created.",
      type: "success",
    });

    const approval = adminApprovals.value.find((a) => a.id === approvalId);
    window.dispatchEvent(
      new CustomEvent("approval:success", {
        detail: { 
          userName: approval?.user_name || "Admin",
          userEmail: approval?.user_email,
          userRole: "admin"
        },
      })
    );

    await loadApprovals(true);
  } catch (error) {
    showToast({
      title: "Error",
      message: error?.message || "Failed to approve admin request",
      type: "error",
    });
  } finally {
    actionInProgress.value = null;
  }
}

async function handleApproveUserRequest(approvalId) {
  try {
    actionInProgress.value = approvalId;
    
    await approveUserRequest(approvalId);
    
    showToast({
      title: "Success",
      message: "User request approved! User account created successfully.",
      type: "success",
    });

    const approval = userRequestApprovals.value.find((a) => a.id === approvalId);
    window.dispatchEvent(
      new CustomEvent("approval:success", {
        detail: { 
          userName: approval?.name || "User",
          userEmail: approval?.email,
          userRole: approval?.role
        },
      })
    );

    await loadApprovals(true);
  } catch (error) {
    showToast({
      title: "Error",
      message: error?.message || "Failed to approve user request",
      type: "error",
    });
  } finally {
    actionInProgress.value = null;
  }
}

function showRejectModal(type, approvalId) {
  rejectApprovalType.value = type;
  rejectApprovalId.value = approvalId;
  rejectMessage.value = "";
  showRejectDialog.value = true;
}

async function confirmReject() {
  try {
    actionInProgress.value = rejectApprovalId.value;
    
    if (rejectApprovalType.value === "user") {
      await rejectUser(rejectApprovalId.value, {
        message: rejectMessage.value || "Request rejected by admin",
      });
    } else if (rejectApprovalType.value === "user_request") {
      await rejectUserRequest(rejectApprovalId.value, {
        reason: rejectMessage.value || "Request rejected by admin",
      });
    } else if (rejectApprovalType.value === "role") {
      await rejectRoleAssignment(rejectApprovalId.value, {
        reason: rejectMessage.value || "Request rejected by admin",
      });
    } else if (rejectApprovalType.value === "admin") {
      await rejectAdminRequest(rejectApprovalId.value, {
        reason: rejectMessage.value || "Request rejected by super admin",
      });
    } else if (rejectApprovalType.value === "employee") {
      await rejectEmployeeRequest(rejectApprovalId.value, {
        reason: rejectMessage.value || "Request rejected by admin",
      });
    } else if (rejectApprovalType.value === "company") {
      // TODO: Implement company signup rejection endpoint on backend
      showToast({
        title: "Info",
        message: "Company signup rejection is not yet implemented.",
        type: "warning",
      });
      showRejectDialog.value = false;
      return;
    }
    
    showToast({
      title: "Success",
      message: "Request rejected successfully",
      type: "success",
    });
    showRejectDialog.value = false;
    await loadApprovals(true);
  } catch (error) {
    showToast({
      title: "Error",
      message: error?.message || "Failed to reject request",
      type: "error",
    });
  } finally {
    actionInProgress.value = null;
  }
}

onMounted(() => {
  initializeActiveTab();
  loadApprovals();
});
</script>
