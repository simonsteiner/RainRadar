import { createProxy } from "./server/proxy-utils.ts";
import { SERVER, METEOSWISS } from "./server/config.ts";
import { staticFiles, requestLogger, corsHeaders } from "./server/middleware.ts";
import express from "express";
import path from "path";
import rateLimit from "express-rate-limit";
import { umami, track } from "./server/analytics.ts";

const app = express();

const isLocalEnvironment = () => {
  return (
    process.env.NODE_ENV !== "production" ||
    SERVER.PORT === 3000 ||
    process.env.HOSTNAME?.includes("localhost")
  );
};

const environment = isLocalEnvironment() ? "local" : "production";

// Initialize Umami
umami.init({
  websiteId: "572f796d-9334-408a-b3af-9f9a3520b0d7",
  hostUrl: "https://cloud.umami.is",
});

// Middleware
app.use(staticFiles);
app.use((req, res, next) => {
  track({
    url: req.path,
    data: { environment },
  });
  next();
});

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50, // limit each IP to 50 requests per minute
  message: "Too many requests, please try again later.",
});

// Root route handler with rate limiting
app.get("/", limiter, (req, res) => {
  res.sendFile(path.join(import.meta.dirname, "public", "index.html"));
});

app.use("/api", requestLogger);
app.use("/api", corsHeaders);

// Proxy routes
app.use(
  "/api/versions.json",
  createProxy(METEOSWISS.BASE_URL, () => METEOSWISS.VERSIONS_PATH),
);

// MeteoSwiss publishes version ids as timestamps of the form YYYYMMDD_HHMM
// (see /product/output/versions.json).
const VERSION_ID = /^\d{8}_\d{4}$/;

/**
 * Express types a route param as `string | string[]`, because a repeated param
 * arrives as an array — and an array interpolated into the upstream path
 * stringifies to `a,b`, building a URL this code never intended. Narrow by
 * validating rather than by asserting the type away; returning `null` makes
 * createProxy reject the request with a 400.
 */
const parseVersion = (value: string | string[] | undefined): string | null =>
  typeof value === "string" && VERSION_ID.test(value) ? value : null;

app.use(
  "/api/precipitation/:version/animation.json",
  createProxy(METEOSWISS.BASE_URL, (req: express.Request) => {
    const version = parseVersion(req.params.version);
    if (version === null) return null;
    return `${METEOSWISS.PRECIPITATION_PATH}/version__${version}/en/animation.json`;
  }),
);

app.use(
  "/api/product/output",
  createProxy(METEOSWISS.BASE_URL, (req: express.Request) =>
    req.originalUrl.replace(/^\/api/, ""),
  ),
);

app.listen(SERVER.PORT, () => {
  console.log(`Environment: ${environment}`);
  console.log(`Server running at http://localhost:${SERVER.PORT}`);
});
