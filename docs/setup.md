# Local Setup

## Prerequisites

- Node 22.18+ or 24. `.nvmrc` pins 24; 22.18 is the release that unflagged type stripping, which the build and server rely on.
- A MapTiler API key for the hillshade tiles.

## Steps

All commands run in `app/`.

1. Install dependencies:

   ```sh
   cd app
   npm ci
   ```

2. Create `.env` and set `MAPTILER_KEY` (see `app/.env.example` for every variable):

   ```sh
   cp .env.example .env
   ```

3. Start the server and the client watcher:

   ```sh
   npm run dev
   ```

4. Open <http://localhost:3300>.

## Scripts

```sh
npm run dev         # server and client watcher in parallel, via concurrently
npm run server      # Express server only, auto-reloads via node --watch
npm run watch       # client watcher only, rebuilds on change via esbuild
npm run build:prod  # optimized production bundle
npm run typecheck   # type-checks the server and client projects (no emit)
npm run lint        # ESLint, including the type-aware rules
npm run lint:fix    # ESLint with autofix
npm run lint:css    # Stylelint
npm run lint:config # opens the ESLint config inspector
```

## Build

esbuild bundles the client in two modes:

1. Development (`npm run watch`, part of `npm run dev`):
   - Builds every TypeScript file in `client/` and rebuilds on change
   - Generates sourcemaps
   - Outputs individual bundles to `public/js/`, keeping the directory structure

2. Production (`npm run build:prod`):
   - Single entry point `client/map/init-map.ts`
   - Tree-shaking and minification
   - Drops `console` and `debugger` statements
   - No sourcemaps
   - Outputs one file, `public/js/map/init-map.js`

Both modes:

- emit ES modules targeting ES2022, the baseline MapLibre GL 6 ships and requires
- inline `MAPTILER_KEY` into the bundle, and exit if it is not set
- copy MapLibre's stylesheet, worker and shared chunk from `node_modules` into `public/vendor/` (generated and gitignored). The worker has to ship as a real file because MapLibre 6 loads it by URL rather than as a blob.

The build never type-checks: esbuild strips types without looking at them. Run `npm run typecheck` to check them.

## TypeScript toolchain

- `node` runs the `.ts` files directly. Node only *strips* types, it never checks them, and it rejects syntax that needs a real transform (enums, namespaces, parameter properties). `tsconfig.json` sets `erasableSyntaxOnly` so `npm run typecheck` catches that syntax rather than leaving it to fail at runtime.
- `tsc` is TypeScript 7, the native Go compiler, used for type checking only. TypeScript 7 has no programmatic API yet, so `typescript-eslint` still needs the 6.0 API. `package.json` installs both through npm aliases: the `tsc` binary is 7.0 via `@typescript/native`, while `require("typescript")` resolves to `@typescript/typescript6`.
- VS Code points `typescript.tsdk` at the 6.0 install under `app/node_modules/@typescript/old/lib`, because neither TypeScript 7 nor the 6.0 alias ships a tsserver of its own.

## Git hooks

A lefthook pre-commit hook lints staged Markdown with [rumdl](https://rumdl.dev/) (config in `.rumdl.toml`). Install it once, from the repo root:

```sh
uvx lefthook install
```

## Playgrounds

`map-html-playground/` and `map-geojson-features/` are standalone experiments, not part of the app build. Each has its own README.

## Troubleshooting

- **`MAPTILER_KEY is not set`.** The build reads it from `app/.env`; copy `.env.example` and fill it in.
- **Map stays empty with a WebGL message.** MapLibre 6 requires WebGL 2; the browser or device does not provide it.
- **CI did not start on a pull request.** Trigger it from the Actions tab or with `gh workflow run ci.yml`. Manual runs work only for the workflow as it exists on `main`.

### Android remote debugging

1. Install the Android debugging tools:

   ```sh
   brew install android-platform-tools
   ```

2. Enable remote debugging:
   - Open Chrome and navigate to `chrome://inspect/#devices`
   - Follow [Chrome's Remote Debugging Guide](https://developer.chrome.com/docs/devtools/remote-debugging)
   - Connect the device and verify with `adb devices`
   - Forward the dev server port: `adb -s <device-id> reverse tcp:3300 tcp:3300`

### Asset generation

Convert the SVG favicon to PNG (macOS):

```sh
qlmanage -t -s 48 -o . rain-radar-favicon.svg
```
