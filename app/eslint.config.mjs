import pkg from "globals";
const { browser, node } = pkg;
import tseslint from "typescript-eslint";
import htmlPlugin from "@html-eslint/parser";
import htmlRules from "@html-eslint/eslint-plugin";

export default [
  {
    name: "Node.js TypeScript files",
    files: ["server/**/*.ts", "build.ts", "server.ts"],
    plugins: {
      "@typescript-eslint": tseslint.plugin
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tseslint.parser,
      globals: {
        ...node
      },
      parserOptions: {
        project: "./tsconfig.json"
      }
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      quotes: ["error", "double"]
    },
    linterOptions: {
      noInlineConfig: false,
      reportUnusedDisableDirectives: "warn"
    },
    settings: {
      node: true
    }
  },
  {
    name: "Browser TypeScript files",
    files: ["client/**/*.ts"],
    plugins: {
      "@typescript-eslint": tseslint.plugin
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tseslint.parser,
      globals: browser,
      parserOptions: {
        project: "./tsconfig.client.json"
      }
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      quotes: ["error", "double"]
    },
    linterOptions: {
      noInlineConfig: false,
      reportUnusedDisableDirectives: "warn"
    },
    settings: {
      browser: true
    }
  },
  {
    name: "HTML files in /public",
    files: ["public/**/*.html"],
    plugins: {
      "html": htmlRules
    },
    languageOptions: {
      parser: htmlPlugin
    },
    rules: {
      "html/indent": ["error", 2],
      "html/require-doctype": "error"
    }
  }
];