import type { LayerConfig } from "../../_types/map";

// The radar grid is drawn as thousands of adjacent polygons. Per-feature
// `fill-opacity` blends each one separately, so shared edges composite twice
// and show as a seam grid. MapLibre 6 added `*-layer-opacity`, which renders
// the layer opaque off-screen and fades it once, giving a flat wash instead.
// Transitions live in the spec now because MapLibre 6 types `setPaintProperty`
// against real paint property names, which excludes the `-transition` suffix.
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
        "fill-layer-opacity": 0.5,
        "fill-layer-opacity-transition": FADE,
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
        "line-layer-opacity": 0.8,
        "line-layer-opacity-transition": FADE,
        "line-color-transition": FADE,
        "line-width-transition": FADE,
      },
      layout: {},
    },
  ],
};
