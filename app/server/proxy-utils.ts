import express, { RequestHandler } from "express";
import proxy from "express-http-proxy";
import { CacheManager } from "./cache-manager";
import { CACHE } from "./config";

const cacheManager = new CacheManager(CACHE.MAX_AGE);

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
  proxyErrorHandler: (err: Error, res: express.Response) => {
    console.error("Proxy Error:", err);
    res.status(500).send("Proxy Error");
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
