import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config: use React plugin with optional babel plugin and include HTML as assets
export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    sourcemap: true,
  },
});

