import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { copyFileSync } from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-dts',
      closeBundle() {
        copyFileSync('index.d.ts', 'dist/index.d.ts')
      }
    }
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/App.tsx'),
      name: 'react-select-country-mw',
      fileName: (format) => `react-select-country.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'tiny-pinyin-mw'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'tiny-pinyin-mw': 'tinyPinyinMw'
        }
      }
    }
  }
})
