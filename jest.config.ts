/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';
import $ from 'jquery';

const config: Config = {
  clearMocks: true,
  //   collectCoverage: false,
  //   coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jsdom',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  setupFilesAfterEnv: ['<rootDir>/setup-jest.js'],
};

export default config;
