module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "eslint-comments",
    "jest",
    "promise",
    "unicorn",
    "cypress",
    "import",
  ],
  extends: [
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:eslint-comments/recommended",
    "plugin:jest/recommended",
    "plugin:promise/recommended",
    "plugin:unicorn/recommended",
    "prettier",
    "prettier/react",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
    "plugin:cypress/recommended",
    "plugin:monorepo/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
  ],
  env: {
    node: true,
    browser: true,
    jest: true,
    es6: true,
    "cypress/globals": true,
  },
  ignorePatterns: [
    "**/node_modules",
    "**/generated",
    "**/build",
    "cypress/integration/examples/*",
  ],
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      alias: {
        map: [
          ["~", "packages"],
          ["@grammar-tutor/grammar-tutor", "packages/grammar-tutor/src/"],
          ["@grammar-tutor/peasecod", "packages/peasecod/src/"],
          ["@grammar-tutor/ui", "packages/ui/src/"],
        ],
        extensions: [
          ".js",
          ".jsx",
          ".ts",
          ".tsx",
          ".mjs",
          ".json",
          ".gql",
          ".graphql",
        ],
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
  },
  rules: {
    "max-depth": ["error", 4],
    "max-lines": [
      "error",
      {
        max: 300,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
    "max-len": [
      1,
      80,
      2,
      {
        ignorePattern: "^import\\s.+\\sfrom\\s.+;$",
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true,
      },
    ],
    // Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
    "no-prototype-builtins": "off",
    // https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html
    "import/named": "off",
    "import/namespace": "off",
    "import/prefer-default-export": "off",
    "import/no-default-export": "error",
    // Too restrictive: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
    "react/destructuring-assignment": "off",
    // No jsx extension: https://github.com/facebook/create-react-app/issues/87#issuecomment-234627904
    "react/jsx-filename-extension": "off",
    // Use function hoisting to improve code readability
    "no-use-before-define": [
      "error",
      { functions: false, classes: true, variables: true },
    ],
    "@typescript-eslint/no-use-before-define": [
      "error",
      { functions: false, classes: true, variables: true, typedefs: true },
    ],
    // Common abbreviations are known and readable
    "unicorn/prevent-abbreviations": "off",
    // Unnecessary in typescript
    "react/prop-types": "off",
    // Too restrictive
    "eslint-comments/disable-enable-pair": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    // Conflicts with ramda placeholder,
    "no-underscore-dangle": "off",
    "no-restricted-globals": "off",
    // Doesn't work in mono-repo
    "import/no-extraneous-dependencies": "off",
    "unicorn/filename-case": [
      "error",
      { cases: { camelCase: true, pascalCase: true } },
    ],
  },
};
