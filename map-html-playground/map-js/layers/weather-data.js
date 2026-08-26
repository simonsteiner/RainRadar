
// Mirrors the precipitation layer in app/client/map/configs/precipitation.ts.
// Uses MapLibre 6's `*-layer-opacity` for the same reason the app does: the
// radar grid is adjacent polygons, and per-feature opacity blends every shared
// edge twice, leaving a visible seam grid.
export function setupWeatherData(map) {
  map.addSource("precipitation-rate", {
    type: "geojson",
    data: "radar_rzc.geojson"
  });

  map.addLayer({
    id: "precipitation-rate-layer",
    type: "fill",
    source: "precipitation-rate",
    paint: {
      "fill-color": ["get", "color"],
      "fill-layer-opacity": 0.5
    }
  });

  map.addLayer({
    id: "precipitation-rate-outline",
    type: "line",
    source: "precipitation-rate",
    paint: {
      "line-color": ["get", "color"],
      "line-width": 1,
      "line-layer-opacity": 0.8
    }
  });
}