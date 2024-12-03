import * as esbuild from "esbuild";
import { glob } from "glob";
import * as fs from "fs";

function clearDirectory(directory: string) {
  if (fs.existsSync(directory)) {
    fs.rmSync(directory, { recursive: true });
  }
  fs.mkdirSync(directory, { recursive: true });
}

async function build(dev = false) {
  const outputDir = "public/js";
  clearDirectory(outputDir);

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

  const baseOptions: esbuild.BuildOptions = {
    entryPoints,
    bundle: true,
    format: "esm",
    target: "es2020",
    loader: { ".ts": "ts" },
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
    drop: ['console', 'debugger'],
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
