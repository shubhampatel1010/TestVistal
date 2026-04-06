import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'sw-version-inject',
      writeBundle({ dir }) {
        if (!dir) return
        const swPath = path.resolve(dir, 'sw.js')
        if (fs.existsSync(swPath)) {
          let content = fs.readFileSync(swPath, 'utf-8')
          content = content.replace('__SW_BUILD_ID__', Date.now().toString())
          fs.writeFileSync(swPath, content)
        }
      }
    }
  ],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true
  }
})
