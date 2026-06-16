import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/',

  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        checklist: resolve(__dirname, 'src/checklist/index.html'),
        add_aircraft: resolve(__dirname, 'src/add_aircraft/index.html'),
        thankyou: resolve(__dirname, 'src/add_aircraft/thankyou.html'),
        // add new pages as needed here!
      },
    },
  },
});
