/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testMatch: ['**/tests/unit/**.test.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
        'ts-jest',
      {
        tsconfig: 'tsconfig.node.json',
      }
    ]
  },
  coverageProvider: 'v8',
  coverageReporters: ['text', 'html'],
  coverageDirectory: 'coverage/jest',
  collectCoverageFrom: [
    '**/backend/controller/*.ts',
    '**/backend/router/*.ts',
    '!**/backend/router/H5PRouterFactory.ts',
    '**/frontend/src/factories/*.ts'
  ]
};