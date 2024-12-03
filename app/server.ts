import express from "express";
import path from "path";
import { SERVER, METEOSWISS } from "./server/config";
import { staticFiles, requestLogger, corsHeaders } from "./server/middleware";
import { createProxy } from "./server/proxy-utils";

const app = express();

// Middleware
app.use(staticFiles);

// Root route handler
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/api", requestLogger);
app.use("/api", corsHeaders);

// Proxy routes
app.use(
  "/api/versions",
  createProxy(METEOSWISS.BASE_URL, () => METEOSWISS.VERSIONS_PATH)
);

app.use(
  "/api/precipitation/:version",
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
  console.log(`Server running at http://localhost:${SERVER.PORT}`);
});
