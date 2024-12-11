# Changelog

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
