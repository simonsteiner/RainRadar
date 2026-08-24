import type { LayerConfig } from "../../_types/map";

// Transitions are declared in the layer spec rather than applied afterwards
// with `setPaintProperty`: MapLibre 6 types that method against real paint
// property names, which excludes the synthesised `-transition` suffix.
const FADE = { duration: 300 };

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
        "fill-opacity-transition": FADE,
        "fill-color-transition": FADE,
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
        "line-opacity-transition": FADE,
        "line-color-transition": FADE,
        "line-width-transition": FADE,
      },
      layout: {},
    },
  ],
};
