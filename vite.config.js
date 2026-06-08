import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/DESHBORD-GH/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'app')
    }
  },
  build: {
    outDir: 'dist'
  },
  server: {
    port: parseInt(process.env.PORT || '3000')
  }
})
