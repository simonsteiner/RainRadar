import umamiModule from "@umami/node";

/**
 * `@umami/node` is CommonJS carrying an ESM-style default export. Under
 * ts-node's CommonJS interop `import umami from "@umami/node"` resolved to the
 * singleton, but Node's ESM interop ignores the `__esModule` marker and binds
 * the default to `module.exports` instead — so the same import would yield the
 * namespace object and every `umami.track(...)` would throw.
 *
 * Unwrapping once here keeps every caller on the one instance that server.ts
 * initialises.
 */
export const umami = umamiModule.default;
