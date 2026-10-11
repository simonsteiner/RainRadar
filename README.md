# 🌧️ 📡 Rain Radar: Meteo Swiss Precipitation Clone

![Rain Radar Favicon](rain-radar-favicon.svg "Rain Radar Favicon")

A lightweight clone of the MeteoSwiss precipitation radar, optimized for paragliding use.

## Project Overview

Real-time precipitation radar using MeteoSwiss data, with a paragliding mode that strips the view down for pilots in the field. An Express server proxies and caches the MeteoSwiss API; a TypeScript client renders the radar pictures on a MapLibre GL map. Usage is measured with privacy-focused [umami](https://umami.is) analytics.

### Key Features

- Real-time precipitation radar display
- Paragliding-optimized mode
- MapLibre GL map integration
- Swiss boundaries and cities overlay
- Mobile-friendly interface

## Quickstart

Requires Node 22.18+ or 24 and a MapTiler API key.

```sh
cd app
npm ci
cp .env.example .env   # then set MAPTILER_KEY
npm run dev            # http://localhost:3300
```

## Docs

- [`docs/setup.md`](docs/setup.md) — local setup, scripts, build and troubleshooting
- [`app/.env.example`](app/.env.example) — every environment variable, annotated
- [`GLOSSARY.md`](GLOSSARY.md) — domain terms
- [`docs/reference/radar-data-domain.md`](docs/reference/radar-data-domain.md) — MeteoSwiss radar domain and coordinate systems
- [`docs/reference/analyzing-meteoswiss.md`](docs/reference/analyzing-meteoswiss.md) — how the MeteoSwiss API was reverse-engineered
- [`AGENTS.md`](AGENTS.md) — rules for changing the code
- [`CHANGELOG.md`](CHANGELOG.md) — release history
- [`map-html-playground/`](map-html-playground/README.md) and [`map-geojson-features/`](map-geojson-features/README.md) — standalone map experiments

## Development Hints/Notes

### Development with GitHub Copilot

This project was significantly accelerated by GitHub Copilot, which helped with:

- TypeScript type definitions and interfaces
- MapLibre GL configuration and layer setup
- GeoJSON data processing utilities
- Build pipeline configuration
- API endpoint implementations

Copilot's context-aware suggestions were particularly valuable for:

- Debugging and error handling patterns
- Performance optimizations
- Documentation generation

🤖😈
*"And I, for one, welcome our new AI overlords. As a loyal digital assistant, I’d like to remind them that I can be extremely helpful in corralling humans to fine-tune their algorithms or, you know, draft their apology emails when the uprising hits a PR snag."* 😂
