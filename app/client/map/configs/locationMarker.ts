import { LayerConfig } from "../types";

export const locationMarker: LayerConfig = {
  id: "location-marker",
  label: "Location Marker",
  visible: true,
  source: "location-marker",
  sourceConfig: {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  },
  layers: [
    {
      id: "location-marker",
      type: "circle",
      source: "location-marker",
      paint: {
        "circle-radius": 4,
        "circle-color": "#ff0000",
        "circle-opacity": 0.8,
      },
    },
  ],
};
