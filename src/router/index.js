import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/userStore";
import { useAdminStore } from "../stores/adminStore";

const routes = [
  {
    path: "/",
    name: "Explore",
    component: () => import("../pages/ExplorePage.vue"),
  },
  {
    path: "/facility/:id",
    name: "FacilityDetails",
    component: () => import("../pages/FacilityDetailsPage.vue"),
  },
  {
    path: "/map",
    name: "Map",
    component: () => import("../pages/MapPage.vue"),
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../pages/ProfilePage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../pages/LoginPage.vue"),
  },
  {
    path: "/favorites",
    name: "Favorites",
    component: () => import("../pages/FavoritesPage.vue"),
  },
  {
    path: "/compare",
    name: "Compare",
    component: () => import("../pages/ComparisonPage.vue"),
  },
  // Admin routes
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: () => import("../pages/admin/AdminLoginPage.vue"),
  },
  {
    path: "/admin",
    component: () => import("../pages/admin/AdminLayout.vue"),
    meta: { requiresAdmin: true },
    children: [
      {
        path: "",
        name: "AdminDashboard",
        component: () => import("../pages/admin/AdminDashboard.vue"),
      },
      {
        path: "facilities",
        name: "AdminFacilities",
        component: () => import("../pages/admin/AdminFacilities.vue"),
      },
      {
        path: "categories",
        name: "AdminCategories",
        component: () => import("../pages/admin/AdminCategories.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const userStore = useUserStore();
    if (!userStore.isAuthenticated) {
      return { name: "Login", query: { redirect: to.fullPath } };
    }
  }
  if (to.meta.requiresAdmin) {
    const adminStore = useAdminStore();
    if (!adminStore.isAuthenticated) {
      return { name: "AdminLogin" };
    }
  }
});

export default router;
