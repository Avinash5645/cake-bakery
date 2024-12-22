module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 30000,
    moduleFileExtensions: ['js', 'ts'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/$1',
    },
    setupFiles: ['<rootDir>/jest.setup.ts'],
  };
  