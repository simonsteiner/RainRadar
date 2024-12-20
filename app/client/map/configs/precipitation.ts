import type { LayerConfig } from "../../_types/map";

export const precipitation: LayerConfig = {
  id: "precipitation",
  label: "Weather: Precipitation",
  source: "precipitation-rate",
  sourceConfig: {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
  },
  layers: [
    {
      id: "precipitation-rate-layer",
      type: "fill",
      source: "precipitation-rate",
      paint: {
        "fill-color": ["get", "color"],
        "fill-opacity": 0.5,
      },
      layout: {},
    },
    {
      id: "precipitation-rate-outline",
      type: "line",
      source: "precipitation-rate",
      paint: {
        "line-color": ["get", "color"],
        "line-width": 1,
        "line-opacity": 0.8,
      },
      layout: {},
    },
  ],
};
