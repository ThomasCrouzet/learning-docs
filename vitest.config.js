const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    include: ['scripts/__tests__/**/*.test.js'],
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['scripts/lib/**/*.js'],
      reporter: ['text', 'lcov'],
    },
  },
});
