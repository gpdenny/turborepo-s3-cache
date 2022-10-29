module.exports = Object.assign(
  {
    roots: ["<rootDir>/src"],
    testMatch: ["**/__tests__/**/(*.)+spec.ts"],
    collectCoverageFrom: ["src/**/*", "!src/**/__tests__/**/*"],
  }
);
