import { createProxy } from "./server/proxy-utils";
import { SERVER, METEOSWISS } from "./server/config";
import { staticFiles, requestLogger, corsHeaders } from "./server/middleware";
import express from "express";
import path from "path";
import rateLimit from "express-rate-limit";
import umami from "@umami/node";

const app = express();

const isLocalEnvironment = () => {
  return process.env.NODE_ENV !== "production" || 
         SERVER.PORT === 3000 ||
         process.env.HOSTNAME?.includes("localhost");
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
  umami.track({ 
    url: req.path,
    data: { environment }
  });
  next();
});

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50, // limit each IP to 50 requests per minute
  message: "Too many requests, please try again later."
});

// Root route handler with rate limiting
app.get("/", limiter, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/api", requestLogger);
app.use("/api", corsHeaders);

// Proxy routes
app.use(
  "/api/versions.json",
  createProxy(METEOSWISS.BASE_URL, () => METEOSWISS.VERSIONS_PATH)
);

app.use(
  "/api/precipitation/:version/animation.json",
  createProxy(
    METEOSWISS.BASE_URL,
    (req: express.Request) =>
      `${METEOSWISS.PRECIPITATION_PATH}/version__${req.params.version}/en/animation.json`
  )
);

app.use(
  "/api/product/output/*",
  createProxy(
    METEOSWISS.BASE_URL,
    (req: express.Request) =>
      `${METEOSWISS.PRODUCT_OUTPUT_PATH}/${req.params[0]}`
  )
);

app.listen(SERVER.PORT, () => {
  console.log(`Environment: ${environment}`);
  console.log(`Server running at http://localhost:${SERVER.PORT}`);
});
