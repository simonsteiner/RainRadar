import { Map, GeoJSONSource } from "maplibre-gl";
import { GeoJSONFeatureCollection } from "../geojson/types";

const PRECIPITATION_LAYERS = {
  source: "precipitation-rate",
  layers: {
    fill: "precipitation-rate-layer",
    outline: "precipitation-rate-outline",
  },
};

function removePrecipitationLayers(map: Map) {
  if (map.getSource(PRECIPITATION_LAYERS.source)) {
    map.removeLayer(PRECIPITATION_LAYERS.layers.fill);
    map.removeLayer(PRECIPITATION_LAYERS.layers.outline);
    map.removeSource(PRECIPITATION_LAYERS.source);
  }
}

function createPrecipitationSource(map: Map) {
  map.addSource(PRECIPITATION_LAYERS.source, {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
  });

  if (!map.getSource(PRECIPITATION_LAYERS.source)) {
    throw new Error("Failed to create precipitation source");
  }
}

function addPrecipitationLayers(map: Map) {
  map.addLayer({
    id: PRECIPITATION_LAYERS.layers.fill,
    type: "fill",
    source: PRECIPITATION_LAYERS.source,
    paint: {
      "fill-color": ["get", "color"],
      "fill-opacity": 0.5,
    },
  });

  map.addLayer({
    id: PRECIPITATION_LAYERS.layers.outline,
    type: "line",
    source: PRECIPITATION_LAYERS.source,
    paint: {
      "line-color": ["get", "color"],
      "line-width": 1,
      "line-opacity": 0.8,
    },
  });
}

export function displayPrecipitationData(
  map: Map,
  geojson: GeoJSONFeatureCollection
) {
  if (!map) {
    throw new Error("Map object is undefined");
  }

  try {
    removePrecipitationLayers(map);
    createPrecipitationSource(map);
    (map.getSource(PRECIPITATION_LAYERS.source) as GeoJSONSource).setData(
      geojson
    );
    addPrecipitationLayers(map);
  } catch (error) {
    console.error("Error displaying precipitation data:", error);
    throw error;
  }
}
