import express, { RequestHandler } from "express";
import proxy from "express-http-proxy";
import { CacheManager } from "./cache-manager";
import { CACHE, RETRY } from "./config";

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

const retryRequest = async (
  proxyFn: () => Promise<any>,
  maxAttempts: number = RETRY.MAX_ATTEMPTS
): Promise<any> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await proxyFn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts - 1) {
        const delay = getBackoffDelay(attempt);
        console.log(`Retry attempt ${attempt + 1}/${maxAttempts} after ${delay}ms`);
        await sleep(delay);
      }
    }
  }
  throw lastError!;
};

export const createProxyOptions = (
  pathResolver: (req: express.Request) => string,
  baseUrl: string
) => ({
  proxyReqPathResolver: (req: express.Request) => {
    const path = pathResolver(req);
    console.log(`[${req.method}] Proxying to: ${baseUrl}${path}`);
    return path;
  },
  userResDecorator: (
    proxyRes: any,
    proxyResData: any,
    userReq: express.Request
  ) => {
    const path = userReq.originalUrl;
    console.log(
      `[${userReq.method}] Proxy response from ${path}: ${proxyRes.statusCode}`
    );

    if (proxyRes.statusCode === 200) {
      cacheManager.set(path, proxyResData);
    }
    return proxyResData;
  },
  proxyErrorHandler: async (err: Error, res: express.Response, next: () => void) => {
    try {
      await retryRequest(() => Promise.reject(err));
    } catch (finalError) {
      console.error("Proxy Error after all retries:", finalError);
      res.status(500).send("Proxy Error");
    }
  },
});

export const createProxy = (
  baseUrl: string,
  pathResolver: (req: express.Request) => string
): RequestHandler => {
  const proxyMiddleware = proxy(
    baseUrl,
    createProxyOptions(pathResolver, baseUrl)
  );

  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const cachedData = cacheManager.get(req.originalUrl);
    if (cachedData) {
      console.log(
        `[${req.method}] Serving cached response for: ${req.originalUrl}`
      );
      res.send(cachedData);
      return next();
    }
    proxyMiddleware(req, res, next);
  };
};
