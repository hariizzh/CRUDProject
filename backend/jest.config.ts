// /** @type {import('ts-jest').JestConfigWithTsJest} */
import type { Config } from 'jest'
const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/**/*.test.ts'],
    verbose: true,
    forceExit: true,
    testTimeout: 30000
}

export default config