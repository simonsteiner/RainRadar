
import express from 'express';
import proxy from 'express-http-proxy';

export const createProxyOptions = (pathResolver: (req: express.Request) => string, baseUrl: string) => ({
    proxyReqPathResolver: (req: express.Request) => {
        const path = pathResolver(req);
        console.log(`[${req.method}] Proxying to: ${baseUrl}${path}`);
        return path;
    },
    userResDecorator: (proxyRes: any, proxyResData: any, userReq: express.Request) => {
        console.log(`[${userReq.method}] Proxy response from ${userReq.originalUrl}: ${proxyRes.statusCode}`);
        return proxyResData;
    },
    proxyErrorHandler: (err: Error, res: express.Response) => {
        console.error('Proxy Error:', err);
        res.status(500).send('Proxy Error');
    }
});

export const createProxy = (baseUrl: string, pathResolver: (req: express.Request) => string) => {
    return proxy(baseUrl, createProxyOptions(pathResolver, baseUrl));
};