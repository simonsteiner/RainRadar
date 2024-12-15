import type { LayerConfig } from "../../_types/map";

export const radarDomain: LayerConfig = {
  id: "radar-domain",
  label: "Radar Domain",
  visible: false,
  source: "radar-domain",
  sourceConfig: {
    type: "geojson",
    data: {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[
          [3.169, 43.6301],
          [11.9566, 43.6201],
          [12.4634, 49.3654],
          [2.6896, 49.3767],
          [3.169, 43.6301]
        ]]
      },
      properties: {
        projdef: "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs",
        xscale: 1,
        xsize: 710,
        yscale: 1,
        ysize: 640
      }
    }
  },
  layers: [{
    id: "radar-domain-layer",
    type: "fill",
    source: "radar-domain",
    layout: {},
    paint: {
      "fill-color": "#888888",
      "fill-opacity": 0.5
    }
  }]
};

export const world: LayerConfig = {
  id: "world",
  label: "World Background",
  visible: true,
  source: "world",
  sourceConfig: {
    type: "geojson",
    data: {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-180, -90],
          [180, -90],
          [180, 90],
          [-180, 90],
          [-180, -90]
        ], [
          [3.169, 43.6301],
          [11.9566, 43.6201],
          [12.4634, 49.3654],
          [2.6896, 49.3767],
          [3.169, 43.6301]
        ]]
      },
      properties: {}
    }
  },
  layers: [{
    id: "world-layer",
    type: "fill",
    source: "world",
    layout: {},
    paint: {
      "fill-color": "#000000",
      "fill-opacity": 0.2
    }
  }]
};