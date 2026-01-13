import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // proxy
  server: {
    proxy: {
      "/ks-api": {
        target: "https://ks-backend.digitalindiacorporation.in",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/ks-api/, ""),
      },
    },
  },
});
