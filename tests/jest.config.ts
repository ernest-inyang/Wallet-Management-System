import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',

  testEnvironment: 'node',

  roots: ['<rootDir>/tests'],

  moduleNameMapper: {
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
  },

  clearMocks: true,

  collectCoverageFrom: ['src/**/*.ts'],
};

export default config;