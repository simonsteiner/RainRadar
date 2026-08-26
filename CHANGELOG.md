# Changelog

## [Unreleased]

### Changed

- Upgraded MapLibre GL JS from 5.x to 6.6.0. MapLibre 6 is ESM-only,
  requires WebGL 2 and targets ES2022; the client build target moved to
  ES2022 to match.
  - MapLibre's stylesheet is now vendored from `node_modules` at build time
    instead of loaded from a hand-pinned unpkg URL that had drifted two
    majors behind the bundled library.
  - MapLibre's worker ships alongside it, because MapLibre 6 loads the
    worker from a real URL rather than a blob.
- Upgraded TypeScript from 6.0 to 7.0 (the native Go compiler). TypeScript
  7 has no programmatic API yet, so `typescript-eslint` continues to use
  the 6.0 API through an npm alias.
- Precipitation overlay uses MapLibre 6's `fill-layer-opacity` and
  `line-layer-opacity`, which fade the composited layer once instead of
  blending each polygon separately — this removes the faint seam grid along
  shared edges of the radar cells.
- The standalone maps in `map-html-playground/` and `map-geojson-features/`
  moved to MapLibre 6.6.0 as well. They loaded the UMD build, which version 6
  discontinued, so each page imports the ES module instead of relying on a
  global `maplibregl`.
- Replaced `ts-node` / `ts-node-dev` with Node's native type stripping;
  `node build.ts` and `node --watch server.ts` do the same job. Both
  packages were effectively unmaintained. This moves the server to ESM and
  raises the Node floor to 22.18, the release that unflagged type stripping.

### Added

- `npm run typecheck` — the repo had no type-checking script; the build
  only ever stripped types via esbuild.
- GitHub Actions CI running typecheck, lint, lint:css and build on Node
  22.18 and 24. The repository previously had no CI at all.
- `.nvmrc` pinning Node 24 (current LTS).
- A message is now shown when the browser cannot provide a WebGL 2 context,
  which MapLibre 6 requires. Previously the map container was simply blank.

### Fixed

- The client TypeScript config targeted ES6 without a `lib`, so it had never
  type-checked cleanly. Correcting it surfaced two properties that were
  assigned after construction without being marked optional.
- The ESLint config spread `tseslint.configs.recommended.rules`, which is
  `undefined` in flat config, and never imported `@eslint/js`. Only two
  rules were running — `indent` and `quotes`. It now applies 71, which
  found a ternary used as a statement, a `String` wrapper-object type, two
  unused variables and four `any`s in the proxy. One of those `any`s was
  hiding a `CacheManager` typed as holding `Buffer` while storing `string`.
- Cached `/api` responses were served as `text/html` instead of
  `application/json`; only the first, uncached response carried the right
  type. Exposed by removing the `any` that hid the CacheManager mismatch.
- Removed `legacy-peer-deps=true` from `.npmrc`, which suppressed ERESOLVE
  errors. All peers now resolve on their own.

[unreleased]: https://github.com/simonsteiner/rainradar/compare/v1.0.1...HEAD

## [1.0.1] - 2024-12-11

### Added

- Map Layers
  - Radar domain to illustrate where MeteoSwiss radar coverage exists
  - World layer to illustrate where no radar coverage from MeteoSwiss is available
- Technical documentation for MeteoSwiss radar data domain [`MCH-RadarDataDomain.md`](MCH-RadarDataDomain.md)

### Fixed

- Precipitation layer in map-html-playground

### Changed

- Interface Improvements
  - Standardized ID naming scheme for layer and legend controls
  - Enhanced checkbox and button styling for better usability
  - Unified paragliding mode button behavior
  - Switched to CSS class-based styling (removed direct style manipulation)

- Code Quality
  - Enhanced type safety for animation data structures
  - Applied consistent code formatting and style conventions
  - Extended linting configurations:
    - Added ESLint and Stylelint support

[1.0.1]: https://github.com/simonsteiner/rainradar/compare/v1.0.0...v1.0.1

## [1.0.0] - 2024-12-03

### New Features

- Initial release of Rain Radar precipitation visualization
- Real-time precipitation radar display powered by MeteoSwiss data
- Paragliding-optimized visualization mode
- MapLibre GL integration for smooth map interactions
- Swiss boundaries and cities overlay
- Mobile-friendly responsive interface
- Privacy-focused analytics using umami
- Express.js backend with MeteoSwiss API proxy
- Efficient build pipeline using esbuild
  - Development mode with sourcemaps and hot reloading
  - Production mode with optimized bundling

### Technical Features

- Pure TypeScript implementation
- ES modules (ESM) format
- ES2020 target support
- Optimized production builds with tree-shaking and minification
- Development tools support including Android remote debugging

[1.0.0]: https://github.com/simonsteiner/rainradar/releases/tag/v1.0.0
