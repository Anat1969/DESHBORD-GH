import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// On Vercel base is "/", on GitHub Pages it's "/DESHBORD-GH/"
const base = process.env.VERCEL ? '/' : '/DESHBORD-GH/'

export default defineConfig({
  plugins: [react()],
  base,
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
