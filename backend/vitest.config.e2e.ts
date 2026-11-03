import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    env: {
      NODE_ENV: 'test',
      DB_TYPE: 'sqljs',
      // Chaîne vide : base en mémoire, isolée pour chaque suite de tests.
      DB_LOCATION: '',
      DB_SYNCHRONIZE: 'true',
      SWAGGER_ENABLED: 'false',
      JWT_SECRET: 'test-secret-0123456789abcdef0123456789abcdef',
    },
  },
});
