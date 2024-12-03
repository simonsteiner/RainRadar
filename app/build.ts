import * as esbuild from "esbuild";
import { glob } from "glob";

async function build(dev = false) {
  const entryPoints = await glob("client/**/*.ts");

  const options: esbuild.BuildOptions = {
    entryPoints,
    bundle: true,
    outdir: "public/js",
    format: "esm",
    sourcemap: true,
    target: "es2020",
    loader: { ".ts": "ts" },
  };

  try {
    if (dev) {
      const ctx = await esbuild.context(options);
      await ctx.watch();
      console.log("Watching for changes...");
    } else {
      await esbuild.build(options);
      console.log("Build complete");
    }
  } catch (error) {
    console.error(dev ? "Watch failed:" : "Build failed:", error);
    process.exit(1);
  }
}

const dev = process.argv.includes("--dev");
build(dev);
