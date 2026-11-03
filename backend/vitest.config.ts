import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    // Résout les alias de chemins déclarés dans tsconfig.json, y compris
    // ceux ajoutés par `nest g library`.
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    root: './',
    include: ['**/*.spec.ts'],
  },
});
