/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: [
    "<rootDir>/tests",
    "<rootDir>/app",
    "<rootDir>/data",
    "<rootDir>/types",
  ],
  testMatch: [
    "**/__tests__/**/*.{js,jsx,ts,tsx}",
    "**/?(*.)+(spec|test).{js,jsx,ts,tsx}",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "types/**/*.{ts,tsx}",
    "!**/*.d.ts",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

module.exports = config;
