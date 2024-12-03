import express from "express";
import path from "path";
import proxy from "express-http-proxy";

const app = express();
const port = process.env.PORT || 3300;

app.use(
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res, path) => {
      if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "text/javascript; charset=utf-8");
      }
      if (path.endsWith(".json")) {
        res.setHeader("Content-Type", "application/json");
      }
      if (path.endsWith(".html")) {
        res.setHeader("Content-Type", "text/html");
      }
    },
  })
);

app.use('/api/versions', proxy('https://www.meteoswiss.admin.ch', {
  proxyReqPathResolver: () => '/product/output/versions.json'
}));

app.use('/api/precipitation/:version', proxy('https://www.meteoswiss.admin.ch', {
  proxyReqPathResolver: (req: express.Request): string => `/product/output/precipitation/animation/version__${req.params.version}/en/animation.json`
}));

app.use('/api/product/output/*', proxy('https://www.meteoswiss.admin.ch/', {
  proxyReqPathResolver: (req: express.Request): string => {
    const path = `/product/output/${req.params[0]}`;
    console.debug(`Proxying request to: ${path}`);
    return path;
  },
  userResDecorator: (proxyRes, proxyResData) => {
    console.debug(`Received response with status: ${proxyRes.statusCode}`);
    return proxyResData;
  }
}));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
