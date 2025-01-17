// vite.config.js
import legacy from "file:///C:/xampp/htdocs/Ionic-app/ionic-test/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
import vue from "file:///C:/xampp/htdocs/Ionic-app/ionic-test/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import { defineConfig } from "file:///C:/xampp/htdocs/Ionic-app/ionic-test/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "C:\\xampp\\htdocs\\Ionic-app\\ionic-test";
var vite_config_default = defineConfig({
  optimizeDeps: {
    exclude: [
      // "node_modules/.vite/deps/chunk-46CPRG3S.js"
      // 'node_modules/.vite/deps/@ionic_storage.js?v=5ef27adf',
      // '/node_modules/.vite/deps/@capacitor_camera.js?v=b4d2e6ae'
      // Add any other problematic dependencies here
    ]
  },
  plugins: [
    vue(),
    legacy()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  test: {
    globals: true,
    environment: "jsdom"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFx4YW1wcFxcXFxodGRvY3NcXFxcSW9uaWMtYXBwXFxcXGlvbmljLXRlc3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXHhhbXBwXFxcXGh0ZG9jc1xcXFxJb25pYy1hcHBcXFxcaW9uaWMtdGVzdFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzoveGFtcHAvaHRkb2NzL0lvbmljLWFwcC9pb25pYy10ZXN0L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IGxlZ2FjeSBmcm9tICdAdml0ZWpzL3BsdWdpbi1sZWdhY3knXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZXhjbHVkZTogW1xuICAgICAgJ25vZGVfbW9kdWxlcy8udml0ZS9kZXBzL2NodW5rLTQ2Q1BSRzNTLmpzJyxcbiAgICAgIC8vICdub2RlX21vZHVsZXMvLnZpdGUvZGVwcy9AaW9uaWNfc3RvcmFnZS5qcz92PTVlZjI3YWRmJyxcbiAgICAgIC8vICcvbm9kZV9tb2R1bGVzLy52aXRlL2RlcHMvQGNhcGFjaXRvcl9jYW1lcmEuanM/dj1iNGQyZTZhZSdcbiAgICAgIC8vIEFkZCBhbnkgb3RoZXIgcHJvYmxlbWF0aWMgZGVwZW5kZW5jaWVzIGhlcmVcbiAgICBdLFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgdnVlKCksXG4gICAgbGVnYWN5KClcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgIH0sXG4gIH0sXG4gIHRlc3Q6IHtcbiAgICBnbG9iYWxzOiB0cnVlLFxuICAgIGVudmlyb25tZW50OiAnanNkb20nXG4gIH1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXdTLE9BQU8sWUFBWTtBQUMzVCxPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsb0JBQW9CO0FBSDdCLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLGNBQWM7QUFBQSxJQUNaLFNBQVM7QUFBQSxNQUNQO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFJRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLE9BQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxNQUFNO0FBQUEsSUFDSixTQUFTO0FBQUEsSUFDVCxhQUFhO0FBQUEsRUFDZjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
