import umamiModule from "@umami/node";
import type { UmamiEventData } from "@umami/node";

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

/**
 * Fire-and-forget wrapper around `umami.track`.
 *
 * Analytics must never affect request handling, so callers do not await this.
 * But `track` returns a promise that rejects when the Umami host is
 * unreachable, and an unhandled rejection terminates the Node process on
 * current versions — and the request middleware tracks *every* request, so an
 * analytics outage would take the server down with it. Swallow the rejection
 * here, once, instead of leaving each call site to remember.
 */
export const track = (event: object | string, eventData?: UmamiEventData): void => {
  void umami.track(event, eventData).catch((error: unknown) => {
    console.warn("Analytics tracking failed:", error);
  });
};
