# Map HTML Playground

An interactive web map application using MapLibre GL JS to display Swiss topographic data. This playground serves as a development and testing environment for map functionalities that will be integrated into the main rain radar application.

## Purpose

This playground allows for:

- Testing and development of map features in isolation
- Experimenting with different layer combinations
- Prototyping new map interactions
- Validating performance of map rendering
- Testing integration of weather data overlays

## Features

- Interactive map of Switzerland with multiple layers:
  - Hillshade terrain visualization
  - Swiss national boundary
  - Canton boundaries
  - Major cities
  - NUTS regions
- Real-time coordinate display
- Zoom level indicator
- Geolocation support
- Click-to-copy coordinates

## Future Integration

Features developed here will be integrated into the main rain radar application to provide:

- Weather radar overlay visualization
- Precipitation data layers
- Time-based weather animation
- Weather station markers and data

## Setup

1. Serve the files using a local web server
2. Open `mch-map.html` in a browser
3. The map will load with default layers enabled

## Dependencies

- MapLibre GL JS v4.7.1
- Custom layer configurations (in `map-js/layers/`)
