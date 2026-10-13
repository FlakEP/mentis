// Einstellungen für die automatischen Tests (Vitest). Tests liegen neben dem Code als *.test.ts.
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
