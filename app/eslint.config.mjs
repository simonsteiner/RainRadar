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
const SERVER_SOURCE = ["server/**/*.ts", "server.ts", "build.ts"];
const CLIENT_SOURCE = ["client/**/*.ts"];
const SOURCE = [...CLIENT_SOURCE, ...SERVER_SOURCE];

const houseStyle = {
  quotes: ["error", "double"],
  indent: ["error", 2],
};

export default defineConfig([
  globalIgnores(GENERATED),
  {
    name: "TypeScript sources",
    files: SOURCE,
    extends: [js.configs.recommended, ...tseslint.configs.recommendedTypeChecked],
    rules: houseStyle,
    linterOptions: {
      noInlineConfig: false,
      reportUnusedDisableDirectives: "warn"
    }
  },
  // The type-aware rules above need a type program, and client and server are
  // separate ones — `tsconfig.json` covers neither the DOM lib nor client/**,
  // so pointing the parser at a single project would leave half the tree
  // unresolvable. Each block therefore carries the tsconfig for its own half.
  {
    name: "Node.js globals",
    files: SERVER_SOURCE,
    languageOptions: {
      globals: node,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  {
    name: "Browser globals",
    files: CLIENT_SOURCE,
    languageOptions: {
      globals: browser,
      parserOptions: {
        project: "./tsconfig.client.json",
        tsconfigRootDir: import.meta.dirname
      }
    }
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
