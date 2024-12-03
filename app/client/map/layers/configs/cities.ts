
import { LayerConfig } from '../types';

export const swissCities: LayerConfig = {
  id: "swiss-cities",
  label: "Swiss Cities",
  source: "swiss-cities",
  layers: [
    {
      id: "swiss-cities-layer",
      type: "circle",
      source: "swiss-cities",
      paint: {
        "circle-radius": 1.5,
        "circle-color": "#ffffff",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#000000",
      },
      filter: [">=", ["+", 1.25, ["zoom"]], ["get", "minzoom"]],
    },
    {
      id: "swiss-cities-labels",
      type: "symbol",
      source: "swiss-cities",
      layout: {
        "text-field": ["get", "place"],
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
      filter: [">=", ["+", 1.25, ["zoom"]], ["get", "minzoom"]],
    },
  ],
  sourceConfig: {
    type: "geojson",
    data: "geojson/swiss-cities.geojson",
  },
};