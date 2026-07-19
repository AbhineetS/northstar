import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      { find: 'react-map-gl/maplibre', replacement: path.resolve(__dirname, './__mocks__/react-map-gl.js') },
      { find: 'react-map-gl', replacement: path.resolve(__dirname, './__mocks__/react-map-gl.js') }
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/__tests__/*',
        'src/app/layout.tsx',
        'src/app/globals.css'
      ],
      reporter: ['text', 'json', 'html'],
    }
  },
})
