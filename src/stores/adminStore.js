import { defineStore } from "pinia";
import { ref, computed } from "vue";

const ADMIN_CREDENTIALS = {
  login: "admin",
  password: "admin123",
};

export const useAdminStore = defineStore("admin", () => {
  const isAuthenticated = ref(localStorage.getItem("admin_auth") === "true");

  function login(login, password) {
    if (
      login === ADMIN_CREDENTIALS.login &&
      password === ADMIN_CREDENTIALS.password
    ) {
      isAuthenticated.value = true;
      localStorage.setItem("admin_auth", "true");
      return { success: true };
    }
    return { success: false, error: "Login yoki parol noto'g'ri" };
  }

  function logout() {
    isAuthenticated.value = false;
    localStorage.removeItem("admin_auth");
  }

  return { isAuthenticated, login, logout };
});
