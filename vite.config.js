import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
    return {
        plugins: [react()],
        // Use '/' for dev server, './' for production build (for relative paths)
        base: command === 'build' ? './' : '/',
        server: {
            host: true, // Listen on all addresses (0.0.0.0)
            port: 5173, // Explicit port
            strictPort: false, // Allow port fallback if 5173 is taken
            open: false, // Don't auto-open browser
        },
        preview: {
            host: true,
            port: 4173,
            strictPort: false,
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        // Separate React and React DOM into their own chunk
                        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                        // Separate PDF generation libraries
                        'pdf-vendor': ['jspdf'],
                        // Separate canvas libraries (if used)
                        'canvas-vendor': ['html2canvas'],
                        // Separate UI libraries
                        'ui-vendor': ['framer-motion', 'lucide-react'],
                    },
                },
            },
            chunkSizeWarningLimit: 600, // Increase limit slightly since we're splitting chunks
        },
    }
})
