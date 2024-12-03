/**
 * Creates and adds Swiss cities layers to the map
 * @param {mapboxgl.Map} map - The Mapbox GL JS map instance
 * @returns {void}
 */
export function swissCitiesLayer(map) {
  // Add GeoJSON source for Swiss cities
  map.addSource("swiss-cities", {
    type: "geojson",
    data: "swiss-cities.geojson",
  });

  // Add circle markers for city points
  map.addLayer({
    id: "swiss-cities-layer",
    type: "circle",
    source: "swiss-cities",
    paint: {
      "circle-radius": 1.5,
      "circle-color": "#ffffff",
      "circle-stroke-width": 2,
      "circle-stroke-color": "#000000"
    },
    // Show cities based on their minimum zoom level requirement
    // adds 1.25 to current zoom level to prevent abrupt transitions
    filter: [">=", ["+", 1.25, ["zoom"]], ["get", "minzoom"]],
  });

  // Add text labels for city names
  map.addLayer({
    id: "swiss-cities-labels",
    type: "symbol",
    source: "swiss-cities",
    layout: {
      "text-field": ["get", "place"],
      "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
      "text-justify": "left",
      "text-offset": [0.5, 0.2],
      "text-anchor": "bottom-left",
      "text-size": 12,
    },
    paint: {
      "text-color": "#000000",
      "text-halo-color": "#ffffff",
      "text-halo-width": 2
    },
    // Use same zoom filter as the city points
    filter: [">=", ["+", 1.25, ["zoom"]], ["get", "minzoom"]],
  });
}