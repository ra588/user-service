import type { Config } from 'jest';

/**
 * Jest configuration for TypeScript unit tests.
 * Tests live under the "tests" folder.
 * We use Node test environment and ts-jest preset.
 */
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  clearMocks: true,
  verbose: true,
  testTimeout: 30000
};

export default config;
