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
  }
};