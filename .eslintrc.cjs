module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "script",
  },
  overrides: [
    {
      files: ["*.cjs", "*.mjs"],
      env: {
        node: true,
      },
      parserOptions: {
        sourceType: "module",
      },
    },
  ],
  rules: {
    "no-unused-vars": [
      "warn",
      {
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
      },
    ],
  },
};
