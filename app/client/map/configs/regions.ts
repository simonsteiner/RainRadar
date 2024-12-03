import { LayerConfig } from "../types";

export const swissNutsRegions: LayerConfig = {
  id: "swiss-nuts-regions",
  label: "Swiss NUTS Regions",
  source: "swiss-nuts-regions",
  layers: [
    {
      id: "swiss-nuts-regions-fill",
      type: "fill",
      source: "swiss-nuts-regions",
      paint: {
        "fill-color": [
          "match",
          ["get", "id"],
          "CH01",
          "#B5DCC6",
          "CH02",
          "#D8E876",
          "CH03",
          "#D8D3E8",
          "CH04",
          "#F7C5DA",
          "CH05",
          "#FFFCC6",
          "CH06",
          "#F5C48F",
          "CH07",
          "#F6C7BB",
          "#cccccc",
        ],
        "fill-opacity": 0.15,
      },
    },
    {
      id: "swiss-nuts-regions-layer",
      type: "line",
      source: "swiss-nuts-regions",
      paint: {
        "line-color": "#666666",
        "line-width": 1,
        "line-opacity": 0.15,
      },
    },
    {
      id: "swiss-nuts-regions-labels",
      type: "symbol",
      source: "swiss-nuts-regions",
      minzoom: 9,
      maxzoom: 11,
      layout: {
        "text-field": ["get", "name"],
        "text-size": 16,
        "text-anchor": "center",
        "text-justify": "center",
        "text-variable-anchor": ["center"],
        "text-radial-offset": 0,
        "text-allow-overlap": false,
        "symbol-placement": "point",
      },
      paint: {
        "text-color": [
          "match",
          ["get", "id"],
          "CH01",
          "#85AC96",
          "CH02",
          "#A8B856",
          "CH03",
          "#A8A3B8",
          "CH04",
          "#C795AA",
          "CH05",
          "#CFCC96",
          "CH06",
          "#C5946F",
          "CH07",
          "#C6978B",
          "#666666",
        ],
        "text-opacity": 0.15,
        "text-halo-color": "#bbbbbb",
        "text-halo-width": 1,
      },
    },
  ],
  sourceConfig: {
    type: "geojson",
    data: "geojson/swiss-nuts-regions.geojson",
  },
};

export const regionCenter: LayerConfig = {
  id: "region-center",
  label: "Swiss NUTS Regions Labels",
  source: "region-center",
  layers: [
    {
      id: "region-center-labels",
      type: "symbol",
      source: "region-center",
      minzoom: 6,
      maxzoom: 9,
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
        "text-size": 16,
      },
      paint: {
        "text-color": ["get", "color"],
        "text-opacity": 0.15,
        "text-halo-color": "#bbbbbb",
        "text-halo-width": 1,
      },
    },
  ],
  sourceConfig: {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [7.384803, 46.201399] },
          properties: { id: "CH01", color: "#85AC96", name: "Genferseeregion" },
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [7.433405, 46.816867] },
          properties: {
            id: "CH02",
            color: "#A8B856",
            name: "Espace Mittelland",
          },
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [8.107355, 47.429755] },
          properties: {
            id: "CH03",
            color: "#A8A3B8",
            name: "Grossregion Nordwestschweiz",
          },
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [8.654879, 47.41295] },
          properties: { id: "CH04", color: "#C795AA", name: "Zürich" },
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [9.374251, 46.810215] },
          properties: { id: "CH05", color: "#CFCC96", name: "Ostschweiz" },
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [8.420687, 46.968408] },
          properties: { id: "CH06", color: "#C5946F", name: "Zentralschweiz" },
        },
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [8.808256, 46.296012] },
          properties: { id: "CH07", color: "#C6978B", name: "Tessin" },
        },
      ],
    },
  },
};
