import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The cloud preview hostname changes per VM, so it is passed in at startup as
// PREVIEW_HOST instead of being written into this file.
export default defineConfig(() => {
  const previewHost = process.env.PREVIEW_HOST;
  const allowedHosts = previewHost ? [previewHost] : [];

  return {
    plugins: [react()],
    build: { rollupOptions: { output: { manualChunks: { motion: ['framer-motion'] } } } },
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      allowedHosts,
    },
    preview: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      allowedHosts,
    },
  };
});
