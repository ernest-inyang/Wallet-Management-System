import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
        '**/tests/**/*.spec.ts',
    ],
    setupFilesAfterEnv: [
        '<rootDir>/tests/setup.ts',
    ],

    roots: ['<rootDir>/tests'],

    moduleFileExtensions: ['ts', 'js'],

    moduleNameMapper: {
        '^@common/(.*)$': '<rootDir>/src/common/$1',
        '^@config/(.*)$': '<rootDir>/src/config/$1',
        '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    },

    clearMocks: true,
    restoreMocks: true,
    resetMocks: true,

    collectCoverage: true,

    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/server.ts',
        '!src/app.ts',
        '!src/config/**',
    ],

    coverageDirectory: 'coverage',
};

export default config;