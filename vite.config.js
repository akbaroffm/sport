import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import VueDevTools from "vite-plugin-vue-devtools";

export default defineConfig({
  plugins: [vue(), tailwindcss(), VueDevTools()],
  server: {
    port: 3000,
    host: true,
  },
});
