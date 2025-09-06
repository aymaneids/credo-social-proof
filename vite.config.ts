import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        widget: './public/widget-embed.js'
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/widget': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/widget-embed.js': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
});
