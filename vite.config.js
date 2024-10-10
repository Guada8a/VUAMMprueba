import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/VUAMMprueba/',
  build: {
    lib: {
      entry: {
        // 'dynamic-table': './src/DynamicTableElement.jsx',
        'vuamm-card': './src/components/DashboardCard.jsx',
      },
      name: 'VUAMM-front',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => `vuamm-front.${format}.js`, // Puedes combinar ambos en un solo archivo
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'antd', 'axios', 'react-router-dom', 'prop-types'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          antd: 'antd',
          axios: 'axios',
          'react-router-dom': 'ReactRouterDOM',
          'prop-types': 'PropTypes',
        },
      },
    },
  },
});
