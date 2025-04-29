import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build:{
    lib:{
      entry:path.resolve(__dirname, 'src/index.ts'),
      name:"MapcChart",
      fileName:(format) => `mapc-chart.${format}.js`,
    },
    rollupOptions:{
      // Externalize deps that shouldn't be bundled
      external: ['react', 'react-dom', 'd3'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          d3: 'd3',
        },
      },
    },
  },
});
