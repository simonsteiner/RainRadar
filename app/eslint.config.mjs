import pkg from "globals";
const { browser, node } = pkg;
import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import htmlPlugin from "@html-eslint/parser";
import htmlRules from "@html-eslint/eslint-plugin";

// Generated output. public/js holds the esbuild bundles and public/vendor the
// files copied out of node_modules; linting either is meaningless and linting
// a 900 KB minified bundle is slow.
const GENERATED = ["public/js/**", "public/vendor/**"];

// `js.configs.recommended` and the typescript-eslint sets carry no `files`
// key, so they would otherwise apply to every file ESLint reaches, including
// the generated JS above.
const SOURCE = ["client/**/*.ts", "server/**/*.ts", "server.ts", "build.ts"];

const houseStyle = {
  quotes: ["error", "double"],
  indent: ["error", 2],
};

export default defineConfig([
  globalIgnores(GENERATED),
  {
    name: "TypeScript sources",
    files: SOURCE,
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    rules: houseStyle,
    linterOptions: {
      noInlineConfig: false,
      reportUnusedDisableDirectives: "warn"
    }
  },
  {
    name: "Node.js globals",
    files: ["server/**/*.ts", "server.ts", "build.ts"],
    languageOptions: { globals: node }
  },
  {
    name: "Browser globals",
    files: ["client/**/*.ts"],
    languageOptions: { globals: browser }
  },
  {
    name: "HTML files in /public",
    files: ["public/**/*.html"],
    plugins: { "html": htmlRules },
    languageOptions: { parser: htmlPlugin },
    rules: {
      "html/indent": ["error", 2],
      "html/require-doctype": "error"
    }
  }
]);
