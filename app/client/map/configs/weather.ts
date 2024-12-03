import { LayerConfig } from "../types";

export const precipitation: LayerConfig = {
  id: "precipitation",
  label: "Precipitation",
  source: "precipitation-rate",
  layers: [
    {
      id: "precipitation-rate-layer",
      type: "fill",
      source: "precipitation-rate",
      paint: {
        "fill-color": ["get", "color"],
        "fill-opacity": 0.5,
      },
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
    },
  ],
  sourceConfig: {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
  },
};
