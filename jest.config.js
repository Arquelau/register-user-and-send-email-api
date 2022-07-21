module.exports = {
  roots: ['<rootDir>/src/', '<rootDir>/test/'],
  modulePaths: [
    '<rootDir>/src'
  ],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!**/test/**',
    '!**/config/**'],
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/test/$1'
  }
}
