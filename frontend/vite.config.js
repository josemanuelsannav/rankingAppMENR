import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@react-oauth/google': require.resolve('@react-oauth/google'),
    },
  },
});
