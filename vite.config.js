import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist', 
    assetsDir: 'assets', 
  },
  optimizeDeps: {
    exclude: [
      // 'node_modules/.vite/deps/chunk-46CPRG3S.js',
      '/node_modules/.vite/deps/capacitor-datetime-setting.js?v=7dc6bcb1',
      '/node_modules/.vite/deps/vuetify_lib_framework.js?v=de410ace'
    ],
  },
  plugins: [
    vue(),
    legacy()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
