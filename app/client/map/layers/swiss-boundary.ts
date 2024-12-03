/**
 * Creates and adds the Swiss boundary layers to the map.
 * This function adds two layers:
 * 1. A transparent fill layer for the Swiss territory
 * 2. A border line layer outlining Switzerland
 * 
 * @param {mapboxgl.Map} map - The Mapbox GL JS map instance to add the layers to
 * @returns {void}
 */
export function swissBoundaryLayer(map) {
  // Swiss boundary
  // from mch website export
  map.addSource("swiss-boundary", {
    type: "geojson",
    data: "geojson/swiss-boundary.geojson",
  });

  map.addLayer({
    id: "swiss-boundary-fill",
    type: "fill",
    source: "swiss-boundary",
    paint: {
      "fill-color": "transparent",
      "fill-opacity": 0.1,
    },
  });

  map.addLayer({
    id: "swiss-boundary-line",
    type: "line",
    source: "swiss-boundary",
    paint: {
      "line-color": "#000",
      "line-width": 2,
      "line-opacity": 0.5,
    },
  });
}