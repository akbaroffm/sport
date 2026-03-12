import { defineStore } from "pinia";
import { ref, computed } from "vue";
import usersData from "../data/users.json";

export const useUserStore = defineStore("user", () => {
  const user = ref(JSON.parse(localStorage.getItem("sportuz_user") || "null"));
  const isAuthenticated = computed(() => !!user.value);

  function login(email, password) {
    const found = usersData.find(
      (u) => u.email === email && u.password === password,
    );
    if (found) {
      const { password: _, ...safeUser } = found;
      user.value = safeUser;
      localStorage.setItem("sportuz_user", JSON.stringify(safeUser));
      return { success: true };
    }
    return { success: false, error: "Invalid email or password" };
  }

  function signup(name, email, password, city) {
    const exists = usersData.find((u) => u.email === email);
    if (exists) return { success: false, error: "Email already registered" };

    const newUser = {
      id: "user-" + Date.now(),
      name,
      email,
      avatar: null,
      city,
      memberSince: new Date().toISOString().split("T")[0],
      favoriteCount: 0,
    };
    user.value = newUser;
    localStorage.setItem("sportuz_user", JSON.stringify(newUser));
    return { success: true };
  }

  function logout() {
    user.value = null;
    localStorage.removeItem("sportuz_user");
  }

  function updateProfile(updates) {
    if (user.value) {
      user.value = { ...user.value, ...updates };
      localStorage.setItem("sportuz_user", JSON.stringify(user.value));
    }
  }

  return { user, isAuthenticated, login, signup, logout, updateProfile };
});
