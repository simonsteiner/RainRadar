# Rain Radar

A lightweight clone of the MeteoSwiss precipitation radar, optimized for paragliding. An Express server in `app/server.ts` proxies and caches the MeteoSwiss API under `/api` and serves `app/public/`. A TypeScript client in `app/client/`, bundled by esbuild, fetches the precipitation animation from `/api` and renders it on a MapLibre GL map.
Domain terms are in `GLOSSARY.md`; there are no ADRs yet.

## Commands

Run every command in `app/` except the Markdown ones, which run from the repo root; the root has no `package.json`.

```bash
npm ci  # install dependencies
cp .env.example .env  # then set MAPTILER_KEY; the build exits without it
npm run dev  # server on http://localhost:3300 plus the client watcher
npm run build:prod  # minified bundle to public/js/map/init-map.js
npm run typecheck  # tsc on the server and client projects, no emit
npm run lint  # ESLint with type-aware rules
npx eslint client/map/init-map.ts  # lint one file
npm run lint:css  # Stylelint
npx stylelint public/styles/_map.css  # lint one CSS file
uvx rumdl@0.2.78 check docs/setup.md  # lint Markdown (repo root)
uvx lefthook install  # pre-commit hook that runs rumdl (repo root)
```

There are no automated tests. CI runs `typecheck`, `lint`, `lint:css` and `build:prod` on a Node 22.18 and 24 matrix; run the same before calling a change done.

## Conventions

### Server

- **Upstream URLs live only in `app/server/config.ts`.** Port, cache age and retry settings live there too.
- **Every upstream route goes through `createProxy` in `app/server/proxy-utils.ts`.** It caches JSON responses and retries with backoff; never call `express-http-proxy` directly.
- **Each route's path resolver builds its upstream path.** Routes in `app/server.ts` pass one to `createProxy`; it validates its input and returns `null` to reject, which `createProxy` turns into a 400. The precipitation route is the example.
- **Analytics go through `track()` in `app/server/analytics.ts`, never `umami.track`.** `track` swallows rejections; an unhandled one would terminate the server.

### Client

- **The page loads one bundle, built from `app/client/map/init-map.ts`.** Code not reachable from it never runs, even though dev mode builds every file.
- **Map layers are `LayerConfig` objects in `app/client/map/configs/`.** Register each new one in `app/client/map/layers-config.ts`.
- **Paragliding mode state lives only in the `ParaglidingMode` singleton.** Read it with `ParaglidingMode.getInstance().isEnabled()` (`app/client/precipitation/paragliding-mode.ts`); it is driven by `?mode=paragliding`.
- **`MAPTILER_KEY` reaches the client only through esbuild's `define`.** See `app/build.ts` and `app/client/_types/env.d.ts`; `process` does not exist in the browser.
- **Styles are partials in `app/public/styles/_*.css`.** Import each new one from `app/public/styles/styles.css`.

### Changelog and env vars

- **Record user-visible changes under `## [Unreleased]` in `CHANGELOG.md`.**
- **Every env var is annotated in `app/.env.example`.** Add a new one there, not in other docs.

## Hard constraints

- **Never edit `app/public/js/` or `app/public/vendor/`.** `app/build.ts` generates both; change the source or the build instead.
- **Never interpolate a request param into an upstream URL unvalidated.** Validate it in the path resolver, as the precipitation route does with the version id.
- **Never commit `app/.env`.** It holds the real `MAPTILER_KEY`.

## Gotchas

- **The build never type-checks.** esbuild and Node only strip types; run `npm run typecheck`.
- **`tsc` is TypeScript 7, but `require("typescript")` is 6.0.** The 6.0 alias exists because `typescript-eslint` needs its API; don't "fix" either alias in `app/package.json`.
- **Only `app/build.ts` loads `app/.env`.** The server reads `PORT` and `NODE_ENV` from the shell.
- **The playgrounds are not part of the app.** `map-html-playground/` and `map-geojson-features/` load MapLibre 6.6.0 from unpkg and are served as static files; changes to `app/` don't reach them.
- **The pre-commit hook rewrites staged Markdown.** It runs `rumdl check --fix` and re-stages the result, so a commit can differ from what you staged.
- **Manual CI runs use the workflow on `main`.** Editing `workflow_dispatch` on a branch has no effect until it is merged.

## Docs

- `README.md` — what the project is and the quickstart.
- `docs/setup.md` — local setup, every script, how the build works, troubleshooting.
- `app/.env.example` — every env var, annotated.
- `GLOSSARY.md` — domain terms; use them in code and docs.
- `docs/reference/` — the MeteoSwiss radar domain and how its API was reverse-engineered; read before touching coordinates or upstream endpoints.
- `CHANGELOG.md` — release history.
- There is no deployment doc; deployment is not described in this repo.
