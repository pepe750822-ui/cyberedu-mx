import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './', // Use relative paths for assets in the final build
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // The final index.html will be placed in dist/index.html
  }
})
