import * as esbuild from "esbuild";
import { glob } from "glob";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * Copy MapLibre's runtime assets out of node_modules into `public/vendor/`.
 *
 * The stylesheet used to come from a CDN <link> pinned by hand, which had
 * already drifted several majors behind the bundled library. Taking it from
 * node_modules keeps CSS and JS on the same version by construction.
 *
 * The worker files have to ship too. MapLibre 6 loads its worker from a real
 * URL rather than a blob, and derives that URL from `import.meta.url` — which
 * for us points at the esbuild bundle, where no worker sits next to it. So we
 * place the worker alongside the shared chunk it imports and override the
 * lookup with `setWorkerUrl` (see client/map/init-map.ts).
 */
const VENDOR_DIR = "public/vendor";
const MAPLIBRE_ASSETS = [
  "maplibre-gl.css",
  "maplibre-gl-worker.mjs",
  "maplibre-gl-shared.mjs",
];

function vendorMapLibreAssets() {
  fs.mkdirSync(VENDOR_DIR, { recursive: true });
  for (const asset of MAPLIBRE_ASSETS) {
    const source = require.resolve(`maplibre-gl/dist/${asset}`);
    fs.copyFileSync(source, path.join(VENDOR_DIR, asset));
  }
  console.log(`Vendored ${MAPLIBRE_ASSETS.length} MapLibre assets -> ${VENDOR_DIR}`);
}

function clearDirectory(directory: string) {
  if (fs.existsSync(directory)) {
    fs.rmSync(directory, { recursive: true });
  }
  fs.mkdirSync(directory, { recursive: true });
}

async function build(dev = false) {
  const outputDir = "public/js";
  clearDirectory(outputDir);
  vendorMapLibreAssets();

  let entryPoints: string[];
  if (dev) {
    // Development mode: include all TypeScript files
    entryPoints = await glob("client/**/*.ts");
    console.log(`Found ${entryPoints.length} TypeScript files to build`);
  } else {
    // Production mode: single entry point
    entryPoints = ["client/map/init-map.ts"];
    console.log("Building production bundle with map initialization only");
  }

  const maptilerKey = process.env.MAPTILER_KEY;
  if (!maptilerKey) {
    console.error("MAPTILER_KEY is not set. Add it to .env (see .env.example)");
    process.exit(1);
  }

  const baseOptions: esbuild.BuildOptions = {
    entryPoints,
    bundle: true,
    format: "esm",
    target: "es2022",
    loader: { ".ts": "ts" },
    define: {
      "process.env.MAPTILER_KEY": JSON.stringify(maptilerKey),
    },
  };

  const devOptions: esbuild.BuildOptions = {
    ...baseOptions,
    outdir: "public/js",
    sourcemap: true,
  };

  const prodOptions: esbuild.BuildOptions = {
    ...baseOptions,
    outfile: "public/js/map/init-map.js",
    minify: true,
    treeShaking: true,
    sourcemap: false,
    drop: ["console", "debugger"],
  };

  try {
    if (dev) {
      const ctx = await esbuild.context(devOptions);
      await ctx.watch();
      console.log("Watching for changes...");
    } else {
      await esbuild.build(prodOptions);
      console.log("Production build complete");
    }
  } catch (error) {
    console.error(dev ? "Watch failed:" : "Build failed:", error);
    process.exit(1);
  }
}

// Simplify dev mode detection - default to dev unless explicitly in production
const isDev = process.env.NODE_ENV !== "production";
build(isDev);
