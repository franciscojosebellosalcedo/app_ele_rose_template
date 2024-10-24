import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import autoprefixer from 'autoprefixer'

export default defineConfig(() => {
  return {
    base: './',
    build: {
      outDir: 'build',
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({}), // add options if needed
        ],
      },
      preprocessorOptions: {
        scss: {
          quietDeps: true,
        },
      },
    },
    esbuild: {
      loader: 'tsx', // Cambia 'jsx' a 'tsx' para TypeScript
      include: /src\/.*\.[tj]sx?$/, // Incluye tanto TS como JS
      exclude: [],
    },
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
          '.ts': 'tsx', // Soporta también TypeScript
          '.tsx': 'tsx'
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: 'src/',
          replacement: `${path.resolve(__dirname, 'src')}/`,
        },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'], // Añade '.ts' y '.tsx'
    },
    server: {
      port: 8000,
      proxy: {
        // https://vitejs.dev/config/server-options.html
      },
    },
  }
})
