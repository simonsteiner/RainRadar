/**
 * This file handles the rendering of Swiss NUTS regions (Nomenclature of Territorial Units for Statistics)
 * on a Mapbox map. It creates three visualization layers:
 * 1. Region fills with distinct colors
 * 2. Region boundaries
 * 3. Region labels at different zoom levels
 */

/**
 * Creates and adds Swiss NUTS region layers to the map
 * @param {mapboxgl.Map} map - The Mapbox GL JS map instance
 * @returns {void}
 * 
 * The function adds the following layers:
 * - swiss-nuts-regions-fill: Colored region polygons
 * - swiss-nuts-regions-layer: Region boundaries
 * - swiss-nuts-regions-labels: Region labels (zoom 9-11)
 * - region-center-labels: Region labels at region centers (zoom 6-9)
 */
export function swissNutsRegionsLayer(map) {
  map.addSource("swiss-nuts-regions", {
    type: "geojson",
    data: "swiss-nuts-regions.geojson",
  });

  map.addLayer({
    id: "swiss-nuts-regions-fill",
    type: "fill",
    source: "swiss-nuts-regions",
    paint: {
      "fill-color": [
        "match",
        ["get", "id"],
        "CH01", "#B5DCC6",
        "CH02", "#D8E876",
        "CH03", "#D8D3E8",
        "CH04", "#F7C5DA",
        "CH05", "#FFFCC6",
        "CH06", "#F5C48F",
        "CH07", "#F6C7BB",
        "#cccccc"  // default color
      ],
      "fill-opacity": 0.15
    }
  });

  map.addLayer({
    id: "swiss-nuts-regions-layer",
    type: "line",
    source: "swiss-nuts-regions",
    paint: {
      "line-color": "#666666",
      "line-width": 1,
      "line-opacity": 0.15,
    },
  });

  // Add labels
  map.addLayer({
    id: "swiss-nuts-regions-labels",
    type: "symbol",
    source: "swiss-nuts-regions",
    minzoom: 9,
    maxzoom: 11,
    layout: {
      "text-field": ["get", "name"],
      "text-size": 16,
      "text-anchor": "center",
      "text-justify": "center",
      "text-variable-anchor": ["center"],
      "text-radial-offset": 0,
      "text-allow-overlap": false,
      "symbol-placement": "point"
    },
    paint: {
      "text-color": [
        "match",
        ["get", "id"],
        "CH01", "#85AC96", // darker version of #B5DCC6
        "CH02", "#A8B856", // darker version of #D8E876
        "CH03", "#A8A3B8", // darker version of #D8D3E8
        "CH04", "#C795AA", // darker version of #F7C5DA
        "CH05", "#CFCC96", // darker version of #FFFCC6
        "CH06", "#C5946F", // darker version of #F5C48F
        "CH07", "#C6978B", // darker version of #F6C7BB
        "#666666"  // default color
      ],
      "text-opacity": 0.15,
      "text-halo-color": "#bbbbbb",
      "text-halo-width": 1
    }
  });

  map.addSource("region-center", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        { type: "Feature", geometry: { type: "Point", coordinates: [7.384803, 46.201399] }, properties: { id: "CH01", color: "#85AC96", name: "Genferseeregion" } },
        { type: "Feature", geometry: { type: "Point", coordinates: [7.433405, 46.816867] }, properties: { id: "CH02", color: "#A8B856", name: "Espace Mittelland" } },
        { type: "Feature", geometry: { type: "Point", coordinates: [8.107355, 47.429755] }, properties: { id: "CH03", color: "#A8A3B8", name: "Grossregion Nordwestschweiz" } },
        { type: "Feature", geometry: { type: "Point", coordinates: [8.654879, 47.412950] }, properties: { id: "CH04", color: "#C795AA", name: "Zürich" } },
        { type: "Feature", geometry: { type: "Point", coordinates: [9.374251, 46.810215] }, properties: { id: "CH05", color: "#CFCC96", name: "Ostschweiz" } },
        { type: "Feature", geometry: { type: "Point", coordinates: [8.420687, 46.968408] }, properties: { id: "CH06", color: "#C5946F", name: "Zentralschweiz" } },
        { type: "Feature", geometry: { type: "Point", coordinates: [8.808256, 46.296012] }, properties: { id: "CH07", color: "#C6978B", name: "Tessin" } },
      ]
    }
  });

  map.addLayer({
    id: "region-center-labels",
    type: "symbol",
    source: "region-center",
    minzoom: 6,
    maxzoom: 9,
    layout: {
      "text-field": ["get", "name"],
      "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
      "text-size": 16,
    },
    paint: {
      "text-color": ["get", "color"],
      "text-opacity": 0.15,
      "text-halo-color": "#bbbbbb",
      "text-halo-width": 1
    }
  });
}