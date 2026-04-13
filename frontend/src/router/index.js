import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "../stores/auth";
import { showToast } from "../services/ui";
import DashboardLayout from "../layouts/DashboardLayout.vue";
import LoginView from "../views/auth/LoginView.vue";
import SignupView from "../views/auth/SignupView.vue";
import HomePage from "../views/public/HomePage.vue";
import ResponsiveAdminDemoView from "../views/public/ResponsiveAdminDemoView.vue";
import DashboardView from "../views/dashboard/DashboardView.vue";
import EmployeesView from "../views/dashboard/EmployeesView.vue";
import SettingsView from "../views/dashboard/SettingsView.vue";
import TasksView from "../views/dashboard/TasksView.vue";
import SuperAdminDashboardView from "../views/dashboard/SuperAdminDashboardView.vue";
import ApprovalsView from "../views/dashboard/ApprovalsView.vue";
import ExpensesView from "../views/dashboard/ExpensesView.vue";
import SalesView from "../views/dashboard/SalesView.vue";
import ProfileView from "../views/dashboard/ProfileView.vue";
import UsersView from "../views/dashboard/UsersView.vue";
import TeamManagementView from "../views/dashboard/TeamManagementView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
      meta: { public: true }
    },
    {
      path: "/about",
      redirect: "/#about"
    },
    {
      path: "/contact",
      redirect: "/#contact"
    },
    {
      path: "/vlog",
      redirect: "/#vlog"
    },
    {
      path: "/responsive-demo",
      name: "responsive-demo",
      component: ResponsiveAdminDemoView,
      meta: { public: true },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: "/signup",
      name: "signup",
      component: SignupView,
      meta: { guestOnly: true },
    },
    {
      path: "/super-admin",
      component: DashboardLayout,
      meta: { requiresAuth: true, roles: ["super_admin"] },
      children: [
        {
          path: "",
          name: "super-admin-dashboard",
          component: SuperAdminDashboardView,
          meta: { roles: ["super_admin"] },
        },
      ],
    },
    {
      path: "/",
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: "dashboard",
          name: "dashboard",
          component: DashboardView,
          meta: { roles: ["admin", "employee", "developer", "staff", "salesman", "manager"] },
        },
        {
          path: "employees",
          name: "employees",
          component: EmployeesView,
          meta: { roles: ["admin", "developer", "staff", "salesman", "manager", "employee"] },
        },
        {
          path: "team",
          name: "team",
          component: TeamManagementView,
          meta: { roles: ["admin"] },
        },
        {
          path: "tasks",
          name: "tasks",
          component: TasksView,
          meta: { roles: ["admin", "employee", "developer", "staff", "salesman", "manager"] },
        },
        {
          path: "settings",
          name: "settings",
          component: SettingsView,
          meta: { roles: ["admin"] },
        },
        {
          path: "approvals",
          name: "approvals",
          component: ApprovalsView,
          meta: { roles: ["admin", "super_admin"] },
        },
        {
          path: "expenses",
          name: "expenses",
          component: ExpensesView,
          meta: { roles: ["admin", "employee", "developer", "staff", "salesman", "manager"] },
        },
        {
          path: "sales",
          name: "sales",
          component: SalesView,
          meta: { roles: ["admin", "employee", "developer", "staff", "salesman", "manager"] },
        },
        {
          path: "profile",
          name: "profile",
          component: ProfileView,
          meta: { requiresAuth: true },
        },
        {
          path: "users",
          name: "users",
          component: UsersView,
          meta: { roles: ["admin"] },
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from) => {
  const auth = useAuthStore();

  // Initialize auth if not already done
  if (!auth.initialized && auth.isAuthenticated) {
    try {
      await auth.initializeAuth();
    } catch (error) {
      // Initialization failed, redirect to login
      return { path: "/login" };
    }
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { path: "/login", query: { redirect: to.fullPath } };
  }

  // Check if user is on a guest-only page but is authenticated
  if (to.meta.guestOnly && auth.isAuthenticated) {
    // Redirect to appropriate dashboard based on role
    if (auth.userRole === "super_admin") {
      return { path: "/super-admin" };
    }
    return { path: "/dashboard" };
  }

  // Check role-based access control
  if (to.meta.roles && auth.isAuthenticated && !auth.hasRole(to.meta.roles)) {
    // User doesn't have permission for this page
    // Determine which page they should redirect to based on their role
    let redirectPath = "/login";
    
    if (auth.userRole === "super_admin") {
      redirectPath = "/super-admin";
    } else if (["admin", "employee", "developer", "staff", "salesman", "manager"].includes(auth.userRole)) {
      redirectPath = "/employees";
    }

    // Only show toast if not already on the intended redirect page
    if (to.path !== redirectPath) {
      showToast({
        title: "Access denied",
        message: `You do not have permission to access this page. Your role is: ${auth.userRole}`,
        type: "warning",
      });
    }

    return { path: redirectPath };
  }

  return true;
});

export default router;
