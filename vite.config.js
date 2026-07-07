import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// On Render (and most PaaS), the platform injects the port to listen on via
// the PORT env var, and the service MUST bind to 0.0.0.0 (not localhost) so the
// platform can detect the open port.
const previewPort = Number(process.env.PORT) || 4173;

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  // Used by `vite preview` (production: serves the built ./dist folder).
  preview: {
    host: true, // bind 0.0.0.0 so Render detects the port
    port: previewPort, // use Render's $PORT
    allowedHosts: true, // accept the *.onrender.com host (and any custom domain)
  },
});