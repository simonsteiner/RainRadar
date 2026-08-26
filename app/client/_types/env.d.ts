/**
 * `process` never exists in the browser — esbuild's `define` (see build.ts)
 * substitutes `process.env.MAPTILER_KEY` with a string literal at build time.
 * Declared here so the client type-check stays free of @types/node.
 */
declare const process: {
  env: {
    MAPTILER_KEY: string;
  };
};
