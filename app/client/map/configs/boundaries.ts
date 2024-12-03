import { LayerConfig } from "../types";

export const swissBoundary: LayerConfig = {
  id: "swiss-boundary",
  label: "Swiss Boundary",
  source: "swiss-boundary",
  layers: [
    {
      id: "swiss-boundary-fill",
      type: "fill",
      source: "swiss-boundary",
      paint: {
        "fill-color": "transparent",
        "fill-opacity": 0.1,
      },
    },
    {
      id: "swiss-boundary-line",
      type: "line",
      source: "swiss-boundary",
      paint: {
        "line-color": "#000",
        "line-width": 2,
        "line-opacity": 0.5,
      },
    },
  ],
  sourceConfig: {
    type: "geojson",
    data: "geojson/swiss-boundary.geojson",
  },
};

export const swissCantonBoundaries: LayerConfig = {
  id: "swiss-canton-boundaries",
  label: "Swiss Canton Boundaries",
  source: "swiss-canton-boundaries",
  layers: [
    {
      id: "swiss-canton-boundaries-layer",
      type: "line",
      source: "swiss-canton-boundaries",
      paint: {
        "line-color": "#808080",
        "line-width": 1,
        "line-opacity": 0.35,
      },
    },
  ],
  sourceConfig: {
    type: "geojson",
    data: "geojson/swiss-canton-boundaries.geojson",
  },
};
