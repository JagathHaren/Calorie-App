
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Fix: Replaced process.cwd() with '.' to avoid the TS error "Property 'cwd' does not exist on type 'Process'".
  // In the context of vite.config.ts, '.' typically refers to the project root where .env files reside.
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    define: {
      // This ensures process.env.API_KEY works in the browser
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_API_KEY)
    },
    server: {
      host: true,
      port: 5173
    }
  };
});
