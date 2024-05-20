module.exports = {
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "prettier",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "next",
  ],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
  },
  parserOptions: {
    project,
    tsconfigRootDir: process.cwd(),
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "import"],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ["*.js", "node_modules/", "dist/"],
  rules: {
    // next.js에서 img 태그 쓸 수 있게 하기
    "@next/next/no-img-element": "off",
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        groups: [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling", "index"],
        ],
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    semi: ["error", "always"],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", ignoreRestSiblings: true },
    ],
    "no-console": "warn", // 콘솔 로그 경고
  },
};
