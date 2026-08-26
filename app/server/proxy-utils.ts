import express from "express";
import type { RequestHandler } from "express";
import type { IncomingMessage } from "http";
import proxy from "express-http-proxy";
import { track } from "./analytics.ts";
import { CacheManager } from "./cache-manager.ts";
import { CACHE, RETRY } from "./config.ts";

const cacheManager = new CacheManager(CACHE.MAX_AGE);

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getBackoffDelay = (attempt: number): number => {
  const exponentialDelay = Math.min(
    RETRY.INITIAL_DELAY * Math.pow(2, attempt),
    RETRY.MAX_DELAY
  );
  const jitter = Math.floor(Math.random() * RETRY.JITTER_MAX);
  return exponentialDelay + jitter;
};

const isLocalEnvironment = () => {
  return process.env.NODE_ENV !== "production" || 
         process.env.HOSTNAME?.includes("localhost");
};

const environment = isLocalEnvironment() ? "local" : "production";

const retryRequest = async <T>(
  proxyFn: () => Promise<T>,
  maxAttempts: number = RETRY.MAX_ATTEMPTS
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await proxyFn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts - 1) {
        const delay = getBackoffDelay(attempt);
        console.log(`Retry attempt ${attempt + 1}/${maxAttempts} after ${delay}ms`);
        track({ 
          url: "/server-side/proxy-retry",
          event: "proxy_retry",
          data: { attempt: attempt + 1, delay, environment }
        });
        await sleep(delay);
      }
    }
  }
  throw lastError!;
};

/**
 * A path resolver returns `null` to reject the request. Validation therefore
 * lives next to the URL it builds, and `createProxy` turns a `null` into a 400
 * before the proxy ever runs — so nothing downstream has to represent a state
 * that cannot happen.
 */
export type ProxyPathResolver = (req: express.Request) => string | null;

// Takes the already-resolved path rather than the resolver, so the type is
// total: by the time these options exist the path is known good.
export const createProxyOptions = (path: string, baseUrl: string) => ({
  proxyReqPathResolver: (req: express.Request) => {
    console.log(`[${req.method}] Proxying to: ${baseUrl}${path}`);
    return path;
  },
  userResDecorator: (
    proxyRes: IncomingMessage,
    proxyResData: Buffer,
    userReq: express.Request
  ) => {
    const path = userReq.originalUrl;
    console.log(
      `[${userReq.method}] Proxy response from ${path}: ${proxyRes.statusCode}`
    );

    // Handle JSON responses properly
    if (proxyRes.headers["content-type"]?.includes("application/json")) {
      const data = proxyResData.toString("utf8");
      if (proxyRes.statusCode === 200) {
        cacheManager.set(path, data);
        track({ 
          url: "/server-side/proxy-success",
          event: "proxy_success",
          data: { path, statusCode: proxyRes.statusCode, environment }
        });
      }
      return data;
    }

    // Return raw data for other content types
    return proxyResData;
  },
  proxyErrorHandler: async (err: Error, res: express.Response) => {
    try {
      await retryRequest(() => Promise.reject(err));
    } catch (finalError) {
      console.error("Proxy Error after all retries:", finalError);
      track({ 
        url: "/server-side/proxy-error",
        event: "proxy_error",
        data: { error: (finalError as Error).message, environment }
      });
      res.status(500).send("Proxy Error");
    }
  },
});

export const createProxy = (
  baseUrl: string,
  resolvePath: ProxyPathResolver
): RequestHandler => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // Resolve up front: a request the resolver rejects never reaches the proxy,
    // and the proxy is only ever handed a validated path.
    const path = resolvePath(req);
    if (path === null) {
      res.status(400).send("Bad Request");
      return;
    }

    const cachedData = cacheManager.get(req.originalUrl);
    if (cachedData) {
      console.log(
        `[${req.method}] Serving cached response for: ${req.originalUrl}`
      );
      track({ 
        url: "/server-side/proxy-cache-hit",
        event: "proxy_cache_hit",
        data: { path: req.originalUrl, environment }
      });
      // Only JSON bodies are ever cached (see userResDecorator), and a bare
      // res.send of a string would label them text/html.
      res.type("application/json").send(cachedData);
      // No next(): the response is complete. Passing control on would run
      // downstream handlers against a finished response.
      return;
    }
    // Built per request so the options can close over the resolved path.
    // `proxy()` only asserts its host and returns a closure — the option
    // normalisation that looks expensive here already runs per request inside
    // the library.
    proxy(baseUrl, createProxyOptions(path, baseUrl))(req, res, next);
  };
};
