import { LayerConfig } from "../types";

export const center: LayerConfig = {
  id: "center",
  label: "Center Point of Swizerland",
  visible: false,
  source: "center",
  sourceConfig: {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [8.2, 46.8] },
          properties: { id: "center", name: "Center" },
        },
      ],
    },
  },
  layers: [
    {
      id: "center-circle",
      type: "circle",
      source: "center",
      paint: {
        "circle-radius": 1.5,
        "circle-color": "#ff0000",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#000000",
      },
    },
    {
      id: "center-labels",
      type: "symbol",
      source: "center",
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
        "text-justify": "left",
        "text-offset": [0.5, 0.2],
        "text-anchor": "bottom-left",
        "text-size": 12,
      },
      paint: {
        "text-color": "#000000",
        "text-halo-color": "#ffffff",
        "text-halo-width": 2,
      },
    },
  ],
};

export const bounds: LayerConfig = {
  id: "bounds",
  label: "Bounds of Switzerland",
  visible: false,
  source: "bounds",
  sourceConfig: {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [5.9559, 45.818],
                [10.4921, 45.818],
                [10.4921, 47.8084],
                [5.9559, 47.8084],
                [5.9559, 45.818],
              ],
            ],
          },
        },
      ],
    },
  },
  layers: [
    {
      id: "bounds-line",
      type: "line",
      source: "bounds",
      paint: {
        "line-color": "#808080",
        "line-width": 1,
        "line-dasharray": [1, 1],
      },
    },
  ],
};
