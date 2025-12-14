import * as path from 'path'
import tailwindcss from '@tailwindcss/vite'
import viteRestart from 'vite-plugin-restart';

export default ({ command }) => ({
  base: command === 'serve' ? '' : '/dist/',
  publicDir: 'src/public',
  build: {
    manifest: true,
    outDir: 'web/dist/',
    emptyOutDir: true,
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: './src/index.ts',
      },
      output: {
        dir: 'web/dist/',
      }
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    origin: `${process.env.DDEV_PRIMARY_URL}:3000`,
    cors: {
      origin: /https?:\/\/([A-Za-z0-9\-\.]+)?(localhost|\.local|\.test|\.site)(?::\d+)?$/
    }
  },
  plugins: [
    tailwindcss(),
    viteRestart({
      reload: [
        'templates/**/*',
        'src/**/*',
      ]
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@css': path.resolve(__dirname, 'src/css'),
      '@js': path.resolve(__dirname, 'src/js'),
    },
    preserveSymlinks: true,
  },
});