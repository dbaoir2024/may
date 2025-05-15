import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.ts',
  },
  optimizeDeps: {
    exclude: ['pg'],
    
  },
  ssr: {
    noExternal: ['pg'],
  },
});