/**
 * Adds Swiss canton (state) boundary lines to the map
 * 
 * Data source:
 * - Provider: OpenDataSoft
 * - Dataset: georef-switzerland-kanton
 * - URL: https://data.opendatasoft.com/explore/dataset/georef-switzerland-kanton@public
 * - Format: GeoJSON
 * 
 * @param {maplibregl.Map} map - The MapLibre GL JS map instance
 * @returns {void}
 */
export function swissCantonBoundariesLayer(map) {

  // Add canton boundaries source from local GeoJSON file
  map.addSource("swiss-canton-boundaries", {
    type: "geojson",
    data: "geojson/swiss-canton-boundaries.geojson", // Local copy of the canton boundaries
  });

  // Add line layer to display canton boundaries
  map.addLayer({
    id: "swiss-canton-boundaries-layer",
    type: "line",
    source: "swiss-canton-boundaries",
    paint: {
      "line-color": "#808080",      // Gray color for boundaries
      "line-width": 1,              // Thin line width
      "line-opacity": 0.35,         // Semi-transparent lines
    },
  });

}
