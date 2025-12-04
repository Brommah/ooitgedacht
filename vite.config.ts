import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // SECURITY: API key must be provided via environment variable
    // Create a .env file with GEMINI_API_KEY=your_key_here
    const apiKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '';
    
    if (!apiKey && mode === 'production') {
      console.warn('⚠️  Warning: GEMINI_API_KEY is not set. Image generation will not work.');
    }
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      optimizeDeps: {
        include: ['gsap', '@gsap/react', 'roughjs']
      },
      define: {
        'process.env.API_KEY': JSON.stringify(apiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(apiKey)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              'vendor-react': ['react', 'react-dom'],
              'vendor-animation': ['framer-motion', 'gsap', '@gsap/react'],
              'vendor-roughjs': ['roughjs'],
              'vendor-icons': ['lucide-react'],
            }
          }
        }
      }
    };
});
