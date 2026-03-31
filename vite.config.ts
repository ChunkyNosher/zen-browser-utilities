import { defineConfig } from 'vite-plus';

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: 'src/index.js',
      formats: ['iife'],
      name: 'ZenBrowserUtilities',
      fileName: () => 'zen-browser-utilities.uc.js',
    },
    minify: false,
    outDir: 'dist',
    rollupOptions: {
      output: {
        banner: `/**
 * Zen Browser Utilities Mod
 * Version: 0.2.0
 * License: MIT
 *
 * Built with Vite+ from the src/ directory.
 */`,
      },
    },
    target: 'es2022',
  },
  fmt: {
    semi: true,
    singleQuote: true,
  },
  lint: {
    ignorePatterns: ['node_modules/**', 'dist/**', 'zen-browser-utilities.uc.js'],
  },
  test: {
    globals: true,
    include: ['tests/**/*.test.js'],
  },
});
