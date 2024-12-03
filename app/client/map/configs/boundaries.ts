import { LayerConfig } from "../types";

export const swissBoundary: LayerConfig = {
  id: "swissBoundary",
  label: "Swiss Boundary",
  source: "swiss-boundary",
  sourceConfig: {
    type: "geojson",
    data: "geojson/swiss-boundary.geojson",
  },
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
};

export const swissCantonBoundaries: LayerConfig = {
  id: "swissCantonBoundaries",
  label: "Swiss Canton Boundaries",
  source: "swiss-canton-boundaries",
  sourceConfig: {
    type: "geojson",
    data: "geojson/swiss-canton-boundaries.geojson",
  },
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
};
