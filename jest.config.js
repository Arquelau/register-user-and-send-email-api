module.exports = {
  roots: ['<rootDir>/scr'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['<rootDir>/scr/**/*.ts'],
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
