import { defineConfig } from 'vite';

export default defineConfig({
  base: '/qc-dashboard2/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        pm: 'src/pmPage.html',
      },
    },
  }
});