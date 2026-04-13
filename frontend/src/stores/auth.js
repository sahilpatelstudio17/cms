import { computed, ref } from "vue";
import { defineStore } from "pinia";

import { getCompany, login as loginRequest, register as registerRequest, registerWithApproval as registerWithApprovalRequest, requestAdminApproval } from "../services/api";

const ACCESS_TOKEN_KEY = "access_token";
const USER_PROFILE_KEY = "auth_user_profile";

function parseTokenPayload(token) {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;
    const normalized = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(window.atob(normalized));
    return decoded;
  } catch {
    return null;
  }
}

// Load user profile from localStorage immediately on app load
function loadUserFromStorage() {
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem(ACCESS_TOKEN_KEY) || "");
  const user = ref(loadUserFromStorage()); // Load from localStorage immediately
  const loading = ref(false);
  const initialized = ref(false);

  const isAuthenticated = computed(() => Boolean(token.value));
  const userName = computed(() => user.value?.name || "User");
  const userRole = computed(() => user.value?.role || "employee");
  const isAdmin = computed(() => userRole.value === "admin" || userRole.value === "super_admin");

  function setToken(value) {
    token.value = value || "";
    if (token.value) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token.value);
      return;
    }
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  function setUser(value) {
    user.value = value || null;
    if (user.value) {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(user.value));
      return;
    }
    localStorage.removeItem(USER_PROFILE_KEY);
  }

  function hasRole(roles = []) {
    if (!roles || roles.length === 0) {
      return true;
    }
    return roles.includes(userRole.value);
  }

  function applyAuthResponse(result) {
    setToken(result?.token || "");
    setUser(result?.user || null);
  }

  async function login(email, password) {
    loading.value = true;
    try {
      const result = await loginRequest({ email, password });
      
      // Check if user account is pending approval
      if (result?.user?.status === "pending") {
        throw new Error("Your account is pending approval from an administrator. Please wait for confirmation.");
      }
      
      applyAuthResponse(result);
      return result;
    } finally {
      loading.value = false;
    }
  }

  async function signup(payload) {
    loading.value = true;
    try {
      const result = await registerRequest(payload);
      // Don't auto-login after signup - user must login manually
      // This allows admin approval to happen first if needed
      return result;
    } finally {
      loading.value = false;
    }
  }

  async function signupWithApproval(payload) {
    loading.value = true;
    try {
      const result = await registerWithApprovalRequest(payload);
      return result;
    } finally {
      loading.value = false;
    }
  }

  async function signupAdmin(payload) {
    loading.value = true;
    try {
      const result = await requestAdminApproval(payload);
      return result;
    } finally {
      loading.value = false;
    }
  }

  async function initializeAuth() {
    if (initialized.value) {
      return;
    }
    initialized.value = true;
    if (!token.value) {
      return;
    }

    loading.value = true;
    try {
      const tokenPayload = parseTokenPayload(token.value);
      const storedProfileRaw = localStorage.getItem(USER_PROFILE_KEY);
      let storedProfile = null;
      if (storedProfileRaw) {
        try {
          storedProfile = JSON.parse(storedProfileRaw);
        } catch {
          storedProfile = null;
        }
      }

      // Reuse stored profile first to avoid unnecessary /company calls.
      if (storedProfile?.name || storedProfile?.email || storedProfile?.role) {
        setUser({
          name: storedProfile?.name || "",
          email: storedProfile?.email || "",
          role: storedProfile?.role || tokenPayload?.role || "employee",
        });
        return;
      }

      const company = await getCompany();
      setUser({
        name: company?.name || "",
        email: company?.email || "",
        role: tokenPayload?.role || "employee",
      });
    } catch (error) {
      setToken("");
      setUser(null);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    setToken("");
    setUser(null);
  }

  function updateUserProfile(payload) {
    const nextUser = {
      ...(user.value || {}),
      name: payload?.name ?? user.value?.name ?? "",
      email: payload?.email ?? user.value?.email ?? "",
      role: payload?.role ?? user.value?.role ?? "employee",
    };
    setUser(nextUser);
    return nextUser;
  }

  // Aliases keep existing view components working while exposing standard names.
  const signIn = login;
  const signOut = logout;

  return {
    token,
    user,
    loading,
    initialized,
    isAuthenticated,
    userName,
    userRole,
    isAdmin,
    hasRole,
    setToken,
    setUser,
    login,
    signup,
    signupWithApproval,
    signupAdmin,
    logout,
    updateUserProfile,
    initializeAuth,
    signIn,
    signOut,
  };
});
