import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { UserConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.ts',
  } as UserConfig['test'],
  optimizeDeps: {
    exclude: ['pg'],
  },
  ssr: {
    noExternal: ['pg'],
  },
  resolve: {
    alias: {
      'cloudflare:sockets': './src/mocks/cloudflare-sockets.ts'
    }
  }
})