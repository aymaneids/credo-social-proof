import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Ensure React is properly included in production
      include: '**/*.{jsx,tsx}',
    })
  ],
  define: {
    // Ensure global React is available
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom']
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        widget: './public/widget-embed.js'
      }
    },
    sourcemap: false,
    minify: 'esbuild'
  },
  server: {
    port: 5173,
    host: true,
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
