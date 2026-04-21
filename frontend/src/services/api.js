import axios from "axios";
import { beginLoading, endLoading, showToast } from "./ui";

const ACCESS_TOKEN_KEY = "access_token";

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  // baseURL: import.meta.env.VITE_API_BASE_URL || "https://cms-6eiy.onrender.com/api",
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://cms-6eiy.onrender.com/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  beginLoading(); 
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    endLoading();
    return response;
  },
  (error) => {
    endLoading();
    const status = error?.response?.status || 0;
    const backendMessage = error?.response?.data?.error || error?.response?.data?.message;
    const message =
      backendMessage ||
      error?.message ||
      "Unexpected API error. Please try again.";

    console.error("API Error:", {
      status,
      message,
      data: error?.response?.data,
      url: error?.config?.url,
      method: error?.config?.method,
    });

    if (status === 401) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    } else if (status !== 400) {
      showToast({
        title: "Request failed",
        message,
        type: "error",
      });
    }

    return Promise.reject({
      status,
      message,
      details: error?.response?.data || null,
      originalError: error,
    });
  }
);

export async function login(payload) {
  const response = await api.post("/auth/login", payload);
  return response.data.data;
}

export async function register(payload) {
  const response = await api.post("/auth/register", payload);
  return response.data.data;
}

export async function registerWithApproval(payload) {
  const response = await api.post("/auth/register-with-approval", payload);
  return response.data.data;
}

export async function requestAdminApproval(payload) {
  const response = await api.post("/auth/request-admin-approval", payload);
  return response.data.data;
}

export async function getCompany() {
  const response = await api.get("/company");
  return response.data.data;
}

export async function updateCompany(payload) {
  const response = await api.put("/company", payload);
  return response.data.data;
}

export async function getEmployees(params = { page: 1, limit: 100 }) {
  const response = await api.get("/employees", { params });
  return response.data.data;
}

export async function createEmployee(payload) {
  const response = await api.post("/employees", payload);
  return response.data.data;
}

export async function updateEmployee(id, payload) {
  const response = await api.put(`/employees/${id}`, payload);
  return response.data.data;
}

export async function deleteEmployee(id) {
  await api.delete(`/employees/${id}`);
}

export async function getTasks(params = { page: 1, limit: 100 }) {
  const response = await api.get("/tasks", { params });
  return response.data.data;
}

export async function createTask(payload) {
  const response = await api.post("/tasks", payload);
  return response.data.data;
}

export async function updateTask(id, payload) {
  const response = await api.put(`/tasks/${id}`, payload);
  return response.data.data;
}

export async function deleteTask(id) {
  await api.delete(`/tasks/${id}`);
}

export async function listApprovals() {
  const response = await api.get("/approvals");
  return response.data.data;
}

export async function approveUser(approvalId) {
  const response = await api.post(`/approvals/${approvalId}/approve`);
  return response.data;
}

export async function rejectUser(approvalId, payload) {
  const response = await api.post(`/approvals/${approvalId}/reject`, payload);
  return response.data;
}

// Role Assignment API functions
export async function getRoleAssignments() {
  const response = await api.get("/role-assignments/pending");
  return response.data.data;
}

export async function approveRoleAssignment(approvalId) {
  const response = await api.post(`/role-assignments/${approvalId}/approve`);
  return response.data;
}

export async function rejectRoleAssignment(approvalId, payload) {
  const response = await api.post(`/role-assignments/${approvalId}/reject`, payload);
  return response.data;
}

// Admin Approval API functions
export async function getPendingAdminRequests() {
  const response = await api.get("/approvals/admin/pending");
  return response.data.data;
}

export async function approveAdminRequest(approvalId) {
  const response = await api.post(`/approvals/admin/${approvalId}/approve`);
  return response.data;
}

export async function rejectAdminRequest(approvalId, payload) {
  const response = await api.post(`/approvals/admin/${approvalId}/reject`, payload);
  return response.data;
}

// Employee Approval API functions
export async function requestEmployeeApproval(payload) {
  const response = await api.post("/approvals/employee/request", payload);
  return response.data.data;
}

export async function getPendingEmployeeApprovals() {
  const response = await api.get("/approvals/employee/pending");
  return response.data.data;
}

export async function approveEmployeeRequest(approvalId) {
  const response = await api.post(`/approvals/employee/${approvalId}/approve`);
  return response.data;
}

export async function rejectEmployeeRequest(approvalId, payload) {
  const response = await api.post(`/approvals/employee/${approvalId}/reject`, payload);
  return response.data;
}

// User Approval API functions
export async function requestUserApproval(payload) {
  const response = await api.post("/approvals/user/request", payload);
  return response.data.data;
}

export async function getPendingUserApprovals() {
  const response = await api.get("/approvals/user/pending");
  return response.data.data;
}

export async function approveUserRequest(approvalId) {
  const response = await api.post(`/approvals/user/${approvalId}/approve`);
  return response.data;
}

export async function rejectUserRequest(approvalId, payload) {
  const response = await api.post(`/approvals/user/${approvalId}/reject`, payload);
  return response.data;
}

// Company Signup Approval API functions
export async function getPendingCompanySignups() {
  const response = await api.get("/approvals/company/pending");
  return response.data.data;
}

export async function approveCompanySignup(approvalId) {
  const response = await api.post(`/approvals/company/${approvalId}/approve`);
  return response.data;
}

// Expense API functions
export async function listExpenses(params = {}) {
  const response = await api.get("/expenses", { params });
  return response.data.data;
}

export async function createExpense(payload) {
  const response = await api.post("/expenses", payload);
  return response.data.data;
}

export async function listPendingExpenses() {
  const response = await api.get("/expenses/pending");
  return response.data.data;
}

export async function approveExpense(expenseId) {
  const response = await api.post(`/expenses/${expenseId}/approve`);
  return response.data;
}

export async function rejectExpense(expenseId, payload) {
  const response = await api.post(`/expenses/${expenseId}/reject`, payload);
  return response.data;
}

// Sales API functions
export async function listSales(params = {}) {
  const response = await api.get("/sales", { params });
  return response.data.data;
}

export async function createSale(payload) {
  const response = await api.post("/sales", payload);
  return response.data.data;
}

export async function updateSale(saleId, payload) {
  const response = await api.put(`/sales/${saleId}`, payload);
  return response.data.data;
}

export async function deleteSale(saleId) {
  await api.delete(`/sales/${saleId}`);
}

export async function listPendingSales() {
  const response = await api.get("/sales/pending");
  return response.data.data;
}

export async function approveSale(saleId) {
  const response = await api.post(`/sales/${saleId}/approve`);
  return response.data;
}

export async function rejectSale(saleId, payload) {
  const response = await api.post(`/sales/${saleId}/reject`, payload);
  return response.data;
}

export default api;
