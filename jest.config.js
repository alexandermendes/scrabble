module.exports = {
  clearMocks: true,
  collectCoverageFrom: ['src/**'],
  moduleNameMapper: { '\\.scss$': '<rootDir>/tests/basic-transformer.js' },
  setupFiles: ['<rootDir>/tests/setup'],
  setupFilesAfterEnv: ['<rootDir>/tests/extend'],
  transform: { '^.+\\.(js|jsx)?$': '<rootDir>/node_modules/babel-jest' },
};
