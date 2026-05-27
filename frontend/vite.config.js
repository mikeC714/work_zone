import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5174,
    watch: {
      ignored: ['**/dist/**', '**/build/**', '**/storage/**'],
    }
  },
  plugins: [react()],
})